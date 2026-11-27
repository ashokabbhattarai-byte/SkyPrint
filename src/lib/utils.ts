import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildWhatsAppUrl(message?: string): string {
  const phone = "9779852682481";
  const text = encodeURIComponent(
    message ||
      "Hello Sky Print & Advertising Pvt. Ltd., I would like to discuss a printing or advertising project."
  );
  return `https://wa.me/${phone}?text=${text}`;
}
