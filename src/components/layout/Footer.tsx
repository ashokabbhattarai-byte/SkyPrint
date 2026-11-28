"use client";

import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone, Smartphone } from "lucide-react";
import { COMPANY_INFO, NAV_LINKS } from "@/data/company";
import { SERVICES } from "@/data/services";
import { SkyPrintLogo } from "@/components/ui/SkyPrintLogo";
import { buildWhatsAppUrl } from "@/lib/utils";

export function Footer() {
  return (
    <footer
      id="contact"
      className="relative z-10 border-t border-[#153B60] bg-[#153B60] text-white"
    >
      {/* Subtle sun-orange & print-cyan registration hairline */}
      <div className="flex h-1 w-full" aria-hidden="true">
        <span className="flex-1 bg-[#078FCB]" />
        <span className="w-24 bg-[#36B9D8]" />
        <span className="w-16 bg-[#F7941D]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SkyPrintLogo variant="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-200">
              {COMPANY_INFO.name}: From a Blank Canvas to a Brilliant
              Impression. Commercial printing, design, signage, and advertising
              solutions in Birtamode, Jhapa.
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-100">
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#36B9D8]" />
                <span>{COMPANY_INFO.fullAddress}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#36B9D8]" />
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="transition-colors hover:text-[#36B9D8]"
                >
                  {COMPANY_INFO.email}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#36B9D8]" />
                <a
                  href={`tel:${COMPANY_INFO.phone}`}
                  className="transition-colors hover:text-[#36B9D8]"
                >
                  {COMPANY_INFO.phone}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Smartphone className="h-4 w-4 shrink-0 text-[#F7941D]" />
                <span>
                  <a
                    href={`tel:${COMPANY_INFO.mobilePrimary}`}
                    className="transition-colors hover:text-[#36B9D8]"
                  >
                    {COMPANY_INFO.mobilePrimary}
                  </a>{" "}
                  /{" "}
                  <a
                    href={`tel:${COMPANY_INFO.mobileSecondary}`}
                    className="transition-colors hover:text-[#36B9D8]"
                  >
                    {COMPANY_INFO.mobileSecondary}
                  </a>
                </span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold tracking-[0.14em] text-[#36B9D8] uppercase">
              Pages
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm font-medium text-slate-200">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-[#36B9D8]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h3 className="text-xs font-semibold tracking-[0.14em] text-[#36B9D8] uppercase">
              Services
            </h3>
            <ul className="mt-4 grid grid-cols-1 gap-2.5 text-sm text-slate-200 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/services#${s.id}`}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-[#36B9D8]"
                  >
                    <span className="text-xs font-semibold text-[#F7941D]">
                      {s.number}.
                    </span>
                    <span>{s.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold tracking-[0.14em] text-[#36B9D8] uppercase">
              Connect
            </h3>
            <div className="mt-4 space-y-2.5">
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#067EAF] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#078FCB]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Desk</span>
              </a>

              <div className="rounded-md border border-dashed border-white/25 bg-white/5 px-3 py-2 text-xs text-slate-300">
                Facebook:{" "}
                <span className="text-[11px] opacity-80">Link placeholder</span>
              </div>
              <div className="rounded-md border border-dashed border-white/25 bg-white/5 px-3 py-2 text-xs text-slate-300">
                Instagram:{" "}
                <span className="text-[11px] opacity-80">Link placeholder</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-8 text-xs text-slate-300 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {COMPANY_INFO.name} All rights reserved.
          </p>
          <p>Birtamode, Jhapa, Nepal · Commercial Print &amp; Advertising</p>
        </div>
      </div>
    </footer>
  );
}
