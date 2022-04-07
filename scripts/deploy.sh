#!/usr/bin/env bash

set -euo pipefail

thisDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
rootDir="$(dirname "${thisDir}")"

main() {
	SECONDS=0
	echo "copying files to S3..."
	local domain=crystalistracker.tmont.com
	aws s3 cp --recursive --acl public-read "${rootDir}/public/" s3://${domain}/

	local distId

	echo "querying for CloudFront distribution..."
	distId=$(
		aws cloudfront list-distributions \
			--query "DistributionList.Items[?contains(Aliases.Items, '${domain}')].Id | [0]" \
			--output text
	)

	if [[ -z "${distId}" ]]; then
		echo "failed to find cloudfront distribution"
		exit 1
	fi

	echo "found distribution \"${distId}\", invalidating CloudFront cache..."

	aws cloudfront create-invalidation \
		--distribution-id "${distId}" \
		--paths '/*'

	echo "all done in ${SECONDS}s"
}

main "$@"
