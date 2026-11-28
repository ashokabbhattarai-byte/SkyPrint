"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { AboutSection } from "@/components/sections/AboutSection";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { CTASection } from "@/components/sections/CTASection";

export default function AboutPage() {
  return (
    <PageShell>
      {(openQuoteFor) => (
        <>
          <section className="border-b border-slate-200 bg-[#F5F7F9] pt-28 pb-10 sm:pt-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#078FCB] hover:text-[#153B60]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Press Demonstration</span>
              </Link>
              <h1 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.03em] text-[#153B60] sm:text-5xl">
                Inside Sky Print{" "}
                <span className="text-[#078FCB]">Studio.</span>
              </h1>
            </div>
          </section>

          <AboutSection />
          <WhyChooseUsSection />
          <CapabilitiesSection />
          <CTASection onRequestQuote={() => openQuoteFor("Printing Works")} />
        </>
      )}
    </PageShell>
  );
}
