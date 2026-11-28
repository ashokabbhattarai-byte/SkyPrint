"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type Lenis from "lenis";

interface HeroSectionProps {
  onStartProject: () => void;
}

export function HeroSection({ onStartProject }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-stagger", {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.11,
        ease: "power3.out",
        clearProps: "transform",
      });
    }, heroRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const scrollTo = (target: string) => {
    const lenis = (window as unknown as { __skyprintLenis?: Lenis })
      .__skyprintLenis;
    if (lenis) {
      lenis.scrollTo(target, { offset: -64 });
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative flex min-h-screen w-full items-end overflow-hidden bg-[#0c1322] pt-28 pb-16 text-white sm:items-center sm:pb-20"
    >
      {/* Background Cinematic Printing Video (Remotion + FFmpeg optimized) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {!reducedMotion ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/studio-press.webp"
            className="h-full w-full scale-[1.03] object-cover object-center"
          >
            <source src="/videos/hero-printing.webm" type="video/webm" />
            <source src="/videos/hero-printing.mp4" type="video/mp4" />
          </video>
        ) : (
          <Image
            src="/images/studio-press.webp"
            alt="Commercial wide-format digital printing machine"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        )}

        {/* Editorial Contrast Scrim */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#09101d]/90 via-[#09101d]/65 to-[#09101d]/30"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#09101d]/85 via-transparent to-[#09101d]/40"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="hero-stagger mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/8 px-4 py-1.5 backdrop-blur-xs">
            <span className="inline-flex items-center gap-1" aria-hidden="true">
              <span className="h-2 w-2 rounded-xs bg-[#079BD3]" />
              <span className="h-2 w-2 rounded-xs bg-[#EC4899]" />
              <span className="h-2 w-2 rounded-xs bg-[#F7941D]" />
              <span className="h-2 w-2 rounded-xs bg-white" />
            </span>
            <span className="font-mono text-[11px] font-medium tracking-[0.16em] text-slate-200 uppercase">
              Sky Print &amp; Advertising · Birtamode, Jhapa
            </span>
          </div>

          <h1 className="hero-stagger text-4xl font-extrabold tracking-[-0.035em] text-white sm:text-6xl lg:text-[4.5rem] lg:leading-[1.02]">
            Turning Ideas Into{" "}
            <span className="font-serif italic font-normal text-[#39C9E9]">
              Impressions.
            </span>
          </h1>

          <p className="hero-stagger mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-xl">
            From creative concepts to exceptional prints, we bring your vision to
            life with precision, color, and quality.
          </p>

          <div className="hero-stagger mt-9 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => scrollTo("#services")}
              className="inline-flex items-center gap-2.5 rounded-full bg-[#079BD3] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#079BD3]/25 transition hover:bg-[#39C9E9] hover:text-[#0c1322]"
            >
              <span>Explore Our Services</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onStartProject}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/8 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-xs transition hover:border-[#F7941D] hover:bg-[#F7941D] hover:text-white"
            >
              <Sparkles className="h-4 w-4 text-[#F7941D] group-hover:text-white" />
              <span>Start Your Project</span>
            </button>
          </div>
        </div>

        {/* Bottom Scroll Cue into 3D Printing Pipeline */}
        <div className="hero-stagger mt-14 flex items-center justify-between border-t border-white/15 pt-6 sm:mt-20">
          <button
            type="button"
            onClick={() => scrollTo("#printing-process")}
            className="group inline-flex items-center gap-3 text-left text-xs font-medium tracking-[0.14em] text-slate-300 uppercase transition hover:text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 transition group-hover:border-[#39C9E9] group-hover:bg-[#39C9E9]/15">
              <ArrowDown className="h-4 w-4 text-[#39C9E9]" />
            </span>
            <span>Scroll to Experience the 3D Printing Press</span>
          </button>

          <p className="hidden font-mono text-xs text-slate-400 sm:block">
            Blank Canvas → CMYK Press → Finished Print
          </p>
        </div>
      </div>
    </section>
  );
}
