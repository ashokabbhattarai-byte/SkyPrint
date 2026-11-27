"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SkyPrintLogoProps {
  variant?: "dark" | "light";
  className?: string;
}

/**
 * Checks on mount whether the user has placed their original unmodified logo
 * at /logo/sky-print-logo.png. Until supplied, renders a clean geometric
 * Sky Print emblem + wordmark without broken-image icons.
 */
export function SkyPrintLogo({ variant = "dark", className }: SkyPrintLogoProps) {
  const [hasSuppliedLogo, setHasSuppliedLogo] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/logo/sky-print-logo.png", { method: "HEAD" })
      .then((res) => {
        if (active && res.ok) setHasSuppliedLogo(true);
      })
      .catch(() => {
        // Keep geometric brand mark fallback when logo file is not supplied yet
      });
    return () => {
      active = false;
    };
  }, []);

  const isLight = variant === "light";

  return (
    <span className={cn("inline-flex items-center gap-3 select-none", className)}>
      {hasSuppliedLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo/sky-print-logo.png"
          alt="Sky Print & Advertising Pvt. Ltd."
          className="h-10 w-auto max-w-[180px] object-contain"
        />
      ) : (
        <span className="inline-flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#079BD3]/35 bg-white shadow-xs"
          >
            <svg
              viewBox="0 0 36 36"
              className="h-6 w-6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 22L18 8L30 22H23L18 16L13 22H6Z" fill="#079BD3" />
              <path d="M11 26L18 18L25 26H11Z" fill="#39C9E9" />
              <circle cx="27" cy="11" r="3" fill="#F7941D" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span
              className={cn(
                "text-base font-extrabold tracking-tight",
                isLight ? "text-white" : "text-[#111827]"
              )}
            >
              SKY PRINT
            </span>
            <span
              className={cn(
                "mt-0.5 font-mono text-[10px] tracking-[0.14em] uppercase",
                isLight ? "text-[#39C9E9]" : "text-[#079BD3]"
              )}
            >
              &amp; ADVERTISING
            </span>
          </span>
        </span>
      )}
    </span>
  );
}
