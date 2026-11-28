"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export interface FrameSequenceController {
  /** Draw the frame for a 0–1 progress value. Cheap to call every animation frame. */
  render: (progress: number) => void;
}

interface AdaptiveFrameSequenceProps {
  controllerRef: React.RefObject<FrameSequenceController | null>;
  posterSrc?: string;
  className?: string;
}

type Frame = ImageBitmap | HTMLImageElement;

const SETS = {
  desktop: { basePath: "/sequences/printing-desktop", total: 134, w: 1280, h: 720 },
  mobile: { basePath: "/sequences/printing-mobile", total: 108, w: 720, h: 405 },
} as const;

const frameSrc = (basePath: string, index: number) =>
  `${basePath}/frame-${String(index + 1).padStart(5, "0")}.webp`;

/**
 * Coarse-to-fine load order: every 16th frame first, then 8th, 4th, 2nd, 1st.
 * On a slow link (e.g. a tunnel) the whole timeline becomes scrubbable within
 * the first ~10 requests, and detail fills in afterwards.
 */
function buildLoadOrder(total: number, stride: number): number[] {
  const order: number[] = [];
  const seen = new Set<number>();
  const push = (i: number) => {
    if (i >= 0 && i < total && i % stride === 0 && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };
  push(0);
  push(total - 1 - ((total - 1) % stride));
  for (const step of [16, 8, 4, 2, 1]) {
    for (let i = 0; i < total; i += step) push(i);
  }
  return order;
}

async function decodeFrame(src: string, signal: AbortSignal): Promise<Frame> {
  // createImageBitmap(blob) decodes off the main thread, so drawing a new
  // frame during scroll never stalls on image decode.
  if (typeof createImageBitmap === "function") {
    const res = await fetch(src, { signal });
    if (!res.ok) throw new Error(`Frame ${src} returned ${res.status}`);
    return createImageBitmap(await res.blob());
  }
  const img = new window.Image();
  img.src = src;
  await img.decode();
  return img;
}

/**
 * Scroll-scrubbed frame sequence on a 2D canvas.
 * - SSR poster paints immediately; the canvas fades in once frame 1 is ready.
 * - Picks the 720p or 405p set once on mount, so phones never download desktop frames.
 * - The canvas backing store matches source resolution, not screen DPR: the
 *   source is 1280px wide, so a 2x retina canvas would only cost fill-rate.
 * - Draws only when the visible frame actually changes.
 */
export function AdaptiveFrameSequence({
  controllerRef,
  posterSrc = "/images/hero-flex-press-poster.webp",
  className = "",
}: AdaptiveFrameSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    const set = isMobile ? SETS.mobile : SETS.desktop;
    const stride = conn?.saveData ? 3 : 1;

    const frames: (Frame | null)[] = new Array(set.total).fill(null);
    const controller = new AbortController();
    let lastProgress = 0;
    let drawn: Frame | null = null;
    let drawnIndex = -1;

    const nearest = (index: number): [Frame | null, number] => {
      if (frames[index]) return [frames[index], index];
      for (let d = 1; d < set.total; d++) {
        const lo = index - d;
        const hi = index + d;
        if (lo >= 0 && frames[lo]) return [frames[lo], lo];
        if (hi < set.total && frames[hi]) return [frames[hi], hi];
      }
      return [null, -1];
    };

    const sizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      // CSS px per source px when the frame is drawn "cover".
      const cover = Math.max(rect.width / set.w, rect.height / set.h);
      const dpr = window.devicePixelRatio || 1;
      const scale = Math.min(dpr, Math.max(1, 1 / cover));
      const w = Math.round(rect.width * scale);
      const h = Math.round(rect.height * scale);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        ctx.imageSmoothingQuality = "high";
        drawn = null;
      }
    };

    const paint = (frame: Frame) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const fw = frame.width;
      const fh = frame.height;
      const s = Math.max(cw / fw, ch / fh);
      const dw = fw * s;
      const dh = fh * s;
      ctx.drawImage(frame, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const render = (progress: number) => {
      lastProgress = progress;
      const target = Math.round(Math.max(0, Math.min(1, progress)) * (set.total - 1));
      const [frame, index] = nearest(target);
      if (!frame || frame === drawn) return;
      paint(frame);
      drawn = frame;
      drawnIndex = index;
    };

    controllerRef.current = { render };

    const ro = new ResizeObserver(() => {
      sizeCanvas();
      render(lastProgress);
    });
    ro.observe(canvas);
    sizeCanvas();

    const queue = buildLoadOrder(set.total, stride);
    const concurrency = isMobile ? 4 : 6;

    const worker = async () => {
      while (queue.length && !controller.signal.aborted) {
        const index = queue.shift()!;
        try {
          frames[index] = await decodeFrame(frameSrc(set.basePath, index), controller.signal);
        } catch {
          if (controller.signal.aborted) return;
          if (index === 0) setFailed(true);
          continue;
        }
        if (index === 0) setFirstFrameReady(true);
        // Repaint if this frame is closer to the wanted one than what is on screen.
        const want = Math.round(lastProgress * (set.total - 1));
        if (drawnIndex === -1 || Math.abs(index - want) < Math.abs(drawnIndex - want)) {
          render(lastProgress);
        }
      }
    };
    for (let i = 0; i < concurrency; i++) void worker();

    return () => {
      controller.abort();
      ro.disconnect();
      controllerRef.current = null;
      for (const f of frames) if (f && "close" in f) f.close();
    };
  }, [controllerRef]);

  return (
    <div className={`relative h-full w-full overflow-hidden bg-[#153B60] ${className}`}>
      <Image
        src={posterSrc}
        alt="Wide-format flex printing machine at Sky Print"
        fill
        priority
        sizes="100vw"
        className={`object-cover object-center transition-opacity duration-500 ${
          firstFrameReady && !failed ? "opacity-0" : "opacity-100"
        }`}
      />
      {!failed && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`relative z-10 block h-full w-full transition-opacity duration-500 ${
            firstFrameReady ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
