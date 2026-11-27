"use client";

import { useState } from "react";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QuoteModal } from "@/components/ui/QuoteModal";

interface PageShellProps {
  children: (openQuoteFor: (service?: string) => void) => React.ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteService, setQuoteService] = useState("Printing Works");

  const openQuoteFor = (service?: string) => {
    if (service) setQuoteService(service);
    setQuoteOpen(true);
  };

  return (
    <SmoothScroll>
      <div className="relative flex min-h-screen flex-col bg-[#0B1018] text-[#E6ECF5]">
        <Navbar onOpenQuote={openQuoteFor} />
        <main className="flex-1">{children(openQuoteFor)}</main>
        <Footer />
        <QuoteModal
          key={quoteService}
          open={quoteOpen}
          initialService={quoteService}
          onClose={() => setQuoteOpen(false)}
        />
      </div>
    </SmoothScroll>
  );
}
