"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MessageCircle, Send, X } from "lucide-react";
import { SERVICES } from "@/data/services";
import { COMPANY_INFO } from "@/data/company";
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
      `Project Inquiry — ${COMPANY_INFO.name}`,
      `Name / Business: ${name || "Not specified"}`,
      `Phone: ${phone || "Not specified"}`,
      `Service Category: ${service}`,
      `Specifications / Quantity: ${details || "Please advise"}`,
    ].join("\n");

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-[#111926] p-6 text-slate-100 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-semibold tracking-[0.16em] text-[#39C9E9] uppercase">
                  Project Brief
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">
                  Request a Print &amp; Ad Quote
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Send your specifications directly to our Birtamode production desk.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close quote modal"
                className="rounded-lg border border-white/12 p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                    Your Name / Company
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Everest Traders"
                    className="w-full rounded-lg border border-white/15 bg-[#0B1018] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-[#39C9E9]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full rounded-lg border border-white/15 bg-[#0B1018] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-[#39C9E9]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                  Service Category
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-[#0B1018] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-[#39C9E9]"
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
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                  Dimensions, Material &amp; Quantity
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Share size, paper stock or flex/LED specifications, quantity, and target timeline..."
                  className="w-full rounded-lg border border-white/15 bg-[#0B1018] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-[#39C9E9]"
                />
              </div>

              <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
                <button
                  type="submit"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#079BD3] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#39C9E9] hover:text-[#0B1018]"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Send via WhatsApp</span>
                </button>
                <a
                  href={mailtoHref}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-[#F7941D] hover:text-[#F7941D]"
                >
                  <Mail className="h-4 w-4 text-[#F7941D]" />
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
