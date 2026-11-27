"use client";

import { useEffect, useRef, useState } from "react";

interface UseFrameSequenceOptions {
  totalFrames: number;
  basePath: string;
  extension?: string;
  enabled?: boolean;
}

export function useFrameSequencePreloader({
  totalFrames,
  basePath,
  extension = "webp",
  enabled = true,
}: UseFrameSequenceOptions) {
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!enabled || totalFrames <= 0) return;

    let cancelled = false;
    imagesRef.current = new Array(totalFrames).fill(null);

    const getSrc = (index: number) => {
      const padded = String(index + 1).padStart(5, "0");
      return `${basePath}/frame-${padded}.${extension}`;
    };

    const loadFrame = (index: number) =>
      new Promise<void>((resolve) => {
        if (cancelled) return resolve();
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (cancelled) return resolve();
          imagesRef.current[index] = img;
          if (index === 0) setFirstFrameReady(true);
          setLoadedCount((c) => c + 1);
          resolve();
        };
        img.onerror = () => {
          if (index === 0 && !cancelled) setFailed(true);
          resolve();
        };
        img.src = getSrc(index);
      });

    // Prioritize first frame + key keyframes (0, 25%, 50%, 75%, 100%)
    const priorityIndices = Array.from(
      new Set([
        0,
        1,
        2,
        Math.floor(totalFrames * 0.25),
        Math.floor(totalFrames * 0.5),
        Math.floor(totalFrames * 0.75),
        totalFrames - 1,
      ])
    ).filter((i) => i >= 0 && i < totalFrames);

    const remainingIndices = Array.from({ length: totalFrames }, (_, i) => i).filter(
      (i) => !priorityIndices.includes(i)
    );

    (async () => {
      await Promise.all(priorityIndices.map(loadFrame));
      const batchSize = 6;
      for (let i = 0; i < remainingIndices.length; i += batchSize) {
        if (cancelled) break;
        const batch = remainingIndices.slice(i, i + batchSize);
        await Promise.all(batch.map(loadFrame));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [totalFrames, basePath, extension, enabled]);

  const getNearestFrame = (index: number): HTMLImageElement | null => {
    const clamped = Math.max(0, Math.min(totalFrames - 1, index));
    if (imagesRef.current[clamped]) return imagesRef.current[clamped];
    for (let offset = 1; offset < totalFrames; offset++) {
      if (clamped - offset >= 0 && imagesRef.current[clamped - offset]) {
        return imagesRef.current[clamped - offset];
      }
      if (clamped + offset < totalFrames && imagesRef.current[clamped + offset]) {
        return imagesRef.current[clamped + offset];
      }
    }
    return null;
  };

  return {
    loadedCount,
    firstFrameReady,
    failed,
    getNearestFrame,
    progressRatio: totalFrames > 0 ? loadedCount / totalFrames : 0,
  };
}
