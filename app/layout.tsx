import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { profile } from "@/data/profile";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://ryandhana.example"; // set the real domain before launch

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: profile.seoTitle,
    template: "%s — Ryan Dhana",
  },
  description: profile.seoDescription,
  keywords: ["Ryan Dhana", "AI explorer", "creator", "Singapore", "interactive portfolio"],
  alternates: { canonical: "/" },
  openGraph: {
    title: profile.seoTitle,
    description: profile.seoDescription,
    url: SITE_URL,
    siteName: "Ryan Dhana",
    type: "website",
    images: ["/assets/references/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: profile.seoTitle,
    description: profile.seoDescription,
    images: ["/assets/references/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f5f4f1",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Creator & AI Explorer",
  description: profile.seoDescription,
  address: { "@type": "PostalAddress", addressCountry: "SG" },
  url: SITE_URL,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
