import type { CapabilityItem, PrintingStage } from "@/types";

export const PRINTING_STAGES: PrintingStage[] = [
  {
    id: "stage-01",
    step: "01",
    label: "Blank Canvas",
    heading: "Every Great Print Begins With an Idea.",
    supportingText: "Every exceptional result starts with a blank canvas.",
    progressStart: 0,
    progressEnd: 0.2,
    inkChannels: [],
  },
  {
    id: "stage-02",
    step: "02",
    label: "Precision in Motion",
    heading: "Precision in Every Movement.",
    supportingText:
      "Technology and precision come together to create something extraordinary.",
    progressStart: 0.2,
    progressEnd: 0.44,
    inkChannels: ["C"],
  },
  {
    id: "stage-03",
    step: "03",
    label: "Colors Come Alive",
    heading: "Where Colors Come Alive.",
    supportingText:
      "Every shade and every detail contributes to the perfect impression.",
    progressStart: 0.44,
    progressEnd: 0.7,
    inkChannels: ["C", "M", "Y", "K"],
  },
  {
    id: "stage-04",
    step: "04",
    label: "The Final Print",
    heading: "Made to Make an Impression.",
    supportingText:
      "Beautifully printed. Professionally finished. Ready to be seen.",
    progressStart: 0.7,
    progressEnd: 0.86,
    inkChannels: ["C", "M", "Y", "K"],
  },
  {
    id: "stage-05",
    step: "05",
    label: "Beyond Printing",
    heading: "From Small Details to Big Impressions.",
    supportingText:
      "Explore a complete range of printing and advertising solutions from Sky Print.",
    progressStart: 0.86,
    progressEnd: 1.0,
    inkChannels: ["C", "M", "Y", "K"],
  },
];

export const PRODUCTION_CAPABILITIES: CapabilityItem[] = [
  {
    id: "digital-printing",
    code: "CAP — 01",
    title: "Digital & Offset Printing",
    subtitle: "Consistent Color Density Across Short & Volume Runs",
    description:
      "From crisp visiting cards and corporate stationery to multi-page catalogues, calibrated digital and offset workflows preserve razor-sharp text and smooth tonal gradients.",
    specs: ["CMYK ICC Calibration", "300–400 GSM Stocks", "Fast Turnaround"],
    image: "/images/cmyk-printheads.webp",
  },
  {
    id: "flex-large-format",
    code: "CAP — 02",
    title: "Flex & Large Format Production",
    subtitle: "Wide-Span Visuals Built for Outdoor & Event Impact",
    description:
      "Industrial wide-format heads lay vibrant weather-resistant inks across flex banners, vinyl wraps, one-way vision films, sunboards, and towering event backdrops.",
    specs: ["UV & Weather Resistant", "Seamless Wide Spans", "Eyelet & Frame Ready"],
    image: "/images/studio-press.webp",
  },
  {
    id: "signboards-fabrication",
    code: "CAP — 03",
    title: "Advertising Signboards & LED",
    subtitle: "3D Fabrication That Commands Street Presence",
    description:
      "Architectural ACP fascia boards, laser-cut acrylic letters, neon accents, and backlit LED glow signboards engineered for clean daytime finish and high night legibility.",
    specs: ["ACP & Acrylic Routing", "3D Channel Letters", "LED & Glow Systems"],
    image: "/images/large-format-signage.webp",
  },
  {
    id: "finishing-custom",
    code: "CAP — 04",
    title: "Finishing, Binding & Custom Merch",
    subtitle: "Precision Post-Press & Promotional Execution",
    description:
      "In-house lamination, guillotine trimming, die-cutting, perfect binding, PVC ID badges, sublimation mugs, apparel, and custom packaging boxes under one roof.",
    specs: ["Gloss & Matte Film", "Die-Cut & Creasing", "Sublimation & UV"],
    image: "/images/finishing-binding.webp",
  },
];
