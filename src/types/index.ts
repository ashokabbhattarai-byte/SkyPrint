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
  /** Concrete customer-facing facts shown on the hero stage card. */
  points?: string[];
  /** Service title (from SERVICES) preselected when quoting from this stage. */
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
