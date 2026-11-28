"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MessageCircle, Send, X } from "lucide-react";
import { SERVICES } from "@/data/services";
import { COMPANY_INFO } from "@/data/company";
import { addQuoteRequest } from "@/lib/adminStore";
import { buildWhatsAppUrl } from "@/lib/utils";

interface QuoteModalProps {
  open: boolean;
  initialService?: string;
  onClose: () => void;
}

export function QuoteModal({
  open,
  initialService = "Printing Works",
  onClose,
}: QuoteModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(initialService);
  const [details, setDetails] = useState("");

  const buildInquiryText = () =>
    [
      `Project Inquiry: ${COMPANY_INFO.name}`,
      `Name / Business: ${name || "Not specified"}`,
      `Phone: ${phone || "Not specified"}`,
      `Service Category: ${service}`,
      `Specifications / Quantity: ${details || "Please advise"}`,
    ].join("\n");

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addQuoteRequest({
      customerName: name || "Website Visitor",
      phone: phone || "Not specified",
      service,
      details: details || "No specifications provided",
    });
    window.open(buildWhatsAppUrl(buildInquiryText()), "_blank", "noopener,noreferrer");
  };

  const mailtoHref = `mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
    `Quote Request: ${service}`
  )}&body=${encodeURIComponent(buildInquiryText())}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#153B60]/60 p-4 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-modal-title"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-xl border border-border-subtle bg-surface p-5 text-body shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-brand uppercase">
                  Project Brief
                </p>
                <h3
                  id="quote-modal-title"
                  className="mt-1 font-display text-2xl font-bold tracking-tight text-heading"
                >
                  Request a Print &amp; Ad Quote
                </h3>
                <p className="mt-1 text-sm text-body/80">
                  Send your specifications directly to our Birtamode production desk.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close quote modal"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border-subtle text-slate-500 transition-colors hover:bg-surface-subtle hover:text-heading"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="quote-name"
                    className="mb-1.5 block text-xs font-semibold text-heading"
                  >
                    Your Name / Company
                  </label>
                  <input
                    id="quote-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Everest Traders"
                    className="min-h-[44px] w-full rounded-md border border-slate-300 bg-surface-subtle px-3.5 py-2.5 text-base text-body placeholder:text-slate-400 outline-none transition focus:border-brand focus:bg-surface sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="quote-phone"
                    className="mb-1.5 block text-xs font-semibold text-heading"
                  >
                    Phone / WhatsApp
                  </label>
                  <input
                    id="quote-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="min-h-[44px] w-full rounded-md border border-slate-300 bg-surface-subtle px-3.5 py-2.5 text-base text-body placeholder:text-slate-400 outline-none transition focus:border-brand focus:bg-surface sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="quote-service"
                  className="mb-1.5 block text-xs font-semibold text-heading"
                >
                  Service Category
                </label>
                <select
                  id="quote-service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="min-h-[44px] w-full rounded-md border border-slate-300 bg-surface-subtle px-3.5 py-2.5 text-base text-body outline-none transition focus:border-brand focus:bg-surface sm:text-sm"
                >
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.number}. {s.title}
                    </option>
                  ))}
                  {!SERVICES.some((s) => s.title === service) && (
                    <option value={service}>{service}</option>
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="quote-details"
                  className="mb-1.5 block text-xs font-semibold text-heading"
                >
                  Dimensions, Material &amp; Quantity
                </label>
                <textarea
                  id="quote-details"
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Share size, paper stock or flex/LED specifications, quantity, and target timeline..."
                  className="w-full rounded-md border border-slate-300 bg-surface-subtle px-3.5 py-2.5 text-base text-body placeholder:text-slate-400 outline-none transition focus:border-brand focus:bg-surface sm:text-sm"
                />
              </div>

              <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
                <button
                  type="submit"
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-md bg-brand-action px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Send via WhatsApp</span>
                </button>
                <a
                  href={mailtoHref}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md border border-slate-300 bg-surface px-4 py-3 text-sm font-semibold text-heading transition-colors hover:border-brand-accent hover:text-brand-accent"
                >
                  <Mail className="h-4 w-4 text-brand-accent" />
                  <span>Email Quote</span>
                  <Send className="h-3.5 w-3.5 opacity-60" />
                </a>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
