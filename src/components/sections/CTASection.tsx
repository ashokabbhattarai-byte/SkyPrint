"use client";

import { ArrowUpRight, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";

interface CTASectionProps {
  onRequestQuote: () => void;
}

export function CTASection({ onRequestQuote }: CTASectionProps) {
  return (
    <section className="relative z-10 overflow-hidden bg-[#111827] py-24 text-white sm:py-28">
      {/* Subtle geometric accent bars inspired by print crop marks & brand palette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#079BD3] via-[#39C9E9] to-[#F7941D]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 rounded-3xl border border-white/10 bg-gradient-to-br from-[#162238] via-[#111827] to-[#0d192d] p-8 sm:p-12 lg:grid-cols-12 lg:p-16">
          <div className="lg:col-span-8">
            <div className="mb-4 inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.18em] text-[#39C9E9] uppercase">
              <span className="h-2 w-2 rounded-full bg-[#F7941D]" />
              <span>Start Production</span>
            </div>

            <h2 className="font-display text-3xl font-bold tracking-[-0.03em] text-white sm:text-5xl lg:leading-[1.08]">
              Have an Idea? Let&apos;s Make It{" "}
              <span className="text-[#39C9E9]">Visible.</span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Whether you need professional printing, creative design, or
              impactful advertising, Sky Print is ready to bring your next
              project to life.
            </p>
          </div>

          <div className="flex flex-col gap-3.5 lg:col-span-4 lg:items-end">
            <button
              type="button"
              onClick={onRequestQuote}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#079BD3] px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-[#079BD3]/25 transition hover:bg-[#39C9E9] hover:text-[#111827] lg:w-auto lg:min-w-[230px]"
            >
              <span>Request a Quote</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>

            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition hover:border-[#F7941D] hover:bg-[#F7941D] lg:w-auto lg:min-w-[230px]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Contact on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
