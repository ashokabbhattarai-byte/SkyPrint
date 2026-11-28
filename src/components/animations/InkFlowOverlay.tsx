"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Global scroll-driven ink flow system across the landing page.
 * Renders four smooth architectural ink streams (Sky Blue, Print Cyan,
 * Sun Orange, Deep Navy) that flow downward in sync with scroll progress
 * and retract cleanly when scrolling back up.
 */
export function InkFlowOverlay() {
  const streamRefs = useRef<(SVGPathElement | null)[]>([]);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const paths = streamRefs.current.filter(Boolean) as SVGPathElement[];
    const lengths = paths.map((p) => p.getTotalLength());

    paths.forEach((p, idx) => {
      const len = lengths[idx];
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = reducedMotion ? "0" : `${len}`;
    });

    if (reducedMotion) return;

    let raf = 0;

    const update = () => {
      const docHeight = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const p = Math.max(0, Math.min(1, window.scrollY / docHeight));

      paths.forEach((path, idx) => {
        const len = lengths[idx];
        const lag = idx * 0.04;
        const localP = Math.max(0, Math.min(1, (p - lag) / (1 - lag)));
        path.style.strokeDashoffset = `${len * (1 - localP)}`;
      });

      if (barRef.current) {
        barRef.current.style.transform = `scaleY(${p})`;
      }
      if (dotRef.current) {
        dotRef.current.style.top = `${p * 100}%`;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion]);

  return (
    <>
      {/* Flowing architectural CMYK ink curves along the page margin */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-y-0 right-0 z-20 hidden w-24 overflow-hidden lg:block"
      >
        <svg
          viewBox="0 0 96 1000"
          preserveAspectRatio="none"
          className="h-full w-full opacity-55"
        >
          <path
            ref={(el) => {
              streamRefs.current[0] = el;
            }}
            d="M 68 0 C 28 160, 88 320, 48 500 C 16 660, 82 820, 54 1000"
            fill="none"
            stroke="#078FCB"
            strokeWidth="2.2"
          />
          <path
            ref={(el) => {
              streamRefs.current[1] = el;
            }}
            d="M 74 0 C 34 165, 92 325, 54 500 C 22 665, 86 825, 60 1000"
            fill="none"
            stroke="#36B9D8"
            strokeWidth="1.6"
          />
          <path
            ref={(el) => {
              streamRefs.current[2] = el;
            }}
            d="M 80 0 C 42 170, 94 330, 60 500 C 30 670, 90 830, 66 1000"
            fill="none"
            stroke="#F7941D"
            strokeWidth="1.6"
          />
          <path
            ref={(el) => {
              streamRefs.current[3] = el;
            }}
            d="M 86 0 C 50 175, 96 335, 66 500 C 38 675, 94 835, 72 1000"
            fill="none"
            stroke="#153B60"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* Minimalist left registration ink-depth rail */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-28 bottom-24 left-3 z-20 hidden w-[3px] rounded-full bg-slate-200/70 xl:block"
      >
        <div
          ref={barRef}
          className="h-full w-full origin-top scale-y-0 rounded-full bg-gradient-to-b from-[#078FCB] via-[#36B9D8] to-[#F7941D]"
        />
        <div
          ref={dotRef}
          className="absolute -left-[3.5px] h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white bg-[#F7941D] shadow-xs"
        />
      </div>
    </>
  );
}
