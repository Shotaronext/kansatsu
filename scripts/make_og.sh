#!/bin/bash
# make_og.sh — OGP 用の JPEG（1200×630、中央を切り出す）を作る
# 使い方:  bash scripts/make_og.sh <入力画像> <id>     → public/og/<id>.jpg
#          bash scripts/make_og.sh --all                 → 全投稿 + About をまとめて作り直す
# AVIF は OGP 非対応なので、静止画（avif / webp）から JPEG を書き出す。
set -euo pipefail
cd "$(dirname "$0")/.."
FF="${FFMPEG:-$(command -v ffmpeg || echo /opt/homebrew/bin/ffmpeg)}"
mkdir -p public/og

og() { # $1=入力 $2=id
  "$FF" -hide_banner -loglevel error -y -i "$1" -frames:v 1 \
    -vf "crop='min(iw,ih*1200/630)':'min(ih,iw*630/1200)',scale=1200:630:flags=lanczos,format=yuvj420p" \
    -q:v 3 "public/og/$2.jpg"
  echo "public/og/$2.jpg"
}

if [ "${1:-}" = "--all" ]; then
  for f in src/content/posts/*/index.ja.md; do
    id=$(basename "$(dirname "$f")")
    # still があればそれ、なければ images の1枚目
    img=$(sed -n 's/^still: *"\(.*\)"/\1/p' "$f")
    [ -z "$img" ] && img=$(sed -n 's/^images: *\["\([^"]*\)".*/\1/p' "$f")
    og "public/img/$img" "$id"
  done
  og public/img/train.webp about
else
  og "$1" "$2"
fi
