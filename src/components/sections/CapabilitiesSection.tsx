"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRODUCTION_CAPABILITIES } from "@/data/printingStages";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductReveal } from "../../../remotion/compositions/ProductReveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const RemotionPlayer = dynamic(
  () => import("@remotion/player").then((m) => m.Player),
  { ssr: false }
);

export function CapabilitiesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".cap-image-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(8% 0% 8% 0% round 12px)", opacity: 0.4 },
          {
            clipPath: "inset(0% 0% 0% 0% round 12px)",
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-white/10 bg-[#0E1520] py-20 text-[#E6ECF5] sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading
              theme="dark"
              eyebrow="Production Infrastructure"
              title="Built for Commercial Scale & Tactile Detail."
              accentWord="Tactile Detail."
              description="Every project moves seamlessly across digital printing, flex and large-format production, 3D signboard fabrication, post-press finishing, and customized merchandise."
            />
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-xl border border-white/12 bg-[#131C2B] p-2">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[#0B1018]">
                <RemotionPlayer
                  component={ProductReveal}
                  durationInFrames={120}
                  compositionWidth={1280}
                  compositionHeight={720}
                  fps={30}
                  loop
                  autoPlay={!reducedMotion}
                  controls
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <div className="flex items-center justify-between px-2 pt-2 pb-1 font-mono text-[11px] text-slate-400">
                <span>Remotion Studio Reel · Product Suite</span>
                <span className="text-[#39C9E9]">1280×720 · 30fps</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-16 lg:space-y-24">
          {PRODUCTION_CAPABILITIES.map((cap, index) => {
            const reversed = index % 2 === 1;
            return (
              <div
                key={cap.id}
                className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14"
              >
                <div
                  className={cn(
                    "cap-image-reveal relative aspect-[16/10] overflow-hidden rounded-xl border border-white/12 bg-[#131C2B] lg:col-span-7",
                    reversed && "lg:order-2"
                  )}
                >
                  <Image
                    src={cap.image}
                    alt={cap.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />
                </div>

                <div className={cn("lg:col-span-5", reversed && "lg:order-1")}>
                  <span className="font-mono text-xs font-semibold tracking-[0.18em] text-[#39C9E9]">
                    {cap.code}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {cap.title}
                  </h3>
                  <p className="mt-2 text-base font-medium text-[#F7941D]">
                    {cap.subtitle}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                    {cap.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {cap.specs.map((spec) => (
                      <span
                        key={spec}
                        className="rounded-md border border-white/12 bg-[#131C2B] px-3.5 py-1.5 font-mono text-xs font-medium text-slate-200"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
