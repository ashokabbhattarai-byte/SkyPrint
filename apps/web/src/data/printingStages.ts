import type { CapabilityItem, PrintingStage } from "@/types";

export const PRINTING_STAGES: PrintingStage[] = [
  {
    id: "stage-01",
    step: "01",
    label: "Your Idea",
    heading: "Bring an idea. We make it print-ready.",
    supportingText:
      "Share a sketch, a logo or just a thought. Our design desk turns it into clean, print-ready artwork.",
    progressStart: 0,
    progressEnd: 0.2,
    inkChannels: [],
    points: ["Logo, banner & signboard design", "Artwork preparation & photo editing"],
    quoteService: "Design & Graphics",
  },
  {
    id: "stage-02",
    step: "02",
    label: "Wide Format",
    heading: "Banner-size prints, laid down precisely.",
    supportingText:
      "Wide-format heads print flex, vinyl and one-way vision for shopfronts, events and hoardings.",
    progressStart: 0.2,
    progressEnd: 0.44,
    inkChannels: ["C"],
    points: ["Flex banners, backdrops & hoardings", "Vinyl, sunboard & one-way vision"],
    quoteService: "Flex & Large Format Printing",
  },
  {
    id: "stage-03",
    step: "03",
    label: "True Colour",
    heading: "Your brand colours, consistent everywhere.",
    supportingText:
      "Calibrated CMYK output keeps the same blue on your visiting card, brochure and banner.",
    progressStart: 0.44,
    progressEnd: 0.7,
    inkChannels: ["C", "M", "Y", "K"],
    points: ["Offset & digital printing", "Visiting cards, brochures, posters & labels"],
    quoteService: "Printing Works",
  },
  {
    id: "stage-04",
    step: "04",
    label: "Finishing",
    heading: "Finished, trimmed and ready to use.",
    supportingText:
      "Lamination, cutting, binding and eyelets, so prints leave ready to hang, hand out or install.",
    progressStart: 0.7,
    progressEnd: 0.86,
    inkChannels: ["C", "M", "Y", "K"],
    points: ["Gloss & matte lamination", "Binding, die-cutting & eyelet fitting"],
    quoteService: "Finishing & Binding",
  },
  {
    id: "stage-05",
    step: "05",
    label: "Beyond Print",
    heading: "Signboards, packaging & gifts too.",
    supportingText:
      "One partner for your whole brand: from visiting cards to LED signboards and custom merchandise.",
    progressStart: 0.86,
    progressEnd: 1.0,
    inkChannels: ["C", "M", "Y", "K"],
    points: ["LED, ACP & 3D letter signboards", "Packaging, ID cards & custom gifts"],
    quoteService: "Advertising & Signboard Works",
  },
];

export const PRODUCTION_CAPABILITIES: CapabilityItem[] = [
  {
    id: "digital-printing",
    code: "01 / DIGITAL & OFFSET",
    title: "Digital & Offset Printing",
    subtitle: "Consistent Color Density Across Short & Volume Runs",
    description:
      "From crisp visiting cards and corporate stationery to multi-page catalogues, calibrated digital and offset workflows preserve sharp text and smooth tonal gradients.",
    specs: ["CMYK ICC Calibration", "300 to 400 GSM Stocks", "Fast Turnaround"],
    image: "/images/cmyk-printheads.webp",
  },
  {
    id: "flex-large-format",
    code: "02 / LARGE FORMAT",
    title: "Flex & Large Format Production",
    subtitle: "Wide-Span Visuals Built for Outdoor & Event Impact",
    description:
      "Industrial wide-format heads lay vibrant weather-resistant inks across flex banners, vinyl wraps, one-way vision films, sunboards, and event backdrops.",
    specs: ["UV & Weather Resistant", "Seamless Wide Spans", "Eyelet & Frame Ready"],
    image: "/images/studio-press.webp",
  },
  {
    id: "signboards-fabrication",
    code: "03 / SIGNAGE & LED",
    title: "Advertising Signboards & LED",
    subtitle: "3D Fabrication That Commands Street Presence",
    description:
      "Architectural ACP fascia boards, laser-cut acrylic letters, neon accents, and backlit LED glow signboards engineered for clean daytime finish and clear night legibility.",
    specs: ["ACP & Acrylic Routing", "3D Channel Letters", "LED & Glow Systems"],
    image: "/images/large-format-signage.webp",
  },
  {
    id: "finishing-custom",
    code: "04 / FINISHING & MERCH",
    title: "Finishing, Binding & Custom Merch",
    subtitle: "Precision Post-Press & Promotional Execution",
    description:
      "In-house lamination, guillotine trimming, die-cutting, perfect binding, PVC ID badges, sublimation mugs, apparel, and custom packaging boxes under one roof.",
    specs: ["Gloss & Matte Film", "Die-Cut & Creasing", "Sublimation & UV"],
    image: "/images/finishing-binding.webp",
  },
];
