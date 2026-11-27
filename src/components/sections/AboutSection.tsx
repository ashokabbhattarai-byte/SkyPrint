"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from(".about-reveal", {
        y: 30,
        opacity: 0,
        duration: 0.85,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-[#0E1520] py-20 text-[#E6ECF5] sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="about-reveal lg:col-span-5">
            <SectionHeading
              theme="dark"
              eyebrow="Who We Are"
              title="More Than Printing. We Create Impressions."
              accentWord="Impressions."
              description="Sky Print & Advertising Pvt. Ltd. delivers professional printing, creative design, and impactful advertising solutions. We bring together creativity, printing capabilities, and attention to detail to help businesses and individuals communicate their ideas effectively."
            />

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-8">
              <div>
                <p className="font-mono text-xs font-semibold tracking-wider text-[#39C9E9] uppercase">
                  Location
                </p>
                <p className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-slate-200">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F7941D]" />
                  <span>Bhadrapur Road, Birtamode, Jhapa</span>
                </p>
              </div>
              <div>
                <p className="font-mono text-xs font-semibold tracking-wider text-[#39C9E9] uppercase">
                  Workflow
                </p>
                <p className="mt-1.5 text-sm font-medium text-slate-200">
                  Design → Prepress → Production → Finishing
                </p>
              </div>
            </div>
          </div>

          <div className="about-reveal relative lg:col-span-7">
            <div className="grid grid-cols-12 gap-4 sm:gap-6">
              <div className="crop-marks relative col-span-12 aspect-[16/10] overflow-hidden rounded-xl border border-white/12 bg-[#131C2B] sm:col-span-8 sm:aspect-[4/4.3]">
                <Image
                  src="/images/studio-press.webp"
                  alt="Sky Print commercial wide-format digital printing studio"
                  fill
                  sizes="(max-width: 768px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>

              <div className="col-span-12 flex flex-col justify-between gap-4 sm:col-span-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/12 bg-[#131C2B] sm:aspect-[4/4.6]">
                  <Image
                    src="/images/design-prepress.webp"
                    alt="Color-calibrated prepress design workstation and swatches"
                    fill
                    sizes="(max-width: 768px) 100vw, 22vw"
                    className="object-cover"
                  />
                </div>

                <div className="rounded-xl border border-white/12 bg-[#131C2B] p-5">
                  <p className="font-mono text-[11px] font-semibold text-[#39C9E9] uppercase">
                    End-to-End Execution
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    Concept artwork, calibrated proofing, industrial printing, and
                    precision finishing under one roof.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
