"use client";

import { PageShell } from "@/components/layout/PageShell";
import { HeroScrollExperience } from "@/components/sections/HeroScrollExperience";
import { TopServicesPreview } from "@/components/sections/TopServicesPreview";
import { GallerySection } from "@/components/sections/GallerySection";
import { CTASection } from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <PageShell>
      {(openQuoteFor) => (
        <>
          <HeroScrollExperience onRequestQuote={openQuoteFor} />
          <TopServicesPreview onSelectService={openQuoteFor} />
          <GallerySection onRequestQuote={openQuoteFor} />
          <CTASection onRequestQuote={() => openQuoteFor("Printing Works")} />
        </>
      )}
    </PageShell>
  );
}
