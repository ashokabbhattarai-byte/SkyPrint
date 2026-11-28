"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MapPin, Navigation } from "lucide-react";
import { PRINTING_STAGES } from "@/data/printingStages";
import { COMPANY_INFO } from "@/data/company";
import {
  AdaptiveFrameSequence,
  type FrameSequenceController,
} from "@/components/video/AdaptiveFrameSequence";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface HeroScrollExperienceProps {
  /** Opens the message/quote modal, optionally preselecting a service title. */
  onRequestQuote: (service?: string) => void;
}

const POPOUTS = [
  {
    id: "pop-cards",
    label: "Visiting Cards & Brochures",
    service: "Printing Works",
    image: "/images/packaging-and-cards.webp",
    posClass: "top-[14%] right-4 sm:right-[6%] lg:top-[16%] lg:right-[27%]",
    tilt: "rotateY(-10deg) rotateX(4deg)",
    threshold: 0.72,
  },
  {
    id: "pop-signage",
    label: "3D Acrylic & LED Signage",
    service: "Advertising & Signboard Works",
    image: "/images/large-format-signage.webp",
    posClass: "hidden lg:block top-[20%] right-[5%]",
    tilt: "rotateY(-14deg) rotateX(3deg)",
    threshold: 0.77,
  },
  {
    id: "pop-finishing",
    label: "Finishing & Binding",
    service: "Finishing & Binding",
    image: "/images/finishing-binding.webp",
    posClass: "hidden sm:block bottom-[24%] right-[6%] lg:bottom-[22%] lg:right-[23%]",
    tilt: "rotateY(-8deg) rotateX(-4deg)",
    threshold: 0.82,
  },
  {
    id: "pop-promo",
    label: "ID Cards & Custom Gifts",
    service: "Promotional & Customized Products",
    image: "/images/promotional-gifts.webp",
    posClass: "hidden lg:block bottom-[20%] right-[5%]",
    tilt: "rotateY(-12deg) rotateX(-3deg)",
    threshold: 0.87,
  },
];

/** Progress at which the intro fades out and the stage card takes over. */
const HERO_EXIT = 0.06;
/** Time constant (ms) for easing displayed progress toward scroll position. */
const SMOOTHING_MS = 90;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t: number) => 1 - (1 - t) * (1 - t) * (1 - t);

export function HeroScrollExperience({ onRequestQuote }: HeroScrollExperienceProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameCtl = useRef<FrameSequenceController | null>(null);
  const videoStageRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const introScrimRef = useRef<HTMLDivElement | null>(null);
  const stageCardRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const progressPctRef = useRef<HTMLSpanElement | null>(null);
  const popoutRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // React state changes only on discrete transitions (a handful per full scroll),
  // never per scroll tick. Everything continuous is written straight to the DOM.
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [inHero, setInHero] = useState(true);
  const [popoutsLive, setPopoutsLive] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let top = 0;
    let scrollable = 1;
    let target = 0;
    let current = 0;
    let lastTime = 0;
    let raf = 0;
    let running = false;

    const measure = () => {
      top = section.getBoundingClientRect().top + window.scrollY;
      scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
    };

    const readTarget = () => {
      target = clamp01((window.scrollY - top) / scrollable);
    };

    const apply = (p: number) => {
      frameCtl.current?.render(p);

      if (progressBarRef.current) progressBarRef.current.style.transform = `scaleX(${p})`;
      if (progressPctRef.current) progressPctRef.current.textContent = `${Math.round(p * 100)}%`;

      if (videoStageRef.current && !reducedMotion) {
        const scale = 1.03 + p * 0.06;
        const tilt = (p - 0.5) * -3;
        videoStageRef.current.style.transform = `perspective(1400px) scale(${scale.toFixed(4)}) rotateY(${tilt.toFixed(2)}deg)`;
      }

      // Intro copy fades and lifts out over the first few percent of scroll.
      const intro = 1 - clamp01((p - 0.012) / (HERO_EXIT - 0.012));
      if (introRef.current) {
        introRef.current.style.opacity = intro.toFixed(3);
        introRef.current.style.transform = reducedMotion
          ? ""
          : `translate3d(0, ${(-28 * (1 - intro)).toFixed(1)}px, 0)`;
        introRef.current.style.visibility = intro <= 0.001 ? "hidden" : "visible";
      }
      if (introScrimRef.current) introScrimRef.current.style.opacity = intro.toFixed(3);

      const card = clamp01((p - HERO_EXIT + 0.01) / 0.035);
      if (stageCardRef.current) {
        stageCardRef.current.style.opacity = card.toFixed(3);
        stageCardRef.current.style.transform = reducedMotion
          ? ""
          : `translate3d(0, ${(18 * (1 - card)).toFixed(1)}px, 0)`;
        stageCardRef.current.style.visibility = card <= 0.001 ? "hidden" : "visible";
      }

      POPOUTS.forEach((item, i) => {
        const el = popoutRefs.current[i];
        if (!el) return;
        const t = easeOut(clamp01((p - item.threshold) / 0.1));
        el.style.opacity = t.toFixed(3);
        el.style.visibility = t <= 0.01 ? "hidden" : "visible";
        el.style.transform = reducedMotion
          ? ""
          : `${item.tilt} translate3d(0, ${(28 * (1 - t)).toFixed(1)}px, 0) scale(${(0.82 + 0.18 * t).toFixed(3)})`;
      });

      // Same-value setState is a no-op, so these only re-render on transitions.
      setInHero(p < HERO_EXIT);
      setPopoutsLive(p >= POPOUTS[0].threshold + 0.05);
      const idx = PRINTING_STAGES.findIndex(
        (st, i) => p >= st.progressStart && (p < st.progressEnd || i === PRINTING_STAGES.length - 1)
      );
      if (idx !== -1) setActiveStageIdx(idx);
    };

    // Frame-rate independent easing toward the real scroll position. Smooths
    // coarse wheel steps and late scroll events without hijacking native scroll.
    const tick = (now: number) => {
      const dt = lastTime ? Math.min(64, now - lastTime) : 16;
      lastTime = now;
      const k = reducedMotion ? 1 : 1 - Math.exp(-dt / SMOOTHING_MS);
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0003) current = target;
      apply(current);
      if (current !== target) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
        lastTime = 0;
      }
    };

    const kick = () => {
      readTarget();
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onResize = () => {
      measure();
      kick();
    };

    measure();
    readTarget();
    current = target;
    apply(current);

    const ro = new ResizeObserver(onResize);
    ro.observe(section);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", onResize);
    };
  }, [reducedMotion]);

  const jumpToStage = (idx: number) => {
    const st = PRINTING_STAGES[idx];
    const section = sectionRef.current;
    if (!st || !section) return;
    const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
    const mid = idx === 0 ? HERO_EXIT + 0.04 : (st.progressStart + st.progressEnd) / 2;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + mid * scrollable, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const stage = PRINTING_STAGES[activeStageIdx] ?? PRINTING_STAGES[0];

  return (
    <section
      id="home"
      ref={sectionRef}
      data-ink-start
      aria-label="Sky Print: how your print is made"
      className="relative h-[340vh] w-full bg-surface-navy"
    >
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        {/* Press footage, scrubbed by scroll */}
        <div ref={videoStageRef} className="absolute inset-0 z-0 will-change-transform">
          <AdaptiveFrameSequence controllerRef={frameCtl} className="h-full w-full" />
        </div>

        {/* Readability scrims: heavy on the left for the intro, lighter during stages */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#153B60]/70 via-[#153B60]/10 to-[#153B60]/25"
        />
        <div
          ref={introScrimRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(0deg,rgba(21,59,96,0.96)_0%,rgba(21,59,96,0.8)_55%,rgba(21,59,96,0.35)_100%)] sm:bg-[linear-gradient(90deg,rgba(21,59,96,0.94)_0%,rgba(21,59,96,0.78)_38%,rgba(21,59,96,0.25)_70%,rgba(21,59,96,0.1)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-[#153B60]/60 to-transparent"
        />

        {/* Sun-ray detail from the logo (design.md 2.1) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 400 400"
          className="pointer-events-none absolute -top-10 -left-10 z-10 h-64 w-64 opacity-20"
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={Math.cos((i * 10 * Math.PI) / 180) * 380}
              y2={Math.sin((i * 10 * Math.PI) / 180) * 380}
              stroke="#F7941D"
              strokeWidth="1"
            />
          ))}
        </svg>

        {/* Stage 05 product pop-outs: each one opens a quote for that service */}
        <div className="pointer-events-none absolute inset-0 z-20 [perspective:1200px]">
          {POPOUTS.map((item, i) => (
            <button
              key={item.id}
              ref={(el) => {
                popoutRefs.current[i] = el;
              }}
              type="button"
              tabIndex={popoutsLive ? 0 : -1}
              aria-hidden={!popoutsLive}
              aria-label={`Get a quote: ${item.label}`}
              onClick={() => onRequestQuote(item.service)}
              style={{ opacity: 0, visibility: "hidden" }}
              className={cn(
                "group absolute w-36 overflow-hidden rounded-lg border border-white/80 bg-white text-left shadow-2xl will-change-transform sm:w-48 lg:w-56",
                popoutsLive && "pointer-events-auto",
                item.posClass
              )}
            >
              <span className="relative block aspect-[4/3] w-full bg-slate-100">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="224px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </span>
              <span className="flex items-center justify-between gap-2 border-t border-slate-100 px-3 py-2">
                <span className="text-[11px] font-bold text-[#153B60]">{item.label}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#078FCB] transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>

        {/* INTRO (0% scroll) */}
        <div
          ref={introRef}
          className={cn(
            "absolute inset-0 z-30 mx-auto flex max-w-7xl flex-col justify-end px-4 pt-24 pb-36 will-change-transform sm:justify-center sm:px-6 sm:pb-24 lg:px-8",
            !inHero && "pointer-events-none"
          )}
          aria-hidden={!inHero}
        >
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-[#153B60]/50 py-1 pr-3.5 pl-2.5">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F7941D] opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F7941D]" />
              </span>
              <span className="text-[11px] font-semibold tracking-[0.14em] text-white/90 uppercase sm:text-xs">
                <span className="hidden sm:inline">Printing &amp; Advertising · </span>Birtamode, Jhapa
              </span>
            </div>

            <h1 className="font-display text-[2.6rem] leading-[1.04] font-extrabold tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl">
              Turning Ideas Into <span className="text-[#36B9D8]">Impressions.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
              Flex banners, visiting cards, LED signboards, packaging and custom gifts:
              designed, printed and finished under one roof.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/services"
                tabIndex={inHero ? 0 : -1}
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-md bg-brand-action px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-colors hover:bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
              >
                Explore Services
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={COMPANY_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={inHero ? 0 : -1}
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-md border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-brand-accent hover:bg-brand-accent sm:w-auto"
              >
                <Navigation className="h-4 w-4 text-brand-accent" />
                Get Directions
              </a>
            </div>

            <div className="mt-6 flex items-start gap-2.5 border-t border-white/15 pt-4 text-sm text-slate-200">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
              <span>
                <strong className="font-semibold text-white">Visit Us:</strong>{" "}
                {COMPANY_INFO.fullAddress}
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] font-medium tracking-[0.14em] text-white/70 uppercase lg:flex">
            <span className="flex h-8 w-5 justify-center rounded-full border border-white/40 pt-1.5" aria-hidden="true">
              <span className="h-1.5 w-1 animate-bounce rounded-full bg-[#F7941D] motion-reduce:animate-none" />
            </span>
            Scroll to see how it&apos;s made
          </div>
        </div>

        {/* STAGE CARD (during scroll) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[5.5rem] z-30 mx-auto flex max-w-7xl px-4 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 sm:px-6 lg:px-8">
          <div
            ref={stageCardRef}
            style={{ opacity: 0, visibility: "hidden" }}
            aria-hidden={inHero}
            className={cn(
              "relative w-full max-w-sm overflow-hidden rounded-xl border border-white/70 bg-white/[0.97] shadow-[0_24px_60px_-20px_rgba(21,59,96,0.55)] will-change-transform",
              !inHero && "pointer-events-auto"
            )}
          >
            <div className="flex h-1 w-full" aria-hidden="true">
              <span className="flex-1 bg-[#078FCB]" />
              <span className="w-16 bg-[#36B9D8]" />
              <span className="w-10 bg-[#F7941D]" />
            </div>

            <span
              aria-hidden="true"
              className="font-display pointer-events-none absolute top-2 right-4 text-7xl font-extrabold tracking-tighter text-[#153B60]/[0.06] select-none"
            >
              {stage.step}
            </span>

            <div key={stage.id} className="hero-stage-in relative p-5 sm:p-6" aria-live="polite">
              <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-[#078FCB] uppercase">
                Step {stage.step} of {String(PRINTING_STAGES.length).padStart(2, "0")} · {stage.label}
              </p>
              <h2 className="font-display text-xl leading-tight font-extrabold text-[#153B60] sm:text-2xl">
                {stage.heading}
              </h2>
              <p className="mt-2 hidden text-sm leading-relaxed text-[#202B36]/80 sm:block">
                {stage.supportingText}
              </p>
              {stage.points && (
                <ul className="mt-3 space-y-1.5">
                  {stage.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm font-medium text-body">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" strokeWidth={3} />
                      {point}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3.5">
                <Link
                  href="/services"
                  tabIndex={inHero ? -1 : 0}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md bg-brand-action px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-secondary sm:min-h-[38px]"
                >
                  Explore Services
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <a
                  href={COMPANY_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={inHero ? -1 : 0}
                  className="inline-flex min-h-[44px] items-center gap-1.5 px-2 text-xs font-semibold text-brand hover:text-heading sm:min-h-[38px]"
                >
                  <Navigation className="h-3.5 w-3.5 text-brand-accent" />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* PROGRESS RAIL */}
        <div className="absolute inset-x-0 bottom-4 z-30 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-white/60 bg-white/95 px-4 py-2.5 shadow-lg shadow-black/10">
            <div className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#F7941D]" aria-hidden="true" />
                <span className="truncate text-[11px] font-bold tracking-wider text-heading uppercase sm:text-xs">
                  {inHero ? (
                    <>
                      <span className="sm:hidden">Press Steps</span>
                      <span className="hidden sm:inline">How your print is made</span>
                    </>
                  ) : (
                    `${stage.step} · ${stage.label}`
                  )}
                </span>
              </span>

              <nav aria-label="Jump to step" className="flex items-center gap-1">
                {PRINTING_STAGES.map((st, idx) => {
                  const active = !inHero && idx === activeStageIdx;
                  const done = !inHero && idx < activeStageIdx;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => jumpToStage(idx)}
                      aria-current={active ? "step" : undefined}
                      aria-label={`Step ${st.step}: ${st.label}`}
                      className={cn(
                        "inline-flex min-h-[38px] min-w-[36px] items-center justify-center rounded-md px-2 py-1.5 text-xs font-semibold transition-colors sm:min-h-0 sm:min-w-0 sm:px-2.5 sm:py-1",
                        active
                          ? "bg-brand-action text-white"
                          : done
                            ? "text-brand hover:bg-surface-subtle"
                            : "text-body/65 hover:bg-surface-subtle hover:text-heading"
                      )}
                    >
                      {st.step}
                      <span className="hidden xl:inline"> {st.label}</span>
                    </button>
                  );
                })}
                <span
                  ref={progressPctRef}
                  className="ml-1.5 hidden min-w-[2.5rem] text-right text-xs font-bold text-[#078FCB] tabular-nums sm:inline"
                >
                  0%
                </span>
              </nav>
            </div>

            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#F5F7F9]">
              <div
                ref={progressBarRef}
                // Inline transform, not a scale-x-* class: Tailwind v4 scale
                // utilities set the CSS `scale` property, which would multiply with it.
                style={{ transform: "scaleX(0)" }}
                className="h-full w-full origin-left bg-gradient-to-r from-[#078FCB] to-[#36B9D8] will-change-transform"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
