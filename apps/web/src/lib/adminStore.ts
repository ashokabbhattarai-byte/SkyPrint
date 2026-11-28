import type {
  GalleryItem,
  PortfolioItem,
  QuoteRequest,
  QuoteStatus,
  ServiceCategory,
  SiteSettings,
} from "@/types";
import { COMPANY_INFO } from "@/data/company";
import { SERVICES } from "@/data/services";
import { PORTFOLIO_ITEMS } from "@/data/portfolio";
import { GALLERY_ITEMS } from "@/data/gallery";

const KEYS = {
  quotes: "skyprint_admin_quotes_v1",
  services: "skyprint_admin_services_v1",
  portfolio: "skyprint_admin_portfolio_v1",
  gallery: "skyprint_admin_gallery_v1",
  settings: "skyprint_admin_settings_v1",
} as const;

const DEFAULT_QUOTES: QuoteRequest[] = [
  {
    id: "q-1001",
    customerName: "Everest Mart Birtamode",
    phone: "9852611223",
    service: "Advertising & Signboard Works",
    details: "12ft x 4ft ACP Board with 3D backlit acrylic letters for storefront.",
    status: "New",
    createdAt: "2026-11-28T09:15:00Z",
    notes: "Site measurement scheduled for tomorrow morning.",
  },
  {
    id: "q-1002",
    customerName: "Kankai Eye Care Clinic",
    phone: "9842677889",
    service: "Printing Works",
    details: "2,000 Visiting Cards (350 GSM Matte) + 500 A4 Letterheads.",
    status: "Quoted",
    createdAt: "2026-11-27T14:40:00Z",
    notes: "Sent quotation on WhatsApp.",
  },
  {
    id: "q-1003",
    customerName: "Jhapa Trade Expo",
    phone: "9801455667",
    service: "Flex & Large Format Printing",
    details: "Stage backdrop 20ft x 10ft Starflex + 6 standee banners.",
    status: "In Production",
    createdAt: "2026-11-26T11:20:00Z",
    notes: "Printing on Flex Machine 1.",
  },
];

const DEFAULT_SETTINGS: SiteSettings = {
  companyName: COMPANY_INFO.name,
  shortName: COMPANY_INFO.shortName,
  tagline: COMPANY_INFO.tagline,
  phone: COMPANY_INFO.phone,
  mobilePrimary: COMPANY_INFO.mobilePrimary,
  mobileSecondary: COMPANY_INFO.mobileSecondary,
  email: COMPANY_INFO.email,
  fullAddress: COMPANY_INFO.fullAddress,
  googleMapsUrl: COMPANY_INFO.googleMapsUrl,
  heroTitle: "Turning Ideas Into Impressions.",
  heroSubtitle:
    "Flex banners, visiting cards, LED signboards, packaging and custom gifts: designed, printed and finished under one roof.",
};

function readStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors in restricted browsers
  }
}

/* ---------------- Quote Requests ---------------- */
export function getQuoteRequests(): QuoteRequest[] {
  return readStore<QuoteRequest[]>(KEYS.quotes, DEFAULT_QUOTES);
}

export function addQuoteRequest(
  input: Omit<QuoteRequest, "id" | "status" | "createdAt">
): QuoteRequest {
  const items = getQuoteRequests();
  const created: QuoteRequest = {
    ...input,
    id: `q-${Date.now().toString().slice(-6)}`,
    status: "New",
    createdAt: new Date().toISOString(),
  };
  writeStore(KEYS.quotes, [created, ...items]);
  return created;
}

export function updateQuoteRequest(
  id: string,
  patch: Partial<Pick<QuoteRequest, "status" | "notes">>
): QuoteRequest[] {
  const updated = getQuoteRequests().map((q) =>
    q.id === id ? { ...q, ...patch } : q
  );
  writeStore(KEYS.quotes, updated);
  return updated;
}

export function deleteQuoteRequest(id: string): QuoteRequest[] {
  const next = getQuoteRequests().filter((q) => q.id !== id);
  writeStore(KEYS.quotes, next);
  return next;
}

/* ---------------- Services ---------------- */
export function getAdminServices(): ServiceCategory[] {
  return readStore<ServiceCategory[]>(KEYS.services, SERVICES);
}

export function saveAdminServices(items: ServiceCategory[]): ServiceCategory[] {
  writeStore(KEYS.services, items);
  return items;
}

/* ---------------- Showcase / Portfolio ---------------- */
export function getAdminPortfolio(): PortfolioItem[] {
  return readStore<PortfolioItem[]>(KEYS.portfolio, PORTFOLIO_ITEMS);
}

export function saveAdminPortfolio(items: PortfolioItem[]): PortfolioItem[] {
  writeStore(KEYS.portfolio, items);
  return items;
}

/* ---------------- Gallery ---------------- */
export function getAdminGallery(): GalleryItem[] {
  return readStore<GalleryItem[]>(KEYS.gallery, GALLERY_ITEMS);
}

export function saveAdminGallery(items: GalleryItem[]): GalleryItem[] {
  writeStore(KEYS.gallery, items);
  return items;
}

/* ---------------- Site Settings ---------------- */
export function getSiteSettings(): SiteSettings {
  return readStore<SiteSettings>(KEYS.settings, DEFAULT_SETTINGS);
}

export function saveSiteSettings(settings: SiteSettings): SiteSettings {
  writeStore(KEYS.settings, settings);
  return settings;
}

export const QUOTE_STATUSES: QuoteStatus[] = [
  "New",
  "Quoted",
  "In Production",
  "Completed",
];
