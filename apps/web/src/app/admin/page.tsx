"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Image as ImageIcon,
  Layers,
  MessageSquareText,
  Settings,
  Sparkles,
} from "lucide-react";
import type { QuoteRequest } from "@/types";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  getAdminGallery,
  getAdminPortfolio,
  getAdminServices,
  getQuoteRequests,
} from "@/lib/adminStore";

export default function AdminOverviewPage() {
  const [quotes] = useState<QuoteRequest[]>(() => getQuoteRequests());
  const [stats] = useState(() => ({
    services: getAdminServices().length,
    portfolio: getAdminPortfolio().length,
    gallery: getAdminGallery().length,
  }));

  const newCount = quotes.filter((q) => q.status === "New").length;

  const cards = [
    {
      label: "Quote Requests",
      value: quotes.length,
      note: `${newCount} new pending`,
      href: "/admin/quotes",
      icon: MessageSquareText,
      accent: "text-brand-accent",
    },
    {
      label: "Service Departments",
      value: stats.services,
      note: "Manage categories & items",
      href: "/admin/services",
      icon: Layers,
      accent: "text-brand",
    },
    {
      label: "Showcase Proofs",
      value: stats.portfolio,
      note: "Selected work & specs",
      href: "/admin/showcase",
      icon: Sparkles,
      accent: "text-brand-cyan",
    },
    {
      label: "Gallery Photos",
      value: stats.gallery,
      note: "Press floor & outputs",
      href: "/admin/gallery",
      icon: ImageIcon,
      accent: "text-heading",
    },
  ];

  return (
    <AdminShell
      title="Studio Dashboard"
      subtitle="Manage incoming quote requests and dynamic content shown on the public Sky Print website."
      actions={
        <Link
          href="/admin/quotes"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-brand-action px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary"
        >
          <MessageSquareText className="h-4 w-4" />
          <span>Review Quotes ({newCount})</span>
        </Link>
      }
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-xl border border-border-subtle bg-surface p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-body/70 uppercase">
                  {card.label}
                </span>
                <Icon className={`h-5 w-5 ${card.accent}`} />
              </div>
              <p className="mt-3 font-display text-3xl font-extrabold text-heading tabular-nums">
                {card.value}
              </p>
              <p className="mt-1 flex items-center justify-between text-xs font-medium text-brand">
                <span>{card.note}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </p>
            </Link>
          );
        })}
      </div>

      {/* Recent Quotes + Quick Links */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="rounded-xl border border-border-subtle bg-surface p-5 sm:p-6 lg:col-span-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-heading">
              Recent Quote Inquiries
            </h2>
            <Link
              href="/admin/quotes"
              className="text-xs font-semibold text-brand hover:text-heading"
            >
              View All →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-border-subtle">
            {quotes.slice(0, 5).map((q) => (
              <div
                key={q.id}
                className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold text-heading">
                      {q.customerName}
                    </p>
                    <span className="rounded bg-surface-subtle px-2 py-0.5 text-[11px] font-semibold text-brand">
                      {q.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-body/75">
                    {q.service} · {q.phone}
                  </p>
                </div>
                <Link
                  href="/admin/quotes"
                  className="inline-flex min-h-[36px] shrink-0 items-center text-xs font-semibold text-brand hover:text-heading"
                >
                  Open →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border-subtle bg-surface p-5 sm:p-6 lg:col-span-4">
          <h2 className="font-display text-lg font-bold text-heading">
            Site Configuration
          </h2>
          <p className="mt-1 text-sm text-body/75">
            Update contact numbers, Birtamode address, Google Maps link, and
            hero messaging.
          </p>
          <Link
            href="/admin/settings"
            className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md border border-border-subtle bg-surface-subtle px-4 py-2.5 text-sm font-semibold text-heading transition-colors hover:border-brand hover:text-brand"
          >
            <Settings className="h-4 w-4 text-brand" />
            <span>Open Site Settings</span>
          </Link>
        </section>
      </div>
    </AdminShell>
  );
}
