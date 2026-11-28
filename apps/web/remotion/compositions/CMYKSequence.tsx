import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const MIST_PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  channel: i % 4, // C, M, Y, K
  phase: ((i * 29) % 100) / 100,
  xOffset: ((i * 47) % 44) - 22,
  size: 2.5 + (i % 3) * 1.4,
}));

const CMYK_HEX = ["#079BD3", "#EC4899", "#FACC15", "#111827"];

export const CMYKSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / Math.max(1, durationInFrames - 1);

  // Stage 01 (0.00 -> 0.22): Wide studio press, blank white paper roll feeding
  // Stage 02-03 (0.20 -> 0.72): Macro CMYK printheads sweeping & laying ink passes
  // Stage 04 (0.70 -> 0.86): Finished printed sheets & precision finishing
  // Stage 05 (0.84 -> 1.00): Complete product ecosystem (packaging + signage)

  const pressOpacity = interpolate(p, [0, 0.2, 0.28], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headsOpacity = interpolate(p, [0.18, 0.26, 0.68, 0.76], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const finishedOpacity = interpolate(p, [0.68, 0.76, 0.85, 0.91], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const showcaseOpacity = interpolate(p, [0.85, 0.92, 1], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Camera zoom & pan per stage
  const pressScale = interpolate(p, [0, 0.28], [1.0, 1.18], {
    extrapolateRight: "clamp",
  });
  const pressY = interpolate(p, [0, 0.28], [0, -18], {
    extrapolateRight: "clamp",
  });

  const headsScale = interpolate(p, [0.18, 0.76], [1.02, 1.13], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const carriageSweepX = Math.sin(p * Math.PI * 16) * 28;

  // Paper surface progressively receiving printed color bars & artwork under the macro heads
  const cyanBand = interpolate(p, [0.22, 0.38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const magentaBand = interpolate(p, [0.34, 0.50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const yellowBand = interpolate(p, [0.46, 0.62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const keyBand = interpolate(p, [0.56, 0.72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Laser alignment sweep in Stage 01
  const laserPos = interpolate(p, [0.02, 0.22], [22, 78], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Specular paper gloss sweep in Stage 04
  const glossSweep = interpolate(p, [0.68, 0.88], [-25, 125], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0c1322", overflow: "hidden" }}>
      {/* STAGE 01: Blank Canvas Entering Wide-Format Press */}
      <AbsoluteFill
        style={{
          opacity: pressOpacity,
          transform: `scale(${pressScale}) translateY(${pressY}px)`,
        }}
      >
        <Img
          src={staticFile("images/studio-press.webp")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Alignment laser scan across paper intake */}
        <div
          style={{
            position: "absolute",
            top: `${laserPos}%`,
            left: "28%",
            right: "18%",
            height: 2,
            background:
              "linear-gradient(90deg, transparent, #39C9E9, #FFFFFF, #39C9E9, transparent)",
            boxShadow: "0 0 18px rgba(57,201,233,0.9)",
          }}
        />
      </AbsoluteFill>

      {/* STAGE 02 & 03: Macro Printheads + Live CMYK Spray + Paper Ink Buildup */}
      <AbsoluteFill
        style={{
          opacity: headsOpacity,
          transform: `scale(${headsScale}) translateX(${carriageSweepX}px)`,
        }}
      >
        <Img
          src={staticFile("images/cmyk-printheads.webp")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Fine pressurized CMYK mist particles aligned directly under the metallic nozzle plates */}
        {MIST_PARTICLES.map((m) => {
          const activeChannel =
            (m.channel === 0 && cyanBand > 0.05) ||
            (m.channel === 1 && magentaBand > 0.05) ||
            (m.channel === 2 && yellowBand > 0.05) ||
            (m.channel === 3 && keyBand > 0.05);
          if (!activeChannel) return null;

          const cycle = (p * 12 + m.phase) % 1;
          const nozzleCenters = [342, 528, 725, 860];
          const x = nozzleCenters[m.channel] + m.xOffset * 0.7;
          const y = 436 + cycle * 72;
          return (
            <div
              key={m.id}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: m.size,
                height: m.size * 2.2,
                borderRadius: 99,
                backgroundColor: CMYK_HEX[m.channel],
                opacity: Math.sin(cycle * Math.PI) * 0.7,
                filter: "blur(0.7px)",
                boxShadow: `0 0 8px ${CMYK_HEX[m.channel]}`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* STAGE 04: Finished Printed Material & Precision Finishing */}
      <AbsoluteFill
        style={{
          opacity: finishedOpacity,
          transform: `scale(${interpolate(p, [0.68, 0.91], [1.08, 1.0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })})`,
        }}
      >
        <Img
          src={staticFile("images/packaging-and-cards.webp")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(112deg, transparent ${glossSweep - 15}%, rgba(255,255,255,0.34) ${glossSweep}%, transparent ${glossSweep + 15}%)`,
          }}
        />
      </AbsoluteFill>

      {/* STAGE 05: Beyond Printing — Signage, Packaging & Advertising Ecosystem */}
      <AbsoluteFill
        style={{
          opacity: showcaseOpacity,
          transform: `scale(${interpolate(p, [0.85, 1.0], [1.0, 1.06], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })})`,
        }}
      >
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
          <div style={{ flex: 1.15, position: "relative", overflow: "hidden" }}>
            <Img
              src={staticFile("images/large-format-signage.webp")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ width: 4, backgroundColor: "#079BD3" }} />
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <Img
              src={staticFile("images/finishing-binding.webp")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ width: 4, backgroundColor: "#F7941D" }} />
          <div style={{ flex: 0.95, position: "relative", overflow: "hidden" }}>
            <Img
              src={staticFile("images/promotional-gifts.webp")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
