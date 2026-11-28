"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Box, Film, Layers } from "lucide-react";
import { PRINTING_STAGES } from "@/data/printingStages";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PrintingPress3DCanvas } from "@/components/video/PrintingPress3DCanvas";
import { FrameSequenceCanvas } from "@/components/video/FrameSequenceCanvas";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const STAGE_05_PRODUCTS = [
  "Flex Banners",
  "Business Cards",
  "Brochures",
  "Posters",
  "Signboards",
  "Product Packaging",
  "ID Cards",
  "Promotional Products",
];

const CHANNEL_META = [
  { key: "C" as const, label: "Cyan", color: "#079BD3" },
  { key: "M" as const, label: "Magenta", color: "#EC4899" },
  { key: "Y" as const, label: "Yellow", color: "#F7941D" },
  { key: "K" as const, label: "Black", color: "#111827" },
];

export function PrintingExperience() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinWrapperRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const progressLabelRef = useRef<HTMLSpanElement | null>(null);
  const progressRef = useRef(0);

  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [seqProgress, setSeqProgress] = useState(0);
  const [renderMode, setRenderMode] = useState<"3d" | "sequence">("3d");
  const [isDesktop, setIsDesktop] = useState(true);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const triggerEl = pinWrapperRef.current;
    if (!triggerEl) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: triggerEl,
        start: "top top",
        end: reducedMotion ? "bottom top" : "+=3000",
        pin: !reducedMotion,
        scrub: reducedMotion ? true : 0.55,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;

          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${p})`;
          }
          if (progressLabelRef.current) {
            progressLabelRef.current.textContent = `${Math.round(p * 100)}%`;
          }

          if (renderMode === "sequence") {
            setSeqProgress(p);
          }

          const idx = PRINTING_STAGES.findIndex(
            (st, i) =>
              p >= st.progressStart &&
              (p < st.progressEnd || i === PRINTING_STAGES.length - 1)
          );
          if (idx !== -1) {
            setActiveStageIdx((prev) => (prev !== idx ? idx : prev));
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isDesktop, reducedMotion, renderMode]);

  const handleStageSelect = (idx: number) => {
    const stage = PRINTING_STAGES[idx];
    if (!stage) return;
    const mid = (stage.progressStart + stage.progressEnd) / 2;
    progressRef.current = mid;
    setSeqProgress(mid);
    setActiveStageIdx(idx);
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = `scaleX(${mid})`;
    }
    if (progressLabelRef.current) {
      progressLabelRef.current.textContent = `${Math.round(mid * 100)}%`;
    }
  };

  const activeStage = PRINTING_STAGES[activeStageIdx] ?? PRINTING_STAGES[0];

  return (
    <section
      id="printing-process"
      ref={sectionRef}
      aria-label="Scroll-driven printing process"
      className="relative bg-[#F7F9FC] border-y border-slate-200/80"
    >
      <div
        ref={pinWrapperRef}
        className={cn(
          "relative mx-auto flex w-full flex-col justify-between",
          isDesktop && !reducedMotion ? "h-screen overflow-hidden" : "min-h-screen"
        )}
      >
        {/* Top precision bar */}
        <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-4 pt-24 pb-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#079BD3]" />
            <span className="font-mono text-[11px] font-semibold tracking-[0.12em] text-slate-700 uppercase sm:text-xs sm:tracking-[0.16em]">
              Press Pipeline · {activeStage.step} / 05 — {activeStage.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Render Engine Switcher: 3D WebGL vs Remotion+FFmpeg WebP Sequence */}
            <div
              role="group"
              aria-label="Visual engine mode"
              className="inline-flex shrink-0 rounded-full border border-slate-200 bg-white p-0.5 shadow-2xs"
            >
              <button
                type="button"
                onClick={() => setRenderMode("3d")}
                className={cn(
                  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[10px] font-medium transition-colors sm:px-3 sm:text-[11px]",
                  renderMode === "3d"
                    ? "bg-[#111827] text-white"
                    : "text-slate-600 hover:text-[#111827]"
                )}
              >
                <Box className="h-3.5 w-3.5 shrink-0" />
                <span>3D Press</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSeqProgress(progressRef.current);
                  setRenderMode("sequence");
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[10px] font-medium transition-colors sm:px-3 sm:text-[11px]",
                  renderMode === "sequence"
                    ? "bg-[#079BD3] text-white"
                    : "text-slate-600 hover:text-[#111827]"
                )}
              >
                <Film className="h-3.5 w-3.5 shrink-0" />
                <span>Print Film</span>
              </button>
            </div>

            <span
              ref={progressLabelRef}
              className="hidden sm:inline-block min-w-[3.2rem] text-right font-mono text-xs font-semibold text-slate-500"
            >
              0%
            </span>
          </div>
        </div>

        {/* Main split / layered stage */}
        <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-6 px-4 pb-6 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
          {/* Visual 3D / Frame Sequence Canvas */}
          <div className="relative lg:col-span-7 xl:col-span-8">
            <div className="crop-marks relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#edf2f7] shadow-[0_28px_65px_-24px_rgba(17,24,39,0.22)] lg:aspect-auto lg:h-[64vh] lg:min-h-[430px]">
              {renderMode === "3d" ? (
                <PrintingPress3DCanvas
                  progressRef={progressRef}
                  onWebGLUnsupported={() => setRenderMode("sequence")}
                />
              ) : (
                <FrameSequenceCanvas progress={seqProgress} totalFrames={120} />
              )}

              {/* Live CMYK Ink Channel HUD */}
              <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/90 px-3 py-1.5 backdrop-blur-xs">
                <Layers className="h-3.5 w-3.5 text-slate-600" />
                <div className="flex items-center gap-1.5">
                  {CHANNEL_META.map((ch) => {
                    const active = activeStage.inkChannels.includes(ch.key);
                    return (
                      <span
                        key={ch.key}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold transition-all duration-300",
                          active
                            ? "bg-slate-900/5 text-[#111827] opacity-100"
                            : "text-slate-400 opacity-45"
                        )}
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: ch.color }}
                        />
                        {ch.key}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Stage Narrative */}
          <div className="flex flex-col justify-center lg:col-span-5 xl:col-span-4">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-8">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold tracking-[0.18em] text-[#079BD3] uppercase">
                  Stage {activeStage.step}
                </span>
                <span className="rounded-full bg-[#F7F9FC] px-2.5 py-1 font-mono text-[11px] font-medium text-slate-600">
                  {activeStage.label}
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-[-0.025em] text-[#111827] sm:text-3xl lg:text-[2rem] lg:leading-[1.14]">
                {activeStage.heading}
              </h2>

              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {activeStage.supportingText}
              </p>

              {/* Stage 05 Product Suite Tags */}
              {activeStage.step === "05" && (
                <div className="mt-5 flex flex-wrap gap-1.5 border-t border-slate-100 pt-4">
                  {STAGE_05_PRODUCTS.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-[#079BD3]/20 bg-[#079BD3]/5 px-2.5 py-1 text-xs font-medium text-[#111827]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}

              {/* Stage Selector / Indicator Rail */}
              <div className="mt-7 space-y-2 border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
                  <span>
                    {isDesktop && !reducedMotion
                      ? "Scroll to advance press"
                      : "Select a stage to inspect"}
                  </span>
                  <span>01 — 05</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {PRINTING_STAGES.map((stage, idx) => {
                    const isActive = idx === activeStageIdx;
                    const isPast = idx < activeStageIdx;
                    return (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => handleStageSelect(idx)}
                        className={cn(
                          "group flex flex-col items-start rounded-lg border px-2 py-2 text-left transition-all",
                          isActive
                            ? "border-[#079BD3] bg-[#079BD3]/8"
                            : isPast
                              ? "border-slate-200 bg-slate-50 hover:border-slate-300"
                              : "border-slate-200/80 bg-white hover:border-slate-300"
                        )}
                      >
                        <span
                          className={cn(
                            "font-mono text-[10px] font-semibold",
                            isActive ? "text-[#079BD3]" : "text-slate-400"
                          )}
                        >
                          {stage.step}
                        </span>
                        <span className="mt-0.5 w-full truncate text-[10px] font-semibold text-slate-700 sm:text-[11px]">
                          {stage.label.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continuous bottom scroll progress rail */}
        <div className="relative z-20 mx-auto w-full max-w-7xl px-4 pb-5 sm:px-6 lg:px-8">
          <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              ref={progressBarRef}
              className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#079BD3] via-[#39C9E9] to-[#F7941D]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
