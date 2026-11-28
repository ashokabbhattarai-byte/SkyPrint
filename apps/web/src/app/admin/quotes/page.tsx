"use client";

import { useState } from "react";
import { MessageCircle, Search, Trash2 } from "lucide-react";
import type { QuoteRequest, QuoteStatus } from "@/types";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  QUOTE_STATUSES,
  deleteQuoteRequest,
  getQuoteRequests,
  updateQuoteRequest,
} from "@/lib/adminStore";
import { buildWhatsAppUrl, cn } from "@/lib/utils";

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => getQuoteRequests());
  const [filter, setFilter] = useState<"All" | QuoteStatus>("All");
  const [query, setQuery] = useState("");

  const filtered = quotes.filter((q) => {
    const matchesStatus = filter === "All" || q.status === filter;
    const text = `${q.customerName} ${q.phone} ${q.service} ${q.details}`.toLowerCase();
    const matchesQuery = !query.trim() || text.includes(query.trim().toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const handleStatusChange = (id: string, status: QuoteStatus) => {
    setQuotes(updateQuoteRequest(id, { status }));
  };

  const handleNoteChange = (id: string, notes: string) => {
    setQuotes(updateQuoteRequest(id, { notes }));
  };

  const handleDelete = (id: string) => {
    setQuotes(deleteQuoteRequest(id));
  };

  return (
    <AdminShell
      title="Quote Requests & Inquiries"
      subtitle="Track customer inquiries submitted via Get a Quote and Send Message."
    >
      {/* Filters & Search */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["All", ...QUOTE_STATUSES] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={cn(
                "min-h-[40px] rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                filter === status
                  ? "border-brand-action bg-brand-action text-white"
                  : "border-border-subtle bg-surface text-heading hover:border-brand"
              )}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, service..."
            aria-label="Search quote requests"
            className="min-h-[44px] w-full rounded-lg border border-border-subtle bg-surface py-2 pr-3 pl-9 text-base text-body placeholder:text-slate-400 outline-none focus:border-brand sm:text-sm"
          />
        </div>
      </div>

      {/* Quotes List */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border-subtle bg-surface p-10 text-center text-sm text-body/70">
          No quote requests match your current filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((q) => (
            <article
              key={q.id}
              className="rounded-xl border border-border-subtle bg-surface p-5 shadow-xs"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="font-display text-lg font-bold text-heading">
                      {q.customerName}
                    </h2>
                    <span className="rounded-md bg-surface-subtle px-2.5 py-0.5 text-xs font-semibold text-brand">
                      {q.service}
                    </span>
                    <span className="text-xs text-body/60">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-heading/85">
                    Phone / WhatsApp:{" "}
                    <a
                      href={`tel:${q.phone}`}
                      className="text-brand hover:underline"
                    >
                      {q.phone}
                    </a>
                  </p>

                  <p className="rounded-lg bg-surface-subtle p-3 text-sm text-body/85">
                    {q.details}
                  </p>

                  <div>
                    <label
                      htmlFor={`note-${q.id}`}
                      className="mb-1 block text-xs font-semibold text-heading/75"
                    >
                      Internal Studio Notes
                    </label>
                    <input
                      id={`note-${q.id}`}
                      type="text"
                      value={q.notes ?? ""}
                      onChange={(e) => handleNoteChange(q.id, e.target.value)}
                      placeholder="Add pricing, paper stock, or follow-up note..."
                      className="min-h-[40px] w-full rounded-md border border-border-subtle bg-surface px-3 py-1.5 text-base text-body outline-none focus:border-brand sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 sm:flex-row lg:w-56 lg:flex-col">
                  <select
                    aria-label={`Status for ${q.customerName}`}
                    value={q.status}
                    onChange={(e) =>
                      handleStatusChange(q.id, e.target.value as QuoteStatus)
                    }
                    className="min-h-[44px] w-full rounded-md border border-border-subtle bg-surface-subtle px-3 py-2 text-base font-semibold text-heading outline-none focus:border-brand sm:text-sm"
                  >
                    {QUOTE_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>

                  <a
                    href={buildWhatsAppUrl(
                      `Hello ${q.customerName}, regarding your ${q.service} inquiry at Sky Print & Advertising:`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-brand-action px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-secondary"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Reply WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDelete(q.id)}
                    className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-md border border-border-subtle bg-surface px-3.5 py-2 text-xs font-semibold text-red-600 transition-colors hover:border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
