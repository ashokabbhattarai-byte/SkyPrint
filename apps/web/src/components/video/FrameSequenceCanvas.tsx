"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useFrameSequencePreloader } from "@/hooks/useMediaPreloader";

interface FrameSequenceCanvasProps {
  progress: number;
  totalFrames?: number;
  basePath?: string;
  posterSrc?: string;
  className?: string;
}

export function FrameSequenceCanvas({
  progress,
  totalFrames = 120,
  basePath = "/sequences/printing-process",
  posterSrc = "/images/studio-press.webp",
  className = "",
}: FrameSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(progress);
  const lastDrawnImgRef = useRef<HTMLImageElement | null>(null);

  const { firstFrameReady, failed, getNearestFrame, loadedCount } =
    useFrameSequencePreloader({
      totalFrames,
      basePath,
      extension: "webp",
      enabled: true,
    });

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        lastDrawnImgRef.current = null;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const clamped = Math.max(0, Math.min(1, progressRef.current));
      const frameIndex = Math.round(clamped * (totalFrames - 1));
      const img = getNearestFrame(frameIndex);

      if (
        img &&
        img.complete &&
        img.naturalWidth > 0 &&
        img !== lastDrawnImgRef.current
      ) {
        const cw = canvas.width;
        const ch = canvas.height;
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = cw / ch;

        let drawW = cw;
        let drawH = ch;
        let offsetX = 0;
        let offsetY = 0;

        if (canvasRatio > imgRatio) {
          drawW = cw;
          drawH = cw / imgRatio;
          offsetY = (ch - drawH) / 2;
        } else {
          drawH = ch;
          drawW = ch * imgRatio;
          offsetX = (cw - drawW) / 2;
        }

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
        lastDrawnImgRef.current = img;
      }

      rafId = window.requestAnimationFrame(draw);
    };

    rafId = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [totalFrames, getNearestFrame]);

  if (failed) {
    return (
      <div className={`relative h-full w-full overflow-hidden ${className}`}>
        <Image
          src={posterSrc}
          alt="Commercial printing press sequence fallback"
          fill
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full overflow-hidden bg-[#edf2f7] ${className}`}>
      {!firstFrameReady && (
        <Image
          src={posterSrc}
          alt="Commercial printing press loading poster"
          fill
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
        />
      )}
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        aria-label="Scroll-driven CMYK frame sequence"
      />
      <div className="pointer-events-none absolute right-4 bottom-4 rounded-full border border-slate-900/10 bg-white/90 px-3 py-1 font-mono text-[11px] text-slate-700 shadow-xs">
        FFmpeg WebP Seq · {loadedCount}/{totalFrames}
      </div>
    </div>
  );
}
