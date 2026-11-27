#!/usr/bin/env bash
set -euo pipefail

INPUT_VIDEO="${1:-public/videos/printing-process.mp4}"
RAW_FRAMES_DIR="${2:-.tmp-frames/printing-process}"
FPS="${3:-15}"
SCALE_WIDTH="${4:-1280}"

if [ ! -f "$INPUT_VIDEO" ]; then
  echo "Error: Input video not found at $INPUT_VIDEO" >&2
  exit 1
fi

echo "==> Inspecting video with ffprobe: $INPUT_VIDEO"
ffprobe -v error -show_format -show_streams -of json "$INPUT_VIDEO" | \
  node -e '
    const fs = require("fs");
    const data = JSON.parse(fs.readFileSync(0, "utf8"));
    const v = (data.streams || []).find((s) => s.codec_type === "video") || {};
    console.log(JSON.stringify({
      duration_sec: Number(data.format?.duration || 0).toFixed(2),
      size_kb: Math.round(Number(data.format?.size || 0) / 1024),
      codec: v.codec_name,
      resolution: `${v.width}x${v.height}`,
      aspect_ratio: v.display_aspect_ratio || `${v.width}:${v.height}`,
      fps: v.r_frame_rate
    }, null, 2));
  '

rm -rf "$RAW_FRAMES_DIR"
mkdir -p "$RAW_FRAMES_DIR"

echo "==> Extracting frames (${FPS}fps, width=${SCALE_WIDTH}px)..."
ffmpeg -y -i "$INPUT_VIDEO" -vf "fps=${FPS},scale=${SCALE_WIDTH}:-1:flags=lanczos" -q:v 2 "$RAW_FRAMES_DIR/frame-%05d.png"

COUNT=$(ls -1 "$RAW_FRAMES_DIR"/frame-*.png | wc -l | tr -d ' ')
echo "==> Extracted $COUNT frames into $RAW_FRAMES_DIR"
