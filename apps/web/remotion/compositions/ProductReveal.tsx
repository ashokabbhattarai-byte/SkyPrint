import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const SLIDES = [
  "images/packaging-and-cards.webp",
  "images/large-format-signage.webp",
  "images/finishing-binding.webp",
  "images/promotional-gifts.webp",
];

export const ProductReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const slice = durationInFrames / SLIDES.length;

  return (
    <AbsoluteFill style={{ backgroundColor: "#f7f9fc" }}>
      {SLIDES.map((src, i) => {
        const start = i * slice;
        const opacity = interpolate(
          frame,
          [start - 8, start + 6, start + slice - 6, start + slice + 8],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const scale = interpolate(
          frame,
          [start, start + slice],
          [1.0, 1.06],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <AbsoluteFill key={src} style={{ opacity, transform: `scale(${scale})` }}>
            <Img
              src={staticFile(src)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
