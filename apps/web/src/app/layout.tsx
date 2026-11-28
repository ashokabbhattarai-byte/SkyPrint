import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

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
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body className="min-h-dvh bg-surface text-body antialiased">
        {children}
      </body>
    </html>
  );
}
