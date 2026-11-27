"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/data/services";
import { PORTFOLIO_ITEMS } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";

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
    FEATURED_SERVICE_IDS.includes(s.id)
  );
  const featuredWork = PORTFOLIO_ITEMS.slice(0, 3);

  return (
    <div className="relative z-10 border-t border-white/10 bg-[#0E1520] text-[#E6ECF5]">
      {/* TOP SERVICES STRIP */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            theme="dark"
            eyebrow="Top Services"
            title="Core Printing & Advertising Solutions."
            accentWord="Solutions."
            description="A quick look at our primary disciplines. Explore all 7 specialized production departments on our services page."
          />

          <Link
            href="/services"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-[#079BD3] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#39C9E9] hover:text-[#0B1018]"
          >
            <span>View All 7 Services</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {topServices.map((service) => (
            <article
              key={service.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#131C2B] transition hover:border-[#39C9E9]/45 hover:bg-[#162133]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0B1018]">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-md bg-[#0B1018]/85 px-2.5 py-1 font-mono text-[11px] font-bold text-[#39C9E9] backdrop-blur-xs">
                  {service.number}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h3 className="font-display text-lg font-bold tracking-tight text-white">
                    {service.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                    {service.tagline}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3.5">
                  <Link
                    href={`/services#${service.id}`}
                    className="text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => onSelectService(service.title)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#39C9E9] hover:text-[#F7941D]"
                  >
                    <span>Quote</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* COMPACT WORK & STUDIO NAVIGATION STRIP */}
      <section className="border-t border-white/10 bg-[#0B1018] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              theme="dark"
              eyebrow="Selected Work"
              title="Print That Speaks for Itself."
              accentWord="Itself."
              description="Preview representative print outputs or browse the full filtered gallery and studio capabilities."
            />

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[#39C9E9] hover:text-[#39C9E9]"
              >
                <span>View Full Portfolio</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[#F7941D] hover:text-[#F7941D]"
              >
                <span>Studio &amp; Capabilities</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredWork.map((item) => (
              <Link
                key={item.id}
                href="/work"
                className="group overflow-hidden rounded-xl border border-white/10 bg-[#131C2B] transition hover:border-[#39C9E9]/45"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0B1018]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span className="font-mono text-[10px] font-semibold text-[#39C9E9] uppercase">
                    {item.category} · Sample Showcase
                  </span>
                  <h3 className="mt-1.5 font-display text-base font-bold text-white">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
