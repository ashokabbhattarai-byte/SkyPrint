import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const DROPLETS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  lane: i % 4, // 0=C, 1=M, 2=Y, 3=K
  seed: (i * 37) % 100,
  xJitter: ((i * 53) % 18) - 9,
}));

const INK_COLORS = ["#079BD3", "#EC4899", "#FACC15", "#111827"];

export const PrintingIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / Math.max(1, durationInFrames - 1);

  // Shot 1 (0..0.42): Wide Studio Press dolly-in
  // Shot 2 (0.38..0.82): Macro CMYK Printheads with live ink mist & carriage motion
  // Shot 3 (0.78..1.0): Finished Print & Signage reveal, seamless loop back to Shot 1
  const shot1Opacity = interpolate(p, [0, 0.36, 0.45, 0.92, 1], [1, 1, 0, 0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shot2Opacity = interpolate(p, [0.35, 0.44, 0.76, 0.84], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shot3Opacity = interpolate(p, [0.74, 0.82, 0.93, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const wideScale = interpolate(p, [0, 0.45], [1.0, 1.11], {
    extrapolateRight: "clamp",
  });
  const wideX = interpolate(p, [0, 0.45], [0, -28], {
    extrapolateRight: "clamp",
  });

  const macroScale = interpolate(p, [0.35, 0.85], [1.04, 1.14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const carriageOsc = Math.sin(p * Math.PI * 18) * 16;

  // Rolling paper sheen across the press feed roll
  const rollerSheenX = interpolate((p * 2.5) % 1, [0, 1], [-30, 130]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a111e", overflow: "hidden" }}>
      {/* SHOT 1: Wide Commercial Press */}
      <AbsoluteFill
        style={{
          opacity: shot1Opacity,
          transform: `scale(${wideScale}) translateX(${wideX}px)`,
        }}
      >
        <Img
          src={staticFile("images/studio-press.webp")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Animated specular light passing across white paper feed roll */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(108deg, transparent ${rollerSheenX - 16}%, rgba(57,201,233,0.16) ${rollerSheenX}%, transparent ${rollerSheenX + 16}%)`,
            mixBlendMode: "screen",
          }}
        />
      </AbsoluteFill>

      {/* SHOT 2: Macro CMYK Printheads with live carriage oscillation & ink mist */}
      <AbsoluteFill
        style={{
          opacity: shot2Opacity,
          transform: `scale(${macroScale}) translateX(${carriageOsc}px)`,
        }}
      >
        <Img
          src={staticFile("images/cmyk-printheads.webp")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Animated ink droplet spray plumes under the C/M/Y/K heads */}
        {DROPLETS.map((d) => {
          const cycle = ((p * 6 + d.seed / 100) % 1);
          const nozzleX = 305 + d.lane * 195 + d.xJitter;
          const dropY = 475 + cycle * 95;
          const alpha = Math.sin(cycle * Math.PI) * 0.72;
          return (
            <div
              key={d.id}
              style={{
                position: "absolute",
                left: nozzleX,
                top: dropY,
                width: 4,
                height: 10,
                borderRadius: 99,
                backgroundColor: INK_COLORS[d.lane],
                opacity: alpha,
                filter: "blur(0.8px)",
                boxShadow: `0 0 8px ${INK_COLORS[d.lane]}`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* SHOT 3: Finished Print Deliverables */}
      <AbsoluteFill
        style={{
          opacity: shot3Opacity,
          transform: `scale(${interpolate(p, [0.74, 1], [1.06, 1.0])})`,
        }}
      >
        <Img
          src={staticFile("images/packaging-and-cards.webp")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Cinematic lighting & vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 60% 45%, transparent 32%, rgba(8,14,26,0.58) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
