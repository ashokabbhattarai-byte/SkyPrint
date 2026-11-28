"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Layers, Maximize2 } from "lucide-react";
import type { PortfolioItem, ServiceCategory } from "@/types";
import { SERVICES } from "@/data/services";
import { PORTFOLIO_ITEMS } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ActionButton } from "@/components/ui/ActionButton";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/lib/utils";

interface TopServicesPreviewProps {
  onSelectService: (serviceTitle: string) => void;
  /** Optional API-driven list for future NestJS backend integration. */
  services?: ServiceCategory[];
  /** Optional API-driven showcase items for future NestJS backend integration. */
  portfolioItems?: PortfolioItem[];
}

const FEATURED_SERVICE_IDS = [
  "printing-works",
  "flex-large-format",
  "advertising-signboards",
  "packaging-product",
];

export function TopServicesPreview({
  onSelectService,
  services,
  portfolioItems,
}: TopServicesPreviewProps) {
  const sourceServices =
    services ?? SERVICES.filter((s) => FEATURED_SERVICE_IDS.includes(s.id));
  const [activeIdx, setActiveIdx] = useState(0);
  const activeService = sourceServices[activeIdx] ?? sourceServices[0];

  const sourceShowcase = (portfolioItems ?? PORTFOLIO_ITEMS).slice(0, 3);
  const heroProof = sourceShowcase[0];
  const secondaryProofs = sourceShowcase.slice(1, 3);

  return (
    <div className="relative z-10 bg-surface text-body">
      {/* Subtle cloud-inspired curve transition */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        className="h-6 w-full text-surface-subtle sm:h-10"
      >
        <path
          d="M0,48 C360,0 1080,0 1440,48 L1440,48 L0,48 Z"
          fill="currentColor"
        />
      </svg>

      {/* PART 1: TOP SERVICES — INTERACTIVE DEPARTMENT SWITCHER & LIVE STAGE */}
      <section className="bg-surface-subtle py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Top Services"
              title="Core Printing & Advertising Solutions."
              accentWord="Solutions."
              description="Select a production department to inspect deliverables, finishes, and request a custom print quote."
            />

            <ActionButton
              href="/services"
              variant="primary"
              size="md"
              fullWidthOnMobile
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="shrink-0"
            >
              View All {SERVICES.length} Services
            </ActionButton>
          </Reveal>

          {/* Mobile Department Pill Tabs (< lg) */}
          <div
            role="tablist"
            aria-label="Core service departments"
            className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:hidden"
          >
            {sourceServices.map((service, idx) => {
              const selected = idx === activeIdx;
              return (
                <button
                  key={service.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveIdx(idx)}
                  className={cn(
                    "relative flex min-h-[48px] items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors",
                    selected
                      ? "border-brand bg-surface text-heading shadow-sm"
                      : "border-border-subtle bg-surface/65 text-body/80 hover:bg-surface"
                  )}
                >
                  <span
                    className={cn(
                      "font-display text-xs font-extrabold",
                      selected ? "text-brand-accent" : "text-brand"
                    )}
                  >
                    {service.number}
                  </span>
                  <span className="line-clamp-2 leading-tight">{service.title}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Split Editorial Layout */}
          {activeService && (
            <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-12 lg:items-stretch">
              {/* Left Column: Desktop Tactile Department Index */}
              <div
                role="tablist"
                aria-label="Core service departments"
                className="hidden flex-col justify-between gap-3 lg:col-span-5 lg:flex"
              >
                {sourceServices.map((service, idx) => {
                  const selected = idx === activeIdx;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveIdx(idx)}
                      className={cn(
                        "group relative flex w-full items-center justify-between gap-4 rounded-xl border p-5 text-left transition-all duration-200",
                        selected
                          ? "border-brand/40 bg-surface shadow-[0_16px_36px_-18px_rgba(21,59,96,0.28)]"
                          : "border-border-subtle bg-surface/60 hover:border-brand/25 hover:bg-surface"
                      )}
                    >
                      {selected && (
                        <motion.span
                          layoutId="top-service-active-bar"
                          transition={{ type: "spring", stiffness: 360, damping: 32 }}
                          className="absolute top-3 bottom-3 left-0 w-1 rounded-r-full bg-brand-accent"
                          aria-hidden="true"
                        />
                      )}

                      <div className="min-w-0 pl-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              "font-display text-xs font-extrabold tracking-wider",
                              selected ? "text-brand" : "text-body/50"
                            )}
                          >
                            {service.number}
                          </span>
                          <span className="text-xs font-medium text-body/60">
                            · {service.items.length} products
                          </span>
                        </div>
                        <h3 className="mt-1 font-display text-lg font-bold tracking-tight text-heading">
                          {service.title}
                        </h3>
                        <p className="mt-0.5 truncate text-xs text-body/75">
                          {service.tagline}
                        </p>
                      </div>

                      <span
                        className={cn(
                          "grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition-colors",
                          selected
                            ? "border-brand bg-brand text-white"
                            : "border-border-subtle bg-surface-subtle text-heading group-hover:border-brand group-hover:text-brand"
                        )}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Live Department Preview Stage */}
              <div className="lg:col-span-7">
                <AnimatePresence mode="wait">
                  <motion.article
                    key={activeService.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    className="crop-marks flex h-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface shadow-[0_20px_50px_-24px_rgba(21,59,96,0.28)]"
                  >
                    {/* CMYK registration top stripe */}
                    <div className="flex h-1 w-full" aria-hidden="true">
                      <span className="flex-1 bg-brand" />
                      <span className="w-1/4 bg-brand-cyan" />
                      <span className="w-1/6 bg-brand-accent" />
                    </div>

                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 sm:aspect-[16/8]">
                      <Image
                        src={activeService.image}
                        alt={activeService.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className="object-cover"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-surface-navy/75 via-surface-navy/15 to-transparent"
                      />
                      <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-3">
                        <div>
                          <span className="inline-flex items-center gap-1.5 rounded bg-surface-navy/85 px-2.5 py-1 text-xs font-bold tracking-wider text-brand-cyan uppercase backdrop-blur-xs">
                            <Layers className="h-3.5 w-3.5 text-brand-accent" />
                            Dept {activeService.number}
                          </span>
                          <h3 className="mt-2 font-display text-xl font-extrabold text-white sm:text-2xl">
                            {activeService.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-5 sm:p-7">
                      <div>
                        <p className="text-sm leading-relaxed text-body/85 sm:text-base">
                          {activeService.description}
                        </p>

                        <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {activeService.items.slice(0, 6).map((item) => (
                            <li
                              key={item}
                              className="flex items-center gap-2 text-sm font-medium text-heading"
                            >
                              <Check
                                className="h-4 w-4 shrink-0 text-brand"
                                strokeWidth={2.5}
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <ActionButton
                          onClick={() => onSelectService(activeService.title)}
                          variant="primary"
                          size="md"
                          fullWidthOnMobile
                          rightIcon={<ArrowUpRight className="h-4 w-4 text-brand-accent" />}
                        >
                          Request {activeService.title} Quote
                        </ActionButton>

                        <Link
                          href={`/services#${activeService.id}`}
                          className="inline-flex min-h-[44px] items-center justify-center gap-1.5 px-2 text-sm font-semibold text-brand transition-colors hover:text-heading"
                        >
                          <span>Full {activeService.items.length}-item spec list</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PART 2: SELECTED SHOWCASE — ASYMMETRIC PRESS PROOF SHEET */}
      <section className="bg-surface py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Selected Showcase"
              title="Print That Speaks for Itself."
              accentWord="Itself."
              description="Representative print proofs and signage installations produced across our Birtamode departments."
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <ActionButton
                href="/work"
                variant="outline-light"
                size="md"
                fullWidthOnMobile
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                View Full Portfolio
              </ActionButton>
              <ActionButton
                href="/about"
                variant="outline-light"
                size="md"
                fullWidthOnMobile
                rightIcon={<ArrowUpRight className="h-4 w-4 text-brand-accent" />}
              >
                About &amp; Studio
              </ActionButton>
            </div>
          </Reveal>

          {heroProof && (
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Hero Proof (7 columns on desktop) */}
              <Reveal delay={60} className="lg:col-span-7">
                <article className="crop-marks group flex h-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-subtle transition-shadow duration-300 hover:shadow-[0_24px_48px_-20px_rgba(21,59,96,0.3)]">
                  <Reveal
                    variant="ink"
                    delay={120}
                    className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100"
                  >
                    <Image
                      src={heroProof.image}
                      alt={heroProof.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 rounded bg-surface-navy/90 px-2.5 py-1 text-xs font-semibold text-white">
                      {heroProof.category}
                    </span>
                  </Reveal>

                  <div className="flex flex-1 flex-col justify-between bg-surface p-5 sm:p-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-brand">
                        <span>{heroProof.finishSpec}</span>
                        <span className="text-body/40">•</span>
                        <span className="text-body/70">{heroProof.dimensions}</span>
                      </div>
                      <h3 className="mt-2 font-display text-xl font-bold text-heading sm:text-2xl">
                        {heroProof.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-body/80">
                        {heroProof.description}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => onSelectService(heroProof.title)}
                        className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-brand-action hover:text-heading"
                      >
                        <span>Request Similar Project</span>
                        <ArrowUpRight className="h-4 w-4 text-brand-accent" />
                      </button>
                      <Link
                        href="/work"
                        className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-semibold text-heading/75 hover:text-brand"
                      >
                        <span>Inspect All Proofs</span>
                        <Maximize2 className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>

              {/* Stacked Supporting Proofs (5 columns on desktop) */}
              <div className="flex flex-col gap-6 lg:col-span-5">
                {secondaryProofs.map((item, i) => (
                  <Reveal key={item.id} delay={140 + i * 90} className="flex-1">
                    <article className="crop-marks group flex h-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface transition-shadow duration-300 hover:shadow-[0_20px_40px_-18px_rgba(21,59,96,0.28)] sm:flex-row">
                      <Reveal
                        variant="ink"
                        delay={180 + i * 90}
                        className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-slate-100 sm:aspect-auto sm:w-44"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 176px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Reveal>

                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <span className="text-xs font-semibold tracking-wider text-brand uppercase">
                            {item.category}
                          </span>
                          <h3 className="mt-1 font-display text-base font-bold leading-snug text-heading sm:text-lg">
                            {item.title}
                          </h3>
                          <p className="mt-1.5 text-xs font-medium text-body/70">
                            {item.finishSpec}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                          <button
                            type="button"
                            onClick={() => onSelectService(item.title)}
                            className="inline-flex min-h-[44px] items-center gap-1 text-xs font-semibold text-brand-action hover:text-heading sm:min-h-[36px]"
                          >
                            <span>Quote Similar</span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-brand-accent" />
                          </button>
                          <Link
                            href="/work"
                            className="inline-flex min-h-[44px] items-center gap-1 text-xs font-semibold text-heading/70 hover:text-brand sm:min-h-[36px]"
                          >
                            <span>View</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
