import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import { brand, seo } from "@/config/brand";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: seo.title,
  description: seo.description,
  applicationName: brand.name,
  keywords: ["personal CRM", "relationship assistant", "networking", "voice-first", brand.name],
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: seo.title,
    description: seo.description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f9fa",
  width: "device-width",
  initialScale: 1,
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: brand.name,
      alternateName: brand.tagline,
      url: brand.siteUrl,
      description: seo.description,
    },
    {
      "@type": "SoftwareApplication",
      name: brand.name,
      description: seo.description,
      applicationCategory: "BusinessApplication",
      url: brand.siteUrl,
      releaseNotes: "In development. Early access signups are open.",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-bg text-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
