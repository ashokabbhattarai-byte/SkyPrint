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
      `Project Inquiry: ${COMPANY_INFO.name}`,
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#153B60]/60 p-4 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white p-6 text-[#202B36] shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-[#078FCB] uppercase">
                  Project Brief
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-[#153B60]">
                  Request a Print &amp; Ad Quote
                </h3>
                <p className="mt-1 text-sm text-[#202B36]/80">
                  Send your specifications directly to our Birtamode production desk.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close quote modal"
                className="rounded-md border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-[#F5F7F9] hover:text-[#153B60]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#153B60]">
                    Your Name / Company
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Everest Traders"
                    className="w-full rounded-md border border-slate-300 bg-[#F5F7F9] px-3.5 py-2.5 text-sm text-[#202B36] placeholder:text-slate-400 outline-none transition focus:border-[#078FCB] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#153B60]">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full rounded-md border border-slate-300 bg-[#F5F7F9] px-3.5 py-2.5 text-sm text-[#202B36] placeholder:text-slate-400 outline-none transition focus:border-[#078FCB] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#153B60]">
                  Service Category
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-[#F5F7F9] px-3.5 py-2.5 text-sm text-[#202B36] outline-none transition focus:border-[#078FCB] focus:bg-white"
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
                <label className="mb-1.5 block text-xs font-semibold text-[#153B60]">
                  Dimensions, Material &amp; Quantity
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Share size, paper stock or flex/LED specifications, quantity, and target timeline..."
                  className="w-full rounded-md border border-slate-300 bg-[#F5F7F9] px-3.5 py-2.5 text-sm text-[#202B36] placeholder:text-slate-400 outline-none transition focus:border-[#078FCB] focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
                <button
                  type="submit"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[#067EAF] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#153B60]"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Send via WhatsApp</span>
                </button>
                <a
                  href={mailtoHref}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-[#153B60] transition-colors hover:border-[#F7941D] hover:text-[#F7941D]"
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
