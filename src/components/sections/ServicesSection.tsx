"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { SERVICES } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
}

const ACCENT_STYLES = {
  blue: "bg-[#079BD3] text-white",
  cyan: "bg-[#39C9E9] text-[#0B1018]",
  orange: "bg-[#F7941D] text-[#0B1018]",
  deep: "bg-[#246EEB] text-white",
};

const COL_SPAN_BY_INDEX = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
];

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  return (
    <section
      id="services"
      className="relative bg-[#0E1520] py-20 text-[#E6ECF5] sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            theme="dark"
            eyebrow="Our 7 Core Disciplines"
            title="Everything You Need. All Under One Roof."
            accentWord="One Roof."
            description="Seven specialized production departments covering commercial paper print, wide-format flex, architectural signboards, design, finishing, custom gifts, and retail packaging."
          />

          <button
            type="button"
            onClick={() => onSelectService("Printing Works")}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[#39C9E9] hover:text-[#39C9E9]"
          >
            <span>Request Custom Estimate</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
          {SERVICES.map((service, index) => {
            const isHeroWide = index === 0 || index === 3;
            return (
              <motion.article
                id={service.id}
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25) }}
                className={cn(
                  "group relative scroll-mt-28 flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#131C2B] transition hover:border-[#39C9E9]/40",
                  COL_SPAN_BY_INDEX[index] ?? "lg:col-span-4"
                )}
              >
                <div
                  className={cn(
                    "relative w-full overflow-hidden bg-[#0B1018]",
                    isHeroWide ? "aspect-[16/9]" : "aspect-[4/3]"
                  )}
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 45vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1018]/80 via-[#0B1018]/20 to-transparent" />

                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-md px-2.5 py-1 font-mono text-xs font-bold",
                        ACCENT_STYLES[service.accent]
                      )}
                    >
                      {service.number}
                    </span>
                    <span className="rounded-md bg-[#0B1018]/85 px-3 py-1 text-[11px] font-semibold text-slate-200 backdrop-blur-xs">
                      {service.tagline}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                  <div>
                    <h3 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                      {service.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
                      {service.description}
                    </p>

                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {service.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-md border border-white/10 bg-[#0B1018]/60 px-2.5 py-1 text-xs font-medium text-slate-300"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="font-mono text-[11px] text-slate-500">
                      {service.items.length} Deliverables
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectService(service.title)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#39C9E9] transition-colors hover:text-[#F7941D]"
                    >
                      <span>Inquire Now</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
