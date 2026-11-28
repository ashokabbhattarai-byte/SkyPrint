import type { GalleryCategory, GalleryItem } from "@/types";

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  "All",
  "Press Floor",
  "Large Format",
  "Print & Finishing",
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "flex-press-line-1",
    title: "Wide-Format Flex Printing Press",
    category: "Large Format",
    image: "/images/gallery/flex-press-1.webp",
    caption:
      "Active wide-format solvent press on our Birtamode production floor for outdoor flex banners, hoardings, and event backdrops.",
    spec: "High-Density CMYK · Up to 10 ft Roll",
    aspect: "wide",
  },
  {
    id: "digital-press-unit-1",
    title: "Commercial Digital Production Press",
    category: "Press Floor",
    image: "/images/gallery/digital-press-1.webp",
    caption:
      "Precision digital press calibrated for sharp typography on visiting cards, brochures, letterheads, and short-run catalogs.",
    spec: "Up to 350 GSM Art Card",
    aspect: "standard",
  },
  {
    id: "cutting-plotter-bay",
    title: "Precision Vinyl Cutting Plotter",
    category: "Print & Finishing",
    image: "/images/gallery/cutting-plotter.webp",
    caption:
      "Contour cutting and die-line plotter for custom stickers, vehicle graphics, frosted glass vinyl, and retail labels.",
    spec: "Optical Contour Registration",
    aspect: "standard",
  },
  {
    id: "flex-press-line-2",
    title: "High-Speed Solvent Banner Line",
    category: "Large Format",
    image: "/images/gallery/flex-press-2.webp",
    caption:
      "Dedicated roll-to-roll solvent printer engineered for weather-resistant outdoor signage and multi-panel backdrops.",
    spec: "UV-Stable Outdoor Ink",
    aspect: "standard",
  },
  {
    id: "cmyk-printhead-detail",
    title: "CMYK Printhead & Nozzle Calibration",
    category: "Press Floor",
    image: "/images/cmyk-printheads.webp",
    caption:
      "Continuous ink delivery and ICC-profiled droplet calibration ensuring consistent brand colors across reprints.",
    spec: "4-Channel CMYK Calibration",
    aspect: "standard",
  },
  {
    id: "digital-press-unit-2",
    title: "Color Proofing & Sheet-Fed Unit",
    category: "Press Floor",
    image: "/images/gallery/digital-press-2.webp",
    caption:
      "Sheet-fed digital unit handling corporate stationery, certificates, flyers, and urgent same-day commercial print runs.",
    spec: "Fast Turnaround Sheet-Fed",
    aspect: "wide",
  },
  {
    id: "illuminated-led-signage",
    title: "3D Acrylic & Illuminated LED Facade",
    category: "Print & Finishing",
    image: "/images/large-format-signage.webp",
    caption:
      "Custom laser-cut acrylic letters, brushed ACP cladding, and backlit LED storefront boards fabricated in-house.",
    spec: "ACP + Laser Acrylic + LED",
    aspect: "wide",
  },
  {
    id: "studio-printer-bay",
    title: "Birtamode Press & Finishing Bay",
    category: "Print & Finishing",
    image: "/images/gallery/printer-bay.webp",
    caption:
      "Our in-house production floor behind Siddhartha Bank & Janata Bank, Bhadrapur Road, Birtamode.",
    spec: "End-to-End In-House Production",
    aspect: "wide",
  },
];
