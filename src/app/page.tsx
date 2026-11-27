"use client";

import { PageShell } from "@/components/layout/PageShell";
import { FullPagePrintingDemo } from "@/components/sections/FullPagePrintingDemo";
import { TopServicesPreview } from "@/components/sections/TopServicesPreview";
import { CTASection } from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <PageShell>
      {(openQuoteFor) => (
        <>
          <FullPagePrintingDemo
            onStartProject={() => openQuoteFor("Printing Works")}
          />
          <TopServicesPreview onSelectService={openQuoteFor} />
          <CTASection onRequestQuote={() => openQuoteFor("Printing Works")} />
        </>
      )}
    </PageShell>
  );
}
