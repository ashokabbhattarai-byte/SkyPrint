export const COMPANY_INFO = {
  name: "Sky Print & Advertising Pvt. Ltd.",
  shortName: "Sky Print",
  tagline: "From a Blank Canvas to a Brilliant Impression.",
  addressLines: [
    "Behind Siddhartha Bank & Janata Bank",
    "Bhadrapur Road, Birtamode",
    "Jhapa, Nepal",
  ],
  fullAddress:
    "Behind Siddhartha Bank & Janata Bank, Bhadrapur Road, Birtamode, Jhapa, Nepal",
  email: "skyprintadv.pvtltd@gmail.com",
  phone: "023-590505",
  mobilePrimary: "9852682481",
  mobileSecondary: "9817072805",
  whatsappNumber: "+9779852682481",
  socials: {
    facebookPlaceholder: true,
    instagramPlaceholder: true,
  },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Our Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "#contact" },
] as const;
