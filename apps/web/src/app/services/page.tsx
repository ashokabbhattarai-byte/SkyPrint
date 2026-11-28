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
          <section className="border-b border-border-subtle bg-surface pt-28 pb-12 sm:pt-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Link
                href="/"
                className="inline-flex min-h-[44px] items-center gap-2 text-xs font-semibold text-brand hover:text-heading sm:min-h-0"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Press Demonstration</span>
              </Link>

              <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.03em] text-heading sm:text-5xl">
                All Printing &amp; Advertising{" "}
                <span className="text-brand">Services.</span>
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-body/80">
                Complete directory of our seven production departments. Jump
                directly to any category or request a custom production quote.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {SERVICES.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="inline-flex min-h-[40px] items-center rounded-md border border-border-subtle bg-surface-subtle px-3.5 py-1.5 text-xs font-semibold text-heading transition-colors hover:border-brand hover:text-brand"
                  >
                    <span className="mr-1.5 text-brand-accent">{s.number}.</span>
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
