#!/usr/bin/env bash
set -euo pipefail

RAW_FRAMES_DIR="${1:-.tmp-frames/printing-process}"
OUT_DIR="${2:-public/sequences/printing-process}"
QUALITY="${3:-82}"

if [ ! -d "$RAW_FRAMES_DIR" ]; then
  echo "Error: Raw frames directory not found: $RAW_FRAMES_DIR" >&2
  exit 1
fi

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

echo "==> Optimizing frames to WebP (q=${QUALITY})..."
for src in "$RAW_FRAMES_DIR"/frame-*.png; do
  base=$(basename "$src" .png)
  cwebp -quiet -q "$QUALITY" "$src" -o "$OUT_DIR/${base}.webp"
done

COUNT=$(ls -1 "$OUT_DIR"/frame-*.webp | wc -l | tr -d ' ')
TOTAL_KB=$(du -sk "$OUT_DIR" | awk '{print $1}')
echo "==> Optimized $COUNT WebP frames in $OUT_DIR (${TOTAL_KB} KB total)"

if [ -f "public/videos/hero-printing-raw.mp4" ]; then
  echo "==> Optimizing hero MP4 and WebM..."
  ffmpeg -y -i public/videos/hero-printing-raw.mp4 \
    -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart -an \
    public/videos/hero-printing.mp4
  ffmpeg -y -i public/videos/hero-printing-raw.mp4 \
    -c:v libvpx-vp9 -crf 32 -b:v 0 -an \
    public/videos/hero-printing.webm
  rm -f public/videos/hero-printing-raw.mp4
fi
