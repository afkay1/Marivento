import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBookBar from "@/components/MobileBookBar";
import Concierge from "@/components/Concierge";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/format";
import { hotelLd } from "@/lib/seo";

const display = Fraunces({ subsets: ["latin"], axes: ["SOFT", "opsz"], style: ["normal", "italic"], variable: "--font-display", display: "swap" });
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Marivento | Boutique Cliff Hotel on the Amalfi Coast", template: "%s | Marivento" },
  description: "A 24-room boutique hotel in a restored 18th-century villa on the cliffs of the Amalfi Coast. Sea-view rooms and suites, terrace dining, a spa carved into the rock. Book direct for the best rate.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Marivento", images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Marivento on the cliffs of the Amalfi Coast" }] },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#F7F3EC", width: "device-width", initialScale: 1 };

const PREPAINT = "@media (prefers-reduced-motion: no-preference){html [data-reveal]{opacity:0}html [data-cover]{display:block}}";
const NOSCRIPT = "[data-reveal]{opacity:1!important}[data-cover]{display:none!important}";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: PREPAINT }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: NOSCRIPT }} />
        </noscript>
      </head>
      <body>
        <JsonLd data={hotelLd()} />
        <a href="#main" className="sr-only z-[100] rounded-full bg-sea px-5 py-3 text-chalk focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <SmoothScroll />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileBookBar />
        <Concierge />
      </body>
    </html>
  );
}
