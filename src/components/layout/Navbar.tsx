"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, MessageCircle, X } from "lucide-react";
import { NAV_LINKS } from "@/data/company";
import { SkyPrintLogo } from "@/components/ui/SkyPrintLogo";
import { buildWhatsAppUrl, cn } from "@/lib/utils";

interface NavbarProps {
  onOpenQuote: (service?: string) => void;
}

export function Navbar({ onOpenQuote }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#0B1018]/85 py-3 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.6)] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="focus:outline-none">
          <SkyPrintLogo variant="light" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : link.href.startsWith("/") && pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                  isActive
                    ? "text-[#39C9E9]"
                    : "text-slate-300 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 360, damping: 30 }}
                    className="absolute inset-0 -z-10 rounded-lg border border-[#39C9E9]/25 bg-[#079BD3]/15"
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-2.5 md:flex">
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-[#39C9E9]/60 hover:text-white"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#39C9E9]" />
            <span>WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => onOpenQuote()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#079BD3] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#39C9E9] hover:text-[#0B1018]"
          >
            <span>Get a Quote</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-slate-100 md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-[#0F1724] md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base font-semibold text-slate-100 hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-3">
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-100"
                >
                  <MessageCircle className="h-4 w-4 text-[#39C9E9]" />
                  WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenQuote();
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#079BD3] px-4 py-2.5 text-sm font-bold text-white"
                >
                  Get a Quote
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
