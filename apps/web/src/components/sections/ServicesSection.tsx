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

const COL_SPAN_BY_INDEX = [
  "lg:col-span-6",
  "lg:col-span-6",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-6",
  "lg:col-span-6",
];

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  return (
    <section
      id="services"
      className="relative bg-[#F5F7F9] py-20 text-[#202B36] sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Our 7 Core Disciplines"
            title="Everything You Need. All Under One Roof."
            accentWord="One Roof."
            description="Seven specialized production departments covering commercial paper print, wide-format flex, architectural signboards, design, finishing, custom gifts, and retail packaging."
          />

          <button
            type="button"
            onClick={() => onSelectService("Printing Works")}
            className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-[#153B60] transition-colors hover:border-[#078FCB] hover:text-[#078FCB]"
          >
            <span>Request Custom Estimate</span>
            <ArrowUpRight className="h-4 w-4 text-[#F7941D]" />
          </button>
        </div>

        {/* Consistent white service cards per design.md 4.3 */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
          {SERVICES.map((service, index) => (
            <motion.article
              id={service.id}
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25) }}
              className={cn(
                "group relative scroll-mt-28 flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow duration-300 hover:shadow-md",
                COL_SPAN_BY_INDEX[index] ?? "lg:col-span-4"
              )}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 45vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="rounded bg-[#153B60] px-2.5 py-1 text-xs font-bold text-white">
                    {service.number}
                  </span>
                  <span className="rounded bg-white/95 px-3 py-1 text-[11px] font-semibold text-[#153B60]">
                    {service.tagline}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-[#153B60] sm:text-2xl">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#202B36]/80">
                    {service.description}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {service.items.map((item) => (
                      <li
                        key={item}
                        className="rounded border border-slate-200 bg-[#F5F7F9] px-2.5 py-1 text-xs font-medium text-[#202B36]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-500">
                    {service.items.length} Deliverables
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectService(service.title)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#067EAF] transition-colors hover:text-[#153B60]"
                  >
                    <span>Inquire Now</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#F7941D]" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
