"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export type ActionButtonVariant =
  | "primary"
  | "secondary"
  | "outline-light"
  | "outline-dark"
  | "ghost";

export type ActionButtonSize = "sm" | "md" | "lg";

export interface ActionButtonProps {
  children: React.ReactNode;
  variant?: ActionButtonVariant;
  size?: ActionButtonSize;
  href?: string;
  external?: boolean;
  fullWidthOnMobile?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  tabIndex?: number;
  ariaLabel?: string;
}

const VARIANT_CLASSES: Record<ActionButtonVariant, string> = {
  primary:
    "bg-brand-action text-white shadow-sm hover:bg-brand-secondary focus-visible:outline-brand",
  secondary:
    "bg-brand text-white shadow-sm hover:bg-brand-action focus-visible:outline-brand",
  "outline-light":
    "border border-slate-300 bg-surface text-heading hover:border-brand hover:text-brand",
  "outline-dark":
    "border border-white/35 bg-white/10 text-white hover:border-white hover:bg-white hover:text-heading focus-visible:outline-white",
  ghost:
    "text-brand hover:bg-surface-subtle hover:text-heading",
};

const SIZE_CLASSES: Record<ActionButtonSize, string> = {
  sm: "min-h-[44px] sm:min-h-[38px] px-3.5 py-2 text-xs gap-1.5",
  md: "min-h-[44px] px-5 py-2.5 text-sm gap-2",
  lg: "min-h-[48px] px-6 py-3.5 text-sm gap-2",
};

/**
 * Dynamic, mobile-first button/link primitive.
 * Enforces >=44px touch targets on mobile and consistent semantic styling.
 */
export function ActionButton({
  children,
  variant = "primary",
  size = "md",
  href,
  external = false,
  fullWidthOnMobile = false,
  leftIcon,
  rightIcon,
  className,
  onClick,
  type = "button",
  disabled = false,
  tabIndex,
  ariaLabel,
}: ActionButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-md font-semibold transition-colors",
    fullWidthOnMobile && "w-full sm:w-auto",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    disabled && "pointer-events-none opacity-55",
    className
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={tabIndex}
          aria-label={ariaLabel}
          onClick={onClick}
          className={classes}
        >
          {leftIcon}
          <span>{children}</span>
          {rightIcon}
        </a>
      );
    }

    return (
      <Link
        href={href}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        onClick={onClick}
        className={classes}
      >
        {leftIcon}
        <span>{children}</span>
        {rightIcon}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      onClick={onClick}
      className={classes}
    >
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
}
