#!/usr/bin/env bash

dir=public/dist
rm -rf "${dir}"
mkdir -p "${dir}"

args=()
if [[ $1 = "--watch" ]]; then
    args+=("--watch")
fi

node_modules/.bin/esbuild \
    --bundle \
    --target=es2017 \
    --platform=browser \
    --outdir="${dir}" \
    --minify \
    "${args[@]}" \
    public/src/crystalis.js \
    public/src/crystalis.css

