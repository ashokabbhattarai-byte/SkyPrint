/**
 * Typed Sky Print brand & semantic theme object.
 * Mirrors the CSS custom properties in src/app/globals.css so JS/Canvas/SVG
 * components share one consistent source of truth.
 */
export const BRAND_THEME = {
  brand: {
    primary: "#078FCB",
    action: "#067EAF",
    secondary: "#153B60",
    cyan: "#36B9D8",
    accent: "#F7941D",
  },
  surface: {
    page: "#FFFFFF",
    subtle: "#F5F7F9",
    navy: "#153B60",
  },
  text: {
    heading: "#153B60",
    body: "#202B36",
    onDark: "#FFFFFF",
  },
} as const;
