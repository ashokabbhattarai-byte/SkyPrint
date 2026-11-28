import Image from "next/image";
import { cn } from "@/lib/utils";

interface SkyPrintLogoProps {
  variant?: "dark" | "light";
  className?: string;
}

export function SkyPrintLogo({ variant = "dark", className }: SkyPrintLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center select-none",
        variant === "light" && "rounded-md bg-white px-3 py-1.5 shadow-2xs",
        className
      )}
    >
      <Image
        src="/logo/sky-print-logo-trimmed.png"
        alt="Sky Print & Advertising Pvt. Ltd."
        width={220}
        height={100}
        priority
        className="h-11 w-auto object-contain sm:h-12"
      />
    </span>
  );
}
