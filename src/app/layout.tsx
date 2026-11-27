import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sky Print & Advertising Pvt. Ltd. | Birtamode, Jhapa, Nepal",
  description:
    "From a Blank Canvas to a Brilliant Impression. Commercial digital & offset printing, flex & large-format banners, 3D acrylic & LED signboards, graphic design, finishing, and custom packaging in Birtamode, Jhapa, Nepal.",
  keywords: [
    "Sky Print & Advertising",
    "Printing Birtamode",
    "Flex Printing Jhapa",
    "LED Signboard Nepal",
    "Commercial Printing",
    "Packaging Printing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${manrope.variable} ${ibmPlexMono.variable}`}
    >
      <body className="min-h-screen bg-[#0B1018] text-[#E6ECF5] antialiased">
        {children}
      </body>
    </html>
  );
}
