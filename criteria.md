# Sky Print & Advertising — Frontend UI/UX & Engineering Criteria

This document defines the living standards for building, styling, and verifying all pages and components in the Sky Print & Advertising web application.

---

## 1. Mobile-First & Phone Priority (`ui-ux-pro-max`)

Most customers visit from mobile phones. Every layout, typography scale, and interactive control must be designed for small phones first (`375px`–`390px`), then enhanced for tablets (`768px`) and desktops (`1024px`–`1440px+`).

### Mandatory Mobile Rules
- **Viewport & Zoom**: `viewport` in `src/app/layout.tsx` sets `width=device-width, initialScale=1`. Never disable pinch-to-zoom.
- **Dynamic Viewport Units**: Use `min-h-dvh` / `h-dvh` instead of `100vh` / `h-screen` so mobile browser toolbars do not clip hero content or modals.
- **No Horizontal Overflow**: `document.documentElement.scrollWidth <= window.innerWidth` on every route at `375px`, `768px`, and `1440px`.
- **Touch Target Minimums**: All interactive buttons, links, drawer items, and modal controls must meet **44×44px** (`min-h-[44px]`) on mobile, with at least `8px` spacing between adjacent targets.
- **iOS Input Auto-Zoom Prevention**: All `<input>`, `<select>`, and `<textarea>` fields must use `text-base` (`16px`) on mobile (`text-base sm:text-sm`).
- **Tap Responsiveness**: `touch-action: manipulation` is applied globally in `src/app/globals.css` to eliminate the 300ms mobile tap delay.
- **Readable Mobile Typography**: Body copy `>= 14px–16px` with `1.5–1.75` line-height; avoid microscopic `10px` text for primary reading content.

---

## 2. CSS & Tailwind v4 Semantic Token Architecture

Tailwind CSS v4 (`@import "tailwindcss";` + `@theme inline`) is the core styling stack. Keep all colors and theme values centralized via **CSS custom properties** and **semantic token names** rather than scattering raw hex codes or dark-mode toggles.

### Theme Mode Policy
- **Light-only (`color-scheme: light`)**: No dark mode toggle and no `prefers-color-scheme: dark` overrides.
- **Future Extensibility**: All semantic tokens are defined in `:root` inside `src/app/globals.css` and mirrored in `src/lib/theme.ts` (`BRAND_THEME`). Future theme updates or variants only need to override `:root` variables.

### Semantic Token Reference (`src/app/globals.css` & `src/lib/theme.ts`)
| Semantic Token | Tailwind Class Examples | Value | Usage |
| :--- | :--- | :--- | :--- |
| `--brand-primary` | `text-brand`, `bg-brand`, `border-brand` | `#078FCB` | Primary Sky Blue brand accents & active links |
| `--brand-action` | `bg-brand-action` | `#067EAF` | Accessible primary button background (WCAG AA with white text) |
| `--brand-secondary` | `bg-brand-secondary`, `hover:bg-brand-secondary` | `#153B60` | Deep Navy hover states & dark sections |
| `--brand-cyan` | `text-brand-cyan`, `bg-brand-cyan` | `#36B9D8` | Print Cyan highlights on dark surfaces |
| `--brand-accent` | `text-brand-accent`, `bg-brand-accent` | `#F7941D` | Sun Orange indicators, eyebrows, & notification dots |
| `--surface-page` | `bg-surface` | `#FFFFFF` | Primary page & card background |
| `--surface-subtle` | `bg-surface-subtle` | `#F5F7F9` | Alternating light section & input background |
| `--surface-navy` | `bg-surface-navy` | `#153B60` | Hero backdrop, CTA card, & footer surface |
| `--text-heading` | `text-heading` | `#153B60` | Section headings & card titles |
| `--text-body` | `text-body` | `#202B36` | Body copy & descriptions |
| `--border-subtle` | `border-border-subtle` | `#E2E8F0` | Card & section dividers |

### Typography Tokens
- **Display / Headings**: `font-display` (`--font-manrope`, weights `600`, `700`, `800`)
- **Body / UI**: `font-sans` (`--font-inter`, weights `400`, `500`, `600`)

---

## 3. Dynamic, Reusable Components & Props

Avoid duplicating UI markup across pages. Use typed, prop-driven components:

- **`PageShell`** (`src/components/layout/PageShell.tsx`): Wraps every route with `SmoothScroll`, accessible `Skip to main content` link, `Navbar`, `InkSpray`, `Footer`, compact `MessageAlertPopup`, and `QuoteModal`.
- **`ActionButton`** (`src/components/ui/ActionButton.tsx`): Dynamic button/link primitive supporting `variant` (`"primary" | "secondary" | "outline-light" | "outline-dark" | "ghost"`), `size` (`"sm" | "md" | "lg"`), `href`, `external`, `fullWidthOnMobile`, `leftIcon`, and `rightIcon`, enforcing `>= 44px` mobile touch targets.
- **`SectionHeading`** (`src/components/ui/SectionHeading.tsx`): Reusable section header accepting `eyebrow`, `title`, `accentWord`, `description`, `align`, and `theme` (`"light" | "dark"`).
- **`QuoteModal`** (`src/components/ui/QuoteModal.tsx`): Accessible dialog (`role="dialog"`, `aria-modal="true"`) with `initialService` prefill, explicit `<label htmlFor>` associations, and `16px` mobile inputs.
- **`MessageAlertPopup`** (`src/components/ui/MessageAlertPopup.tsx`): Compact floating Sky Print logo trigger with periodic `Send Message` prompt (no oversized card container).
- **`Reveal`** (`src/components/animations/Reveal.tsx`): Scroll-triggered reveal wrapper supporting `"up"` and `"ink"` variants with `prefers-reduced-motion` safety.

---

## 4. Accessibility & Motion Standards

- **Keyboard & Focus**: All interactive elements keep visible `:focus-visible` outlines (`2px solid var(--brand-primary)`). `PageShell` provides a `Skip to main content` link targeting `#main-content`.
- **Screen Readers**: Icon-only buttons require `aria-label`. Decorative SVGs, stripes, and dots use `aria-hidden="true"`. Modals use `role="dialog"` and `aria-modal="true"`.
- **Reduced Motion**: Respect `@media (prefers-reduced-motion: reduce)` in CSS and `usePrefersReducedMotion()` in JS/Canvas animations.
- **Copy Standards**: Write natural, direct business copy. Never use em dashes (`—`) in user-facing UI text, and never invent unverified company awards or stats.

---

## 5. Pre-Delivery Verification Checklist

Before considering any UI change complete:
1. Run `npx tsc --noEmit && npm run lint && npm run build` (must exit `0`).
2. Test on **mobile (`375×812`)** and **desktop (`1440×820`)** in headless Chrome:
   - Zero console errors or uncaught page errors.
   - `scrollWidth <= innerWidth` (no horizontal overflow).
   - Touch targets (`>= 44px`) and mobile readability verified visually via screenshots.
   - All routes (`/`, `/services`, `/work`, `/about`) render cleanly.
