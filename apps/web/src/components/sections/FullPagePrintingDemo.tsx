"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight, Box, Film, Layers, Sparkles } from "lucide-react";
import { PRINTING_STAGES } from "@/data/printingStages";
import { PrintingPress3DCanvas } from "@/components/video/PrintingPress3DCanvas";
import { FrameSequenceCanvas } from "@/components/video/FrameSequenceCanvas";
import { cn } from "@/lib/utils";

interface FullPagePrintingDemoProps {
  onStartProject: () => void;
}

const CHANNEL_META = [
  { key: "C" as const, color: "#079BD3" },
  { key: "M" as const, color: "#EC4899" },
  { key: "Y" as const, color: "#F7941D" },
  { key: "K" as const, color: "#94A3B8" },
];

const STAGE_05_PRODUCTS = [
  "Flex Banners",
  "Business Cards",
  "Brochures",
  "Signboards",
  "Packaging",
  "ID Cards",
];

export function FullPagePrintingDemo({
  onStartProject,
}: FullPagePrintingDemoProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const progressPctRef = useRef<HTMLSpanElement | null>(null);

  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [inHeroIntro, setInHeroIntro] = useState(true);
  const [seqProgress, setSeqProgress] = useState(0);
  const [renderMode, setRenderMode] = useState<"3d" | "sequence">("3d");
  const [viewerVisible, setViewerVisible] = useState(true);

  useEffect(() => {
    let raf = 0;

    const updateFromScroll = () => {
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const totalScrollable = Math.max(1, track.offsetHeight - window.innerHeight);
      const scrolled = Math.max(0, -rect.top);
      const p = Math.max(0, Math.min(1, scrolled / totalScrollable));

      progressRef.current = p;
      setViewerVisible(rect.bottom > 140);
      setInHeroIntro(p < 0.08);

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${p})`;
      }
      if (progressPctRef.current) {
        progressPctRef.current.textContent = `${Math.round(p * 100)}%`;
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
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateFromScroll);
    };

    updateFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [renderMode]);

  const jumpToStage = (stageIdx: number) => {
    const track = trackRef.current;
    const stage = PRINTING_STAGES[stageIdx];
    if (!track || !stage) return;
    const totalScrollable = Math.max(1, track.offsetHeight - window.innerHeight);
    const targetProgress =
      stageIdx === 0 ? 0.1 : (stage.progressStart + stage.progressEnd) / 2;
    const targetY = track.offsetTop + targetProgress * totalScrollable;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const activeStage = PRINTING_STAGES[activeStageIdx] ?? PRINTING_STAGES[0];

  return (
    <section
      id="home"
      ref={trackRef}
      aria-label="Interactive 3D printing demonstration"
      className="relative h-[380vh] w-full"
    >
      {/* FIXED FULL-VIEWPORT OBSIDIAN 3D VIEWER */}
      <div
        className={cn(
          "fixed inset-0 z-0 transition-opacity duration-500",
          viewerVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {renderMode === "3d" ? (
          <PrintingPress3DCanvas
            progressRef={progressRef}
            onWebGLUnsupported={() => setRenderMode("sequence")}
          />
        ) : (
          <FrameSequenceCanvas progress={seqProgress} totalFrames={120} />
        )}
      </div>

      {/* VIEWER-SIDE LEFT INSPECTION PANEL */}
      <div
        className={cn(
          "fixed inset-x-0 top-20 bottom-20 z-20 mx-auto flex max-w-7xl items-end px-4 pointer-events-none transition-opacity duration-300 sm:px-6 lg:items-center lg:px-8",
          viewerVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="pointer-events-auto w-full max-w-[420px] overflow-hidden rounded-xl border border-white/12 bg-[#101824]/92 shadow-[0_28px_70px_-15px_rgba(0,0,0,0.75)] backdrop-blur-md">
          <div className="h-[2px] w-full bg-gradient-to-r from-[#079BD3] via-[#39C9E9] to-[#F7941D]" />

          <div className="p-6 sm:p-7">
            <AnimatePresence mode="wait">
              {inHeroIntro ? (
                <motion.div
                  key="hero-intro"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="font-mono text-[11px] font-semibold tracking-[0.16em] text-[#39C9E9] uppercase">
                    Birtamode · Commercial Print Studio
                  </p>

                  <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.03em] text-[#F8FAFC] sm:text-[2.35rem] sm:leading-[1.06]">
                    Turning Ideas Into{" "}
                    <span className="text-[#39C9E9]">Impressions.</span>
                  </h1>

                  <p className="mt-3.5 text-sm leading-relaxed text-slate-300 sm:text-[15px]">
                    From creative concepts to exceptional prints, we bring your
                    vision to life with precision, color, and quality.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-2.5">
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#079BD3] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#39C9E9] hover:text-[#0B1018] sm:text-sm"
                    >
                      <span>Explore Services</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={onStartProject}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-100 transition hover:border-[#F7941D] hover:text-[#F7941D] sm:text-sm"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-[#F7941D]" />
                      <span>Start Project</span>
                    </button>
                  </div>

                  <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-3.5 font-mono text-[11px] text-slate-400">
                    <ArrowDown className="h-3.5 w-3.5 animate-bounce text-[#39C9E9]" />
                    <span>Scroll to drive the 3D press live</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={activeStage.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold tracking-[0.16em] text-[#39C9E9] uppercase">
                      Stage {activeStage.step} / 05
                    </span>
                    <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-slate-300">
                      {activeStage.label}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl font-bold tracking-[-0.025em] text-[#F8FAFC] sm:text-[1.8rem] sm:leading-[1.12]">
                    {activeStage.heading}
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-[15px]">
                    {activeStage.supportingText}
                  </p>

                  {activeStage.step === "05" && (
                    <div className="mt-4 flex flex-wrap gap-1.5 border-t border-white/10 pt-3.5">
                      {STAGE_05_PRODUCTS.map((p) => (
                        <span
                          key={p}
                          className="rounded-md border border-[#39C9E9]/25 bg-[#079BD3]/12 px-2.5 py-1 text-[11px] font-medium text-slate-200"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={onStartProject}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#F7941D] px-4 py-2 text-xs font-bold text-[#0B1018] transition hover:bg-[#ffa83e]"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Start Your Project</span>
                    </button>
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#39C9E9] hover:text-white"
                    >
                      <span>All Services</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* FLOATING OBSIDIAN BOTTOM VIEWER CONTROL BAR */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-4 z-30 mx-auto max-w-7xl px-4 transition-all duration-300 sm:px-6 lg:px-8",
          viewerVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-6 opacity-0"
        )}
      >
        <div className="rounded-xl border border-white/12 bg-[#101824]/92 px-4 py-3 shadow-2xl backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#39C9E9]" />
                <span className="font-mono text-[11px] font-semibold tracking-[0.12em] text-slate-200 uppercase">
                  {activeStage.step} · {activeStage.label}
                </span>
              </div>

              <div className="hidden items-center gap-1 border-l border-white/10 pl-3 sm:flex">
                <Layers className="mr-1 h-3.5 w-3.5 text-slate-400" />
                {CHANNEL_META.map((ch) => {
                  const active = activeStage.inkChannels.includes(ch.key);
                  return (
                    <span
                      key={ch.key}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold transition-all",
                        active
                          ? "bg-white/10 text-white opacity-100"
                          : "text-slate-500 opacity-45"
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

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-1 md:flex">
                {PRINTING_STAGES.map((st, idx) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => jumpToStage(idx)}
                    title={`${st.step}. ${st.label}`}
                    className={cn(
                      "rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold transition",
                      !inHeroIntro && idx === activeStageIdx
                        ? "bg-[#079BD3] text-white"
                        : "text-slate-400 hover:bg-white/8 hover:text-white"
                    )}
                  >
                    {st.step}
                  </button>
                ))}
              </div>

              <div
                role="group"
                aria-label="Viewer engine mode"
                className="inline-flex rounded-lg border border-white/12 bg-[#0B1018] p-0.5"
              >
                <button
                  type="button"
                  onClick={() => setRenderMode("3d")}
                  className={cn(
                    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1 font-mono text-[10px] font-semibold transition",
                    renderMode === "3d"
                      ? "bg-[#39C9E9] text-[#0B1018]"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <Box className="h-3 w-3" />
                  <span>3D Press</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSeqProgress(progressRef.current);
                    setRenderMode("sequence");
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1 font-mono text-[10px] font-semibold transition",
                    renderMode === "sequence"
                      ? "bg-[#079BD3] text-white"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <Film className="h-3 w-3" />
                  <span>Print Film</span>
                </button>
              </div>

              <span
                ref={progressPctRef}
                className="min-w-[2.6rem] text-right font-mono text-xs font-bold text-[#39C9E9]"
              >
                0%
              </span>
            </div>
          </div>

          <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
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
