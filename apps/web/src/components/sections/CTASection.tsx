"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { COMPANY_INFO } from "@/data/company";
import { Reveal, useInView } from "@/components/animations/Reveal";
import { buildWhatsAppUrl } from "@/lib/utils";

interface CTASectionProps {
  onRequestQuote: () => void;
}

/**
 * Writes the card's scroll progress through the viewport (0 → 1) to the
 * `--ink` CSS variable, so the ink blooms grow with scroll in pure CSS.
 */
function useScrollInkVar() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.style.setProperty("--ink", "1");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = node.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.5 + r.height * 0.5)));
      node.style.setProperty("--ink", p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return ref;
}

export function CTASection({ onRequestQuote }: CTASectionProps) {
  const cardRef = useScrollInkVar();
  const stripeRef = useInView<HTMLDivElement>();

  return (
    <section className="relative z-10 border-t border-border-subtle bg-surface-subtle py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={cardRef}
          className="relative isolate overflow-hidden rounded-xl bg-surface-navy text-white [--ink:0]"
        >
          {/* Ink blooms that spread as the card scrolls into view */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            {/* Radial gradients, not blur filters: a blurred layer re-rasterises on every scale change */}
            <span className="cta-bloom absolute -top-48 -right-40 h-[34rem] w-[34rem] bg-[radial-gradient(closest-side,rgba(7,143,203,0.55),transparent)] [--bloom-max:1] [--bloom-min:0.4]" />
            <span className="cta-bloom absolute -bottom-56 left-1/4 h-[28rem] w-[28rem] bg-[radial-gradient(closest-side,rgba(54,185,216,0.32),transparent)] [--bloom-max:1] [--bloom-min:0.3]" />
            <span className="cta-bloom absolute top-1/4 -left-28 h-72 w-72 bg-[radial-gradient(closest-side,rgba(247,148,29,0.28),transparent)] [--bloom-max:1] [--bloom-min:0.3]" />
          </div>

          {/* CMYK registration stripe fills in when the ink arrives */}
          <div ref={stripeRef} aria-hidden="true" className="cta-stripe flex h-1.5 w-full">
            <span className="flex-1 bg-[#078FCB]" />
            <span className="w-1/5 bg-[#36B9D8]" />
            <span className="w-1/12 bg-[#F7941D]" />
          </div>

          <div className="grid grid-cols-1 items-center gap-10 p-8 sm:p-12 lg:grid-cols-12 lg:p-14">
            <Reveal className="lg:col-span-7">
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-[#36B9D8] uppercase">
                <span className="h-0.5 w-5 bg-[#F7941D]" aria-hidden="true" />
                <span>Start Your Project</span>
              </div>

              <h2 className="font-display text-3xl font-extrabold tracking-[-0.025em] text-white sm:text-4xl lg:text-5xl lg:leading-[1.08]">
                Have an Idea? Let&apos;s Make It{" "}
                <span className="text-[#36B9D8]">Visible.</span>
              </h2>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-200">
                Tell us what you need, the size and the quantity. We&apos;ll reply with
                options and a price. Prefer to talk? Call or drop by the shop.
              </p>

              <ul className="mt-7 grid gap-3 text-sm sm:grid-cols-2">
                <li>
                  <a
                    href={`tel:${COMPANY_INFO.phone}`}
                    className="group inline-flex items-center gap-2.5 font-semibold text-white"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-md bg-white/10 transition-colors group-hover:bg-[#F7941D]">
                      <Phone className="h-4 w-4" />
                    </span>
                    {COMPANY_INFO.phone} · {COMPANY_INFO.mobilePrimary}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="group inline-flex min-w-0 items-center gap-2.5 font-semibold text-white"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white/10 transition-colors group-hover:bg-[#F7941D]">
                      <Mail className="h-4 w-4" />
                    </span>
                    <span className="truncate">{COMPANY_INFO.email}</span>
                  </a>
                </li>
                <li className="sm:col-span-2">
                  <span className="inline-flex items-center gap-2.5 text-slate-200">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white/10">
                      <MapPin className="h-4 w-4 text-[#F7941D]" />
                    </span>
                    {COMPANY_INFO.fullAddress}
                  </span>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={150} className="flex flex-col gap-3 lg:col-span-5 lg:items-end">
              <button
                type="button"
                onClick={onRequestQuote}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#067EAF] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-black/25 transition-colors hover:bg-[#078FCB] lg:w-auto lg:min-w-[260px]"
              >
                <span>Request a Quote</span>
                <ArrowUpRight className="h-4 w-4 text-[#F7941D]" />
              </button>

              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/30 bg-white/10 px-6 py-4 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-[#153B60] lg:w-auto lg:min-w-[260px]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
