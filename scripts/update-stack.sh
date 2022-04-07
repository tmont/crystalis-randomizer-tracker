#!/bin/bash

set -euo pipefail

getStackAction() {
    local stackName=$1
    local region=$2
    local command="create"

    aws cloudformation describe-stacks \
        --stack-name "${stackName}" \
        --output text \
        --region "${region}" &> /dev/null

    # shellcheck disable=SC2181
    if [[ $? -eq 0 ]]; then
        command="update"
    fi

    echo "${command}"
}

checkError() {
    # shellcheck disable=SC2181
    if [[ $? -ne 0 ]]; then
        echo "$1"
        exit 1
    fi
}

usage() {
    cat << USAGE
Updates or creates a CloudFormation stack

Usage: $0 [--region region] template.yaml

Options:

  --region region  The region to create/update the stack in (us-west-2)
  -h|--help        Show this message

Example:
  $0 path/to/template.yaml
USAGE
}

main() {
    local cfnFile=
    local region=us-west-2

    parseArgs() {
        while [[ $# -gt 0 ]]; do
            local key="$1"
            shift

            case "${key}" in
                -h | --help)
                    usage
                    exit 0
                    ;;
                --region)
                    region=$1
                    shift
                    ;;
                *)
                    if [[ -n "${cfnFile}" ]]; then
                        echo "only one template file allowed"
                        exit 1
                    fi
                    cfnFile="${key}"
                    ;;
            esac
        done
    }

    parseArgs "$@"

    if [[ ! -f "${cfnFile}" ]]; then
        echo "template \"${cfnFile}\" does not exist"
        exit 1
    fi

    local stackName
    stackName=$(basename "${cfnFile%.*}")

    local action
    action=$(getStackAction "${stackName}" "${region}")
    local command=
    local extraOpts=()
    if [ "${action}" = "create" ]; then
        command="create-stack"
        extraOpts+=(--on-failure DO_NOTHING)
    else
        command="update-stack"
    fi

    local domain=crystalistracker.tmont.com
    local hostedZoneName=tmont.com

    echo "looking up CDN certificate for domain ${domain} in us-east-1..."
    local certArn
    certArn=$(
        aws acm list-certificates \
            --region us-east-1 \
            --query "CertificateSummaryList[?DomainName == '${domain}'].CertificateArn" \
            --output text
    )

    if [[ -z "${certArn}" ]]; then
        echo "certificate not found in us-east-1 matching domain \"${domain}\"."
        exit 1
    fi

    local shouldContinue
    read -r -p "${action} stack ${stackName} in ${region} (profile: ${AWS_PROFILE}), continue? [y/n] " shouldContinue
    if [ "${shouldContinue}" != "y" ]; then
        echo "ok bye"
        exit
    fi

    aws cloudformation ${command} \
        --stack-name "${stackName}" \
        "${extraOpts[@]}" \
        --parameters \
            ParameterKey=DomainName,ParameterValue="${domain}" \
            ParameterKey=CertArn,ParameterValue="${certArn}" \
            ParameterKey=HostedZoneName,ParameterValue="${hostedZoneName}." \
        --template-body "file://${cfnFile}" \
        --region "${region}" \
        > /dev/null

    checkError "${command} failed"
    echo

    local -r tailStackEvents="node_modules/.bin/tail-stack-events"
    if [ -x "${tailStackEvents}" ]; then
        "${tailStackEvents}" --region "${region}" --stack-name "${stackName}" --die --outputs
    fi

    echo
    echo "finished in ${SECONDS}s"
}

main "$@"
