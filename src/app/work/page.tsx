"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { CTASection } from "@/components/sections/CTASection";

export default function WorkPage() {
  return (
    <PageShell>
      {(openQuoteFor) => (
        <>
          <section className="border-b border-white/10 bg-[#0B1018] pt-28 pb-10 sm:pt-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#39C9E9] hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to 3D Printing Demo</span>
              </Link>
              <h1 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl">
                Our Work &amp;{" "}
                <span className="text-[#39C9E9]">Showcase.</span>
              </h1>
            </div>
          </section>

          <PortfolioSection
            onRequestSimilar={(title) => openQuoteFor(title)}
          />
          <CTASection onRequestQuote={() => openQuoteFor("Printing Works")} />
        </>
      )}
    </PageShell>
  );
}
