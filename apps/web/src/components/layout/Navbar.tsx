"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, Menu, MessageCircle, Phone, X } from "lucide-react";
import { COMPANY_INFO, NAV_LINKS } from "@/data/company";
import { SkyPrintLogo } from "@/components/ui/SkyPrintLogo";
import { buildWhatsAppUrl, cn } from "@/lib/utils";

interface NavbarProps {
  onOpenQuote?: (service?: string) => void;
}

export function Navbar({ onOpenQuote }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xs transition-shadow duration-300",
        scrolled && "shadow-[0_10px_30px_-18px_rgba(21,59,96,0.22)]"
      )}
    >
      {/* Top CMYK Brand Registration Hairline */}
      <div className="flex h-[3px] w-full" aria-hidden="true">
        <span className="flex-1 bg-brand" />
        <span className="w-28 bg-brand-cyan" />
        <span className="w-20 bg-brand-accent" />
        <span className="w-24 bg-brand-secondary" />
      </div>

      {/* Studio Utility Strip (collapses smoothly on scroll for clean focus) */}
      <div
        className={cn(
          "hidden overflow-hidden border-b border-border-subtle/80 bg-surface-subtle transition-all duration-300 md:block",
          scrolled ? "max-h-0 border-b-0 opacity-0" : "max-h-9 opacity-100"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs font-medium text-body/80 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-brand-accent" />
            <span>Bhadrapur Road, Birtamode, Jhapa, Nepal</span>
          </span>
          <div className="flex items-center gap-5">
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
            >
              <Phone className="h-3.5 w-3.5 text-brand" />
              <span>
                {COMPANY_INFO.phone} / {COMPANY_INFO.mobilePrimary}
              </span>
            </a>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
            >
              <Mail className="h-3.5 w-3.5 text-brand" />
              <span>{COMPANY_INFO.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-3 focus:outline-none"
        >
          <SkyPrintLogo variant="dark" />
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
                  "relative px-4 py-2 text-sm font-semibold tracking-[-0.01em] transition-colors",
                  isActive
                    ? "text-[#078FCB]"
                    : "text-[#153B60] hover:text-[#078FCB]"
                )}
              >
                <span className="inline-flex items-center gap-1.5">
                  {isActive && (
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-[#F7941D]"
                      aria-hidden="true"
                    />
                  )}
                  <span>{link.label}</span>
                </span>
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    transition={{ type: "spring", stiffness: 360, damping: 30 }}
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[#078FCB]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: WhatsApp & Get a Quote */}
        <div className="hidden items-center gap-2.5 md:flex">
          <a
            href={buildWhatsAppUrl("Hello Sky Print, I would like to inquire about printing services.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-[#153B60] transition-colors hover:border-[#078FCB] hover:text-[#078FCB]"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#078FCB]" />
            <span>WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => onOpenQuote?.()}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#067EAF] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#153B60]"
          >
            <span>Get a Quote</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mobile Toggle (44x44px touch target) */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-300 text-heading transition-colors hover:bg-surface-subtle md:hidden"
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
            className="overflow-hidden border-t border-border-subtle bg-surface md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[44px] items-center rounded-md px-3 py-2 text-base font-semibold text-heading hover:bg-surface-subtle"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-3">
                <a
                  href={buildWhatsAppUrl("Hello Sky Print, I would like to inquire about printing services.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#153B60]"
                >
                  <MessageCircle className="h-4 w-4 text-[#078FCB]" />
                  WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenQuote?.();
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#067EAF] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <span>Get a Quote</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
