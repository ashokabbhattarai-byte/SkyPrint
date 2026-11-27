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
      className="relative z-10 border-t border-white/10 bg-[#080C12] text-slate-200"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SkyPrintLogo variant="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              {COMPANY_INFO.name} — From a Blank Canvas to a Brilliant
              Impression. Commercial printing, design, signage, and advertising
              solutions in Birtamode, Jhapa.
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#39C9E9]" />
                <span>{COMPANY_INFO.fullAddress}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#39C9E9]" />
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="transition-colors hover:text-[#39C9E9]"
                >
                  {COMPANY_INFO.email}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#39C9E9]" />
                <a
                  href={`tel:${COMPANY_INFO.phone}`}
                  className="transition-colors hover:text-[#39C9E9]"
                >
                  {COMPANY_INFO.phone}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Smartphone className="h-4 w-4 shrink-0 text-[#F7941D]" />
                <span>
                  <a
                    href={`tel:${COMPANY_INFO.mobilePrimary}`}
                    className="transition-colors hover:text-[#39C9E9]"
                  >
                    {COMPANY_INFO.mobilePrimary}
                  </a>{" "}
                  /{" "}
                  <a
                    href={`tel:${COMPANY_INFO.mobileSecondary}`}
                    className="transition-colors hover:text-[#39C9E9]"
                  >
                    {COMPANY_INFO.mobileSecondary}
                  </a>
                </span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-mono text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
              Pages
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm font-medium text-slate-300">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-[#39C9E9]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h3 className="font-mono text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
              Services
            </h3>
            <ul className="mt-4 grid grid-cols-1 gap-2.5 text-sm text-slate-300 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/services#${s.id}`}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-[#39C9E9]"
                  >
                    <span className="font-mono text-[11px] text-[#39C9E9]">
                      {s.number}.
                    </span>
                    <span>{s.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-mono text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
              Connect
            </h3>
            <div className="mt-4 space-y-2.5">
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#079BD3] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#39C9E9] hover:text-[#0B1018]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Desk</span>
              </a>

              <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.03] px-3 py-2 text-xs text-slate-400">
                Facebook —{" "}
                <span className="font-mono text-[10px]">Link placeholder</span>
              </div>
              <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.03] px-3 py-2 text-xs text-slate-400">
                Instagram —{" "}
                <span className="font-mono text-[10px]">Link placeholder</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {COMPANY_INFO.name} All rights reserved.
          </p>
          <p className="font-mono text-[11px]">
            Birtamode, Jhapa, Nepal · CMYK Precision Print Studio
          </p>
        </div>
      </div>
    </footer>
  );
}
