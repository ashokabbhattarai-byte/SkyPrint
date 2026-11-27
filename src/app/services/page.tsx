"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CTASection } from "@/components/sections/CTASection";
import { SERVICES } from "@/data/services";

export default function ServicesPage() {
  return (
    <PageShell>
      {(openQuoteFor) => (
        <>
          <section className="border-b border-white/10 bg-[#0B1018] pt-28 pb-12 sm:pt-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#39C9E9] hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to 3D Printing Demo</span>
              </Link>

              <h1 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl">
                All Printing &amp; Advertising{" "}
                <span className="text-[#39C9E9]">Services.</span>
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-400">
                Complete directory of our seven production departments — jump
                directly to any category or request a custom production quote.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {SERVICES.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="rounded-lg border border-white/12 bg-[#131C2B] px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-[#39C9E9] hover:text-[#39C9E9]"
                  >
                    <span className="mr-1.5 font-mono text-[#39C9E9]">
                      {s.number}.
                    </span>
                    {s.title}
                  </a>
                ))}
              </div>
            </div>
          </section>

          <ServicesSection onSelectService={openQuoteFor} />
          <CTASection onRequestQuote={() => openQuoteFor("Printing Works")} />
        </>
      )}
    </PageShell>
  );
}
