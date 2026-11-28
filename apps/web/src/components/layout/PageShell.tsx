"use client";

import { useState } from "react";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { InkSpray } from "@/components/animations/InkSpray";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QuoteModal } from "@/components/ui/QuoteModal";
import { MessageAlertPopup } from "@/components/ui/MessageAlertPopup";

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
      <div className="relative flex min-h-dvh flex-col bg-surface text-body">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-brand-action focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Navbar onOpenQuote={openQuoteFor} />
        <main id="main-content" className="flex-1">
          <InkSpray>{children(openQuoteFor)}</InkSpray>
        </main>
        <Footer />
        <MessageAlertPopup onSendMessage={() => openQuoteFor("Printing Works")} />
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
