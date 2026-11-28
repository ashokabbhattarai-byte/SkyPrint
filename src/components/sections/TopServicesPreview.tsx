"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/data/services";
import { PORTFOLIO_ITEMS } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";

interface TopServicesPreviewProps {
  onSelectService: (serviceTitle: string) => void;
}

const FEATURED_SERVICE_IDS = [
  "printing-works",
  "flex-large-format",
  "advertising-signboards",
  "packaging-product",
];

export function TopServicesPreview({
  onSelectService,
}: TopServicesPreviewProps) {
  const topServices = SERVICES.filter((s) =>
    FEATURED_SERVICE_IDS.includes(s.id),
  );
  const featuredWork = PORTFOLIO_ITEMS.slice(0, 3);

  return (
    <div className="relative z-10 bg-white text-[#202B36]">
      {/* Subtle cloud-inspired curve transition (design.md 2.2) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        className="h-6 w-full text-[#F5F7F9] sm:h-10"
      >
        <path
          d="M0,48 C360,0 1080,0 1440,48 L1440,48 L0,48 Z"
          fill="currentColor"
        />
      </svg>

      {/* TOP SERVICES STRIP (Light Grey #F5F7F9 + White Service Cards per design.md 4.3) */}
      <section className="bg-[#F5F7F9] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Top Services"
              title="Core Printing & Advertising Solutions."
              accentWord="Solutions."
              description="Explore our primary production departments or browse all seven specialized services."
            />

            <Link
              href="/services"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-md bg-[#067EAF] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#153B60]"
            >
              <span>View All {SERVICES.length} Services</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topServices.map((service, i) => (
              <Reveal
                key={service.id}
                as="article"
                delay={i * 90}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-[box-shadow,translate] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(21,59,96,0.35)]"
              >
                {/* CMYK-style ink stripe that runs across the card top on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 z-10 flex h-1 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                >
                  <span className="flex-1 bg-[#078FCB]" />
                  <span className="w-1/4 bg-[#36B9D8]" />
                  <span className="w-1/6 bg-[#F7941D]" />
                </span>
                <Reveal
                  variant="ink"
                  delay={i * 90 + 120}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100"
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded bg-[#153B60] px-2 py-0.5 text-[11px] font-bold text-white">
                    {service.number}
                  </span>
                </Reveal>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="font-display text-lg font-bold tracking-tight text-[#153B60]">
                      {service.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#202B36]/80">
                      {service.tagline}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {service.items.slice(0, 3).map((item) => (
                        <li
                          key={item}
                          className="rounded border border-slate-200 bg-[#F5F7F9] px-2 py-0.5 text-[11px] font-medium text-[#153B60]"
                        >
                          {item}
                        </li>
                      ))}
                      {service.items.length > 3 && (
                        <li className="px-1 py-0.5 text-[11px] font-semibold text-[#078FCB]">
                          +{service.items.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5">
                    <Link
                      href={`/services#${service.id}`}
                      className="text-xs font-semibold text-[#153B60] hover:text-[#078FCB]"
                    >
                      Details
                    </Link>
                    <button
                      type="button"
                      onClick={() => onSelectService(service.title)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#078FCB] hover:text-[#153B60]"
                    >
                      <span>Quote</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-[#F7941D]" />
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SELECTED WORK PREVIEW (White #FFFFFF section per design.md) */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Selected Showcase"
              title="Print That Speaks for Itself."
              accentWord="Itself."
              description="Preview representative print outputs or visit our work and studio capability pages."
            />

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-[#153B60] transition-colors hover:border-[#078FCB] hover:text-[#078FCB]"
              >
                <span>View Full Portfolio</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-[#153B60] transition-colors hover:border-[#F7941D] hover:text-[#F7941D]"
              >
                <span>About &amp; Studio</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredWork.map((item, i) => (
              <Reveal key={item.id} delay={i * 110}>
                <Link
                  href="/work"
                  className="crop-marks group block overflow-hidden rounded-lg border border-slate-200 bg-[#F5F7F9] transition-shadow duration-300 hover:shadow-[0_20px_40px_-18px_rgba(21,59,96,0.35)]"
                >
                  <Reveal
                    variant="ink"
                    delay={i * 110 + 150}
                    className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Reveal>
                  <div className="bg-white p-5">
                    <span className="text-[11px] font-semibold tracking-wider text-[#078FCB] uppercase">
                      {item.category} · Sample Showcase
                    </span>
                    <h3 className="mt-1.5 font-display text-base font-bold text-[#153B60]">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
