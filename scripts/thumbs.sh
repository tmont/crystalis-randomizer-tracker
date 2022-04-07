#!/usr/bin/env bash

set -euo pipefail

dir=public/images/locations

for img in "${dir}"/*.png; do
    if [[ "${img}" =~ -square.png$ ]]; then
        continue
    fi

    thumbName=${img%.*}-square.png
    rm -f "${thumbName}"
    height=$(magick identify -format '%h' "${img}")
    commands=()
    if [[ "${height}" -lt 24 ]]; then
        commands+=(-gravity center -background transparent -extent x24)
    fi
    commands+=(-filter point -gravity center -background transparent -thumbnail 44x44 -extent 44x44)

    echo "${commands[@]}"

    magick "${img}" "${commands[@]}" "${thumbName}"
done
