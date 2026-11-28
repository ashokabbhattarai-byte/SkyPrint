"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { GalleryCategory, GalleryItem } from "@/types";
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from "@/data/gallery";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/lib/utils";

interface GallerySectionProps {
  /** Optional API-driven gallery items for future NestJS backend integration. */
  items?: GalleryItem[];
  onRequestQuote?: (serviceTitle?: string) => void;
}

export function GallerySection({
  items = GALLERY_ITEMS,
  onRequestQuote,
}: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  const activeItem = lightboxIdx !== null ? filtered[lightboxIdx] : null;

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight") {
        setLightboxIdx((prev) =>
          prev === null ? null : (prev + 1) % filtered.length
        );
      }
      if (e.key === "ArrowLeft") {
        setLightboxIdx((prev) =>
          prev === null ? null : (prev - 1 + filtered.length) % filtered.length
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIdx, filtered.length]);

  return (
    <section
      id="gallery"
      aria-label="Press Floor & Studio Gallery"
      className="relative z-10 border-t border-border-subtle bg-surface-subtle py-14 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Studio Gallery"
            title="Inside Our Birtamode Press Floor."
            accentWord="Press Floor."
            description="Real machinery, printheads, and finished signage from our Birtamode production workshop. Tap any photo to inspect."
          />

          {/* Category Filter Pills */}
          <div
            role="tablist"
            aria-label="Filter gallery by category"
            className="flex flex-wrap gap-2"
          >
            {GALLERY_CATEGORIES.map((category) => {
              const selected = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    setActiveCategory(category);
                    setLightboxIdx(null);
                  }}
                  className={cn(
                    "relative min-h-[44px] rounded-lg border px-4 py-2 text-xs font-semibold transition-colors sm:min-h-[40px]",
                    selected
                      ? "border-brand-action text-white"
                      : "border-border-subtle bg-surface text-heading hover:border-brand hover:text-brand"
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="gallery-filter-pill"
                      transition={{ type: "spring", stiffness: 360, damping: 32 }}
                      className="absolute inset-0 rounded-[7px] bg-brand-action"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Responsive Gallery Grid (2-col phone / 12-col editorial bento desktop) */}
        <motion.div
          layout
          className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-12"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, idx) => {
              const isWide = item.aspect === "wide";
              return (
                <motion.button
                  key={item.id}
                  layout
                  type="button"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.18) }}
                  onClick={() => setLightboxIdx(idx)}
                  aria-label={`Inspect ${item.title}`}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border border-border-subtle bg-surface text-left shadow-xs transition-shadow duration-300 hover:shadow-[0_20px_40px_-18px_rgba(21,59,96,0.32)]",
                    isWide ? "col-span-2 lg:col-span-6" : "col-span-1 lg:col-span-3"
                  )}
                >
                  <div
                    className={cn(
                      "relative h-full w-full overflow-hidden bg-slate-100",
                      isWide ? "aspect-[16/10]" : "aspect-[4/3] lg:aspect-auto lg:min-h-[260px]"
                    )}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes={
                        isWide
                          ? "(max-width: 1024px) 100vw, 50vw"
                          : "(max-width: 1024px) 50vw, 25vw"
                      }
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-surface-navy/85 via-surface-navy/20 to-transparent opacity-90 transition-opacity group-hover:opacity-95"
                    />

                    <span
                      aria-hidden="true"
                      className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-heading opacity-90 shadow-sm transition-transform group-hover:scale-105 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <Expand className="h-4 w-4" />
                    </span>

                    <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
                      <span className="inline-block rounded bg-brand-accent px-2 py-0.5 text-[11px] font-bold tracking-wide text-surface-navy uppercase">
                        {item.category}
                      </span>
                      <h3 className="mt-1.5 font-display text-sm font-bold leading-snug text-white sm:text-base">
                        {item.title}
                      </h3>
                      {item.spec && (
                        <p className="mt-0.5 hidden text-xs text-slate-200 sm:block">
                          {item.spec}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Accessible Lightbox Modal */}
      <AnimatePresence>
        {activeItem && lightboxIdx !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={activeItem.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIdx(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-surface-navy/85 p-4 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl overflow-hidden rounded-xl border border-white/15 bg-surface text-body shadow-2xl"
            >
              <div className="relative aspect-[16/10] w-full bg-surface-navy">
                <Image
                  src={activeItem.image}
                  alt={activeItem.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-contain"
                />

                <button
                  type="button"
                  onClick={() => setLightboxIdx(null)}
                  aria-label="Close gallery preview"
                  className="absolute top-3 right-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface/95 text-heading shadow-md transition-colors hover:bg-brand-action hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>

                {filtered.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIdx(
                          (lightboxIdx - 1 + filtered.length) % filtered.length
                        )
                      }
                      aria-label="Previous photo"
                      className="absolute top-1/2 left-3 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-heading shadow-md transition-colors hover:bg-brand-action hover:text-white"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIdx((lightboxIdx + 1) % filtered.length)
                      }
                      aria-label="Next photo"
                      className="absolute top-1/2 right-3 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-heading shadow-md transition-colors hover:bg-brand-action hover:text-white"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-brand uppercase">
                    <span>{activeItem.category}</span>
                    {activeItem.spec && (
                      <>
                        <span className="text-body/40">•</span>
                        <span className="text-body/70 normal-case">
                          {activeItem.spec}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="mt-1 font-display text-lg font-bold text-heading sm:text-xl">
                    {activeItem.title}
                  </h3>
                  <p className="mt-1 text-sm text-body/80">{activeItem.caption}</p>
                </div>

                {onRequestQuote && (
                  <button
                    type="button"
                    onClick={() => {
                      const title = activeItem.title;
                      setLightboxIdx(null);
                      onRequestQuote(title);
                    }}
                    className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-md bg-brand-action px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary"
                  >
                    <span>Quote This</span>
                    <ArrowUpRight className="h-4 w-4 text-brand-accent" />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
