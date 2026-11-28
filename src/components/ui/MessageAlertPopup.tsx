"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface MessageAlertPopupProps {
  onSendMessage: () => void;
}

/**
 * Compact floating logo-based "Send Message" alert.
 * Appears as a simple Sky Print logo button with a gentle periodic prompt.
 */
export function MessageAlertPopup({ onSendMessage }: MessageAlertPopupProps) {
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => {
      setAlertOpen(true);
    }, 8000);

    return () => window.clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (alertOpen) return;
    const repeatTimer = window.setTimeout(() => {
      setAlertOpen(true);
    }, 40000);
    return () => window.clearTimeout(repeatTimer);
  }, [alertOpen]);

  return (
    <div className="fixed right-4 bottom-20 z-40 flex items-center gap-2.5 sm:right-6 sm:bottom-22">
      <AnimatePresence>
        {alertOpen && (
          <motion.div
            key="alert-badge"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, x: 12, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.94 }}
            transition={{ duration: 0.22 }}
            className="flex items-center gap-1.5 rounded-full border border-[#078FCB]/25 bg-white py-1.5 pr-2 pl-3.5 shadow-[0_10px_28px_-10px_rgba(21,59,96,0.28)]"
          >
            <button
              type="button"
              onClick={() => {
                setAlertOpen(false);
                onSendMessage();
              }}
              className="text-xs font-semibold text-[#153B60] transition-colors hover:text-[#078FCB]"
            >
              Send Message
            </button>
            <button
              type="button"
              onClick={() => setAlertOpen(false)}
              aria-label="Dismiss message prompt"
              className="rounded-full p-0.5 text-slate-400 transition-colors hover:bg-[#F5F7F9] hover:text-[#153B60]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => {
          setAlertOpen(false);
          onSendMessage();
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        aria-label="Send Message to Sky Print"
        title="Send Message"
        className="relative flex h-13 w-13 items-center justify-center rounded-full border border-slate-200 bg-white p-2 shadow-[0_12px_30px_-8px_rgba(21,59,96,0.32)] transition-colors hover:border-[#078FCB]"
      >
        <Image
          src="/logo/sky-print-logo-trimmed.png"
          alt="Sky Print"
          width={44}
          height={20}
          className="h-auto w-10 object-contain"
        />
        <span
          className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center"
          aria-hidden="true"
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F7941D] opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full border border-white bg-[#F7941D]" />
        </span>
      </motion.button>
    </div>
  );
}
