"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Expand, Info, X } from "lucide-react";
import { PORTFOLIO_ITEMS } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { PortfolioCategory, PortfolioItem } from "@/types";
import { cn } from "@/lib/utils";

interface PortfolioSectionProps {
  onRequestSimilar: (title: string) => void;
}

const CATEGORIES: PortfolioCategory[] = [
  "All",
  "Large Format & Flex",
  "Print & Stationery",
  "Signboards & LED",
  "Packaging",
  "Promotional",
];

export function PortfolioSection({ onRequestSimilar }: PortfolioSectionProps) {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>("All");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filtered =
    activeCategory === "All"
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="our-work" className="relative bg-[#0E1520] py-20 text-[#E6ECF5] sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            theme="dark"
            eyebrow="Selected Showcase"
            title="Print That Speaks for Itself."
            accentWord="Itself."
            description="Representative showcase examples illustrating the print quality, material finishes, and fabrication capabilities available at Sky Print & Advertising."
          />

          <div className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-[#131C2B] px-3.5 py-2 text-xs text-slate-300">
            <Info className="h-3.5 w-3.5 shrink-0 text-[#39C9E9]" />
            <span>Representative showcase samples — client gallery available on request</span>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Portfolio categories"
          className="mt-10 flex flex-wrap gap-2"
        >
          {CATEGORIES.map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "rounded-lg border px-4 py-2 text-xs font-semibold transition-all sm:text-sm",
                  active
                    ? "border-[#39C9E9] bg-[#079BD3] text-white"
                    : "border-white/12 bg-[#131C2B] text-slate-300 hover:border-[#39C9E9]/50 hover:text-white"
                )}
              >
                {category}
              </button>
            );
          })}
        </div>

        <motion.div
          layout
          className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28 }}
                onClick={() => setSelectedItem(item)}
                className="group cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#131C2B] transition hover:border-[#39C9E9]/45"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0B1018]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1018]/80 via-transparent to-transparent" />

                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                    <span className="rounded-md bg-[#0B1018]/85 px-2.5 py-1 font-mono text-[10px] font-semibold text-[#39C9E9]">
                      {item.category}
                    </span>
                    {item.isRepresentativeSample && (
                      <span className="rounded-md bg-white/15 px-2.5 py-1 font-mono text-[10px] font-medium text-white backdrop-blur-xs">
                        Sample Showcase
                      </span>
                    )}
                  </div>

                  <span className="absolute right-3.5 bottom-3.5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B1018]/90 text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <Expand className="h-4 w-4" />
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <h3 className="font-display text-lg font-bold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                    {item.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[11px] text-slate-400">
                    <span>{item.finishSpec}</span>
                    <span className="font-semibold text-[#39C9E9]">Inspect</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="relative grid w-full max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-[#131C2B] text-white shadow-2xl md:grid-cols-12"
            >
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close lightbox"
                className="absolute top-3.5 right-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B1018]/90 text-white transition hover:bg-[#079BD3]"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative aspect-[4/3] bg-[#0B1018] md:col-span-7 md:aspect-auto md:min-h-[420px]">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8 md:col-span-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-[#079BD3]/20 px-3 py-1 font-mono text-[11px] font-semibold text-[#39C9E9]">
                      {selectedItem.category}
                    </span>
                    {selectedItem.isRepresentativeSample && (
                      <span className="rounded-md bg-white/10 px-3 py-1 font-mono text-[11px] text-slate-300">
                        Representative Sample
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-white">
                    {selectedItem.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {selectedItem.description}
                  </p>

                  <dl className="mt-6 space-y-3 border-t border-white/10 pt-5 text-xs">
                    <div className="flex justify-between gap-4">
                      <dt className="font-mono text-slate-400 uppercase">
                        Finish Spec
                      </dt>
                      <dd className="text-right font-semibold text-white">
                        {selectedItem.finishSpec}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="font-mono text-slate-400 uppercase">
                        Format
                      </dt>
                      <dd className="text-right font-semibold text-white">
                        {selectedItem.dimensions}
                      </dd>
                    </div>
                  </dl>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const title = selectedItem.title;
                    setSelectedItem(null);
                    onRequestSimilar(title);
                  }}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#079BD3] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#39C9E9] hover:text-[#0B1018]"
                >
                  <span>Order Similar Print</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
