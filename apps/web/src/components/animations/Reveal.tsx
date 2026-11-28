"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type RevealVariant = "up" | "ink";

interface RevealProps {
  children?: React.ReactNode;
  className?: string;
  /** "up" fades and lifts in; "ink" wipes in from the bottom like ink filling a sheet. */
  variant?: RevealVariant;
  /** Stagger delay in ms. */
  delay?: number;
  as?: "div" | "span" | "article" | "li";
}

/**
 * Plays once when the element scrolls into view.
 *
 * Server HTML carries no hidden state: the element only becomes
 * `data-inview="false"` (hidden) after hydration. If JS never runs, the
 * content stays visible instead of being stuck at opacity 0.
 */
export function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.dataset.inview = "true";
      return;
    }
    const rect = node.getBoundingClientRect();
    // Already on screen at mount: show immediately, don't flash it out.
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      node.dataset.inview = "true";
      return;
    }
    node.dataset.inview = "false";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.dataset.inview = "true";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return ref;
}

export function Reveal({ children, className, variant = "up", delay = 0, as = "div" }: RevealProps) {
  const ref = useInView<HTMLElement>();
  const Tag = as as "div";
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement | null>}
      className={cn(variant === "ink" ? "reveal-ink" : "reveal-up", className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}

/** Brush-stroke underline that draws itself under a word when it scrolls into view. */
export function InkUnderline({ color = "#F7941D" }: { color?: string }) {
  const ref = useInView<HTMLSpanElement>();
  return (
    <span ref={ref} aria-hidden="true" className="ink-underline">
      <svg viewBox="0 0 200 14" preserveAspectRatio="none">
        <path
          d="M3 9.5 C 40 4, 90 3.5, 130 5.5 S 185 8, 197 4.5"
          pathLength={1}
          stroke={color}
          strokeWidth={3.5}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  );
}
