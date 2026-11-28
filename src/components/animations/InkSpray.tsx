"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Ink channels, mapped to the four carriage nozzles top to bottom. */
const INKS = ["#078FCB", "#36B9D8", "#F7941D", "#153B60"] as const;
/** Classic halftone screen angles used for the dot clusters. */
const SCREEN_ANGLES = [15, 45, 75];
const NAVBAR_CLEARANCE = 96;

interface Zone {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

/** Irregular ink splat: overlapping core, a tail along the travel direction, satellite drops. */
function splatSvg(color: string, r: number, dir: number): [string, number] {
  const size = Math.ceil(r * 7);
  const c = size / 2;
  const parts: string[] = [`<circle cx="${c}" cy="${c}" r="${r.toFixed(2)}"/>`];
  for (let k = 0; k < 3; k++) {
    const a = Math.random() * Math.PI * 2;
    parts.push(
      `<circle cx="${(c + Math.cos(a) * r * 0.38).toFixed(2)}" cy="${(c + Math.sin(a) * r * 0.38).toFixed(2)}" r="${(r * rand(0.5, 0.8)).toFixed(2)}"/>`
    );
  }
  const deg = (dir * 180) / Math.PI;
  const tx = c + Math.cos(dir) * r * 1.05;
  const ty = c + Math.sin(dir) * r * 1.05;
  parts.push(
    `<ellipse cx="${tx.toFixed(2)}" cy="${ty.toFixed(2)}" rx="${(r * 0.95).toFixed(2)}" ry="${(r * 0.32).toFixed(2)}" transform="rotate(${deg.toFixed(1)} ${tx.toFixed(2)} ${ty.toFixed(2)})"/>`
  );
  const sats = 4 + Math.floor(Math.random() * 5);
  for (let k = 0; k < sats; k++) {
    const a = dir + (Math.random() - 0.5) * 2.2;
    const d = r * rand(1.4, 2.8);
    parts.push(
      `<circle cx="${(c + Math.cos(a) * d).toFixed(2)}" cy="${(c + Math.sin(a) * d).toFixed(2)}" r="${(r * rand(0.08, 0.3)).toFixed(2)}"/>`
    );
  }
  return [
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="${color}">${parts.join("")}</svg>`,
    size,
  ];
}

/** A fragment of a halftone screen: dots shrink toward the edge, rotated to a screen angle. */
function halftoneSvg(color: string, cell: number): [string, number] {
  const n = 6;
  const size = Math.ceil(cell * n);
  const c = size / 2;
  const max = (n / 2) * cell;
  const parts: string[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const x = (i + 0.5) * cell;
      const y = (j + 0.5) * cell;
      const falloff = 1 - Math.hypot(x - c, y - c) / max;
      const r = cell * 0.48 * Math.pow(Math.max(0, falloff), 0.7);
      if (r > 0.45) parts.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}"/>`);
    }
  }
  return [
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="${color}" style="transform:rotate(${pick(SCREEN_ANGLES)}deg)">${parts.join("")}</svg>`,
    size,
  ];
}

/**
 * Scroll-driven inkjet spray for a whole page.
 *
 * A print-head carriage rides a rail in the right gutter (wide screens) as the
 * page progress indicator. Scrolling fires CMYK droplets from its nozzles (or
 * from the screen edge on smaller screens). Droplets fly a short arc and land
 * as ink splats or halftone clusters, then fade.
 *
 * Droplets only land in empty space: the page gutters outside the content
 * column and the top/bottom padding of each <section>. They never land on
 * text, cards or images.
 *
 * Every particle is a DOM node animated with the Web Animations API
 * (transform/opacity only), so it moves with native scroll on the compositor:
 * no canvas redraw loop and no lag behind the page.
 */
export function InkSpray({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const carriageRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const layer = layerRef.current;
    const carriage = carriageRef.current;
    const rail = railRef.current;
    if (!wrap || !layer || !carriage || !rail) return;

    const small = window.matchMedia("(max-width: 767px)").matches;
    const MAX_SPLATS = small ? 32 : 60;
    const RATE = small ? 0.025 : 0.035; // droplets per px scrolled

    let zones: Zone[] = [];
    let wrapTop = 0;
    let startY = 0;
    let height = 0;
    let lastScroll = window.scrollY;
    let budget = 0;
    let raf = 0;
    const splats: { el: HTMLElement; dying: boolean }[] = [];

    const measure = () => {
      const scrollY = window.scrollY;
      const W = wrap.clientWidth;
      height = wrap.offsetHeight;
      wrapTop = wrap.getBoundingClientRect().top + scrollY;
      const startEl = wrap.querySelector<HTMLElement>("[data-ink-start]");
      startY = startEl ? startEl.getBoundingClientRect().bottom + scrollY - wrapTop : 0;

      const pad = W >= 1024 ? 32 : W >= 640 ? 24 : 16;
      const contentL = (W - Math.min(W, 1280)) / 2 + pad;
      const next: Zone[] = [];
      if (contentL >= 28) {
        next.push({ x0: 8, x1: contentL - 10, y0: startY, y1: height });
        next.push({ x0: W - contentL + 10, x1: W - 8, y0: startY, y1: height });
      }
      // Section padding bands: the space between a section's edge and its content container.
      wrap.querySelectorAll("section").forEach((s) => {
        const r = s.getBoundingClientRect();
        const top = r.top + scrollY - wrapTop;
        const bottom = r.bottom + scrollY - wrapTop;
        if (bottom <= startY + 10) return;
        const inner = s.firstElementChild?.getBoundingClientRect();
        if (!inner) return;
        const it = inner.top + scrollY - wrapTop;
        const ib = inner.bottom + scrollY - wrapTop;
        if (it - top >= 36) next.push({ x0: 12, x1: W - 12, y0: Math.max(top, startY) + 8, y1: it - 8 });
        if (bottom - ib >= 36) next.push({ x0: 12, x1: W - 12, y0: ib + 8, y1: bottom - 8 });
      });
      zones = next.filter((z) => z.x1 - z.x0 > 12 && z.y1 - z.y0 > 16);
    };

    const placeCarriage = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const range = Math.max(1, height - startY - vh);
      const p = Math.min(1, Math.max(0, (scrollY - wrapTop - startY + vh * 0.3) / range));
      const railRect = rail.getBoundingClientRect();
      const travel = Math.max(0, railRect.height - carriage.offsetHeight);
      carriage.style.transform = `translate3d(0, ${(p * travel).toFixed(1)}px, 0)`;
      const active = scrollY + vh > wrapTop + startY + 120;
      rail.dataset.active = active ? "true" : "false";
    };

    const pickTarget = (): { x: number; y: number; zoneW: number; zoneH: number } | null => {
      const vy0 = window.scrollY - wrapTop + NAVBAR_CLEARANCE;
      const vy1 = window.scrollY - wrapTop + window.innerHeight - 24;
      const visible = zones
        .map((z) => ({ z, y0: Math.max(z.y0, vy0), y1: Math.min(z.y1, vy1) }))
        .filter((v) => v.y1 - v.y0 > 16);
      if (!visible.length) return null;
      const total = visible.reduce((s, v) => s + (v.z.x1 - v.z.x0) * (v.y1 - v.y0), 0);
      let roll = Math.random() * total;
      for (const v of visible) {
        roll -= (v.z.x1 - v.z.x0) * (v.y1 - v.y0);
        if (roll <= 0) {
          return {
            x: rand(v.z.x0, v.z.x1),
            y: rand(v.y0, v.y1),
            zoneW: v.z.x1 - v.z.x0,
            zoneH: v.y1 - v.y0,
          };
        }
      }
      return null;
    };

    const fire = (nozzle: number) => {
      const lamp = carriage.querySelectorAll<HTMLElement>("[data-nozzle]")[nozzle];
      lamp?.animate([{ opacity: 1, transform: "scaleX(1.8)" }, { opacity: 0.55, transform: "scaleX(1)" }], {
        duration: 180,
        easing: "ease-out",
      });
    };

    const land = (x: number, y: number, color: string, dir: number, zoneW: number, zoneH: number) => {
      // Splat size is bounded by the zone so it can never spill onto content.
      const room = Math.min(zoneW, zoneH);
      const halftone = Math.random() < 0.32;
      const [svg, size] = halftone
        ? halftoneSvg(color, Math.min(rand(3.5, 6), room / 7))
        : splatSvg(color, Math.min(2.5 + Math.pow(Math.random(), 2.2) * 8, room / 7.5), dir);

      const el = document.createElement("div");
      el.className = "ink-splat";
      el.style.left = `${(x - size / 2).toFixed(1)}px`;
      el.style.top = `${(y - size / 2).toFixed(1)}px`;
      el.innerHTML = svg;
      // Ink density lives on the SVG so the wrapper's pop/fade animations own opacity cleanly.
      (el.firstElementChild as SVGElement).style.opacity = color === "#153B60" ? "0.7" : "0.85";
      layer.append(el);

      el.animate(
        [
          { transform: "scale(0.2)", opacity: 0 },
          { transform: "scale(1.12)", opacity: 1, offset: 0.55 },
          { transform: "scale(1)", opacity: 1 },
        ],
        { duration: 260, easing: "cubic-bezier(0.2, 0.8, 0.3, 1)" }
      );
      const record = { el, dying: false };
      splats.push(record);
      const fade = el.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 1400,
        delay: rand(3200, 6000),
        easing: "ease-in",
        fill: "forwards",
      });
      fade.onfinish = () => {
        el.remove();
        const i = splats.indexOf(record);
        if (i >= 0) splats.splice(i, 1);
      };

      // Too many on screen: retire the oldest quickly.
      const live = splats.filter((s) => !s.dying);
      if (live.length > MAX_SPLATS) {
        const oldest = live[0];
        oldest.dying = true;
        oldest.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, fill: "forwards" }).onfinish = () => {
          oldest.el.remove();
          const i = splats.indexOf(oldest);
          if (i >= 0) splats.splice(i, 1);
        };
      }
    };

    const spray = () => {
      const target = pickTarget();
      if (!target) return;
      const nozzle = Math.floor(Math.random() * INKS.length);
      const color = INKS[nozzle];
      const scrollY = window.scrollY;
      const W = wrap.clientWidth;

      let ox: number;
      let oy: number;
      // offsetParent is always null for position:fixed, so test for rendered boxes instead.
      const carriageShown = rail.getClientRects().length > 0 && rail.dataset.active === "true";
      if (carriageShown) {
        const lamp = carriage.querySelectorAll<HTMLElement>("[data-nozzle]")[nozzle];
        const r = (lamp ?? carriage).getBoundingClientRect();
        ox = r.left - 2;
        oy = r.top + r.height / 2 + scrollY - wrapTop;
        fire(nozzle);
      } else {
        ox = target.x < W / 2 ? -8 : W + 8;
        oy = target.y - rand(40, 160);
      }

      const dx = target.x - ox;
      const dy = target.y - oy;
      const dist = Math.hypot(dx, dy);
      const lift = Math.min(160, dist * 0.22);
      const steps = 8;
      const frames: Keyframe[] = [];
      for (let k = 0; k <= steps; k++) {
        const t = k / steps;
        // Quadratic arc with the control point lifted above the midpoint.
        const x = (1 - t) * (1 - t) * 0 + 2 * (1 - t) * t * (dx / 2) + t * t * dx;
        const y = 2 * (1 - t) * t * (dy / 2 - lift) + t * t * dy;
        frames.push({ transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${(0.6 + 0.4 * t).toFixed(2)})` });
      }
      const drop = document.createElement("div");
      drop.className = "ink-drop";
      drop.style.left = `${ox.toFixed(1)}px`;
      drop.style.top = `${oy.toFixed(1)}px`;
      drop.style.background = color;
      layer.append(drop);
      const dir = Math.atan2(dy + lift * 0.5, dx);
      const flight = drop.animate(frames, {
        duration: Math.min(560, 220 + dist * 0.35),
        easing: "cubic-bezier(0.3, 0.1, 0.6, 1)",
      });
      flight.onfinish = () => {
        drop.remove();
        land(target.x, target.y, color, dir, target.zoneW, target.zoneH);
      };
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        placeCarriage();
        if (reducedMotion) return;
        const scrollY = window.scrollY;
        const delta = Math.abs(scrollY - lastScroll);
        lastScroll = scrollY;
        budget += Math.min(delta, 160) * RATE;
        let shots = 0;
        while (budget >= 1 && shots < 3) {
          budget -= 1;
          shots++;
          spray();
        }
        budget = Math.min(budget, 2);
      });
    };

    const onResize = () => {
      measure();
      placeCarriage();
    };

    measure();
    placeCarriage();
    const ro = new ResizeObserver(onResize);
    ro.observe(wrap);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      layer.replaceChildren();
    };
  }, [reducedMotion]);

  return (
    <div ref={wrapRef} className="relative">
      {children}

      {/* Spray layer: in document flow, so splats scroll natively with the page */}
      <div
        ref={layerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      />

      {/* Print-head carriage on its rail: page progress + spray origin (wide screens) */}
      <div
        ref={railRef}
        aria-hidden="true"
        data-active="false"
        // bottom-40 keeps the carriage clear of the floating message popup (bottom-right).
        className="ink-rail pointer-events-none fixed top-24 right-4 bottom-40 z-30 hidden w-7 min-[1360px]:block"
      >
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#153B60]/15" />
        <span className="ink-rail-ticks absolute inset-y-0 left-1/2 w-2.5 -translate-x-1/2" />
        <div
          ref={carriageRef}
          className="absolute top-0 left-0 w-7 rounded-md border border-slate-200 bg-white px-1 py-1.5 shadow-[0_8px_20px_-8px_rgba(21,59,96,0.45)] will-change-transform"
        >
          <span className="mx-auto mb-1 block h-1 w-1 rounded-full bg-[#F7941D]" />
          <span className="flex flex-col items-start gap-[3px]">
            {INKS.map((c) => (
              <span
                key={c}
                data-nozzle
                className="block h-[3px] w-3 origin-left rounded-full opacity-55"
                style={{ background: c }}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
