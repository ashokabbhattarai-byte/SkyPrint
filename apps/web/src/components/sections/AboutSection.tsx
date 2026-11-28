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
      className="relative bg-white py-20 text-[#202B36] sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="about-reveal lg:col-span-5">
            <SectionHeading
              eyebrow="Who We Are"
              title="More Than Printing. We Create Impressions."
              accentWord="Impressions."
              description="Sky Print & Advertising Pvt. Ltd. delivers professional printing, creative design, and impactful advertising solutions. We bring together creativity, printing capabilities, and attention to detail to help businesses and individuals communicate their ideas effectively."
            />

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-200 pt-8">
              <div>
                <p className="text-xs font-semibold tracking-wider text-[#078FCB] uppercase">
                  Location
                </p>
                <p className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-[#153B60]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F7941D]" />
                  <span>Bhadrapur Road, Birtamode, Jhapa</span>
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wider text-[#078FCB] uppercase">
                  Workflow
                </p>
                <p className="mt-1.5 text-sm font-medium text-[#153B60]">
                  Design → Prepress → Production → Finishing
                </p>
              </div>
            </div>
          </div>

          <div className="about-reveal relative lg:col-span-7">
            <div className="grid grid-cols-12 gap-4 sm:gap-6">
              <div className="crop-marks relative col-span-12 aspect-[16/10] overflow-hidden rounded-lg border border-slate-200 bg-[#F5F7F9] sm:col-span-8 sm:aspect-[4/4.3]">
                <Image
                  src="/images/hero-flex-press-poster.webp"
                  alt="Sky Print commercial wide-format flex printing machine"
                  fill
                  sizes="(max-width: 768px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>

              <div className="col-span-12 flex flex-col justify-between gap-4 sm:col-span-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-[#F5F7F9] sm:aspect-[4/4.6]">
                  <Image
                    src="/images/design-prepress.webp"
                    alt="Color-calibrated prepress design workstation and swatches"
                    fill
                    sizes="(max-width: 768px) 100vw, 22vw"
                    className="object-cover"
                  />
                </div>

                <div className="rounded-lg border border-slate-200 bg-[#F5F7F9] p-5">
                  <p className="text-xs font-semibold text-[#078FCB] uppercase">
                    End-to-End Execution
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[#202B36]/85">
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
