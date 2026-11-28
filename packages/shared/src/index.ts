export interface ServiceCategory {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  accent: "blue" | "cyan" | "orange" | "deep";
  layoutVariant: "wide" | "tall" | "square";
  items: string[];
}

export type PortfolioCategory =
  | "All"
  | "Large Format & Flex"
  | "Print & Stationery"
  | "Signboards & LED"
  | "Packaging"
  | "Promotional";

export interface PortfolioItem {
  id: string;
  title: string;
  category: Exclude<PortfolioCategory, "All">;
  image: string;
  finishSpec: string;
  dimensions: string;
  description: string;
  isRepresentativeSample: boolean;
}

export interface PrintingStage {
  id: string;
  step: string;
  label: string;
  heading: string;
  supportingText: string;
  progressStart: number;
  progressEnd: number;
  inkChannels: ("C" | "M" | "Y" | "K")[];
  points?: string[];
  quoteService?: string;
}

export interface CapabilityItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  specs: string[];
  image: string;
}

export type GalleryCategory =
  | "All"
  | "Press Floor"
  | "Large Format"
  | "Print & Finishing";

export interface GalleryItem {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, "All">;
  image: string;
  caption: string;
  spec?: string;
  aspect?: "wide" | "standard";
}

export type QuoteStatus = "New" | "Quoted" | "In Production" | "Completed";

export interface QuoteRequest {
  id: string;
  customerName: string;
  phone: string;
  service: string;
  details: string;
  status: QuoteStatus;
  createdAt: string;
  notes?: string;
}

export interface SiteSettings {
  companyName: string;
  shortName: string;
  tagline: string;
  phone: string;
  mobilePrimary: string;
  mobileSecondary: string;
  email: string;
  fullAddress: string;
  googleMapsUrl: string;
  heroTitle: string;
  heroSubtitle: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: "Admin";
}
