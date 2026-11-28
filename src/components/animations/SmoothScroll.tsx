"use client";

/**
 * Native browser scroll passthrough — ensures zero wheel-hijacking or
 * touch-scroll stalls across phones, trackpads, and ngrok tunnels.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
