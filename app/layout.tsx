import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import VoiceAgent from "../components/VoiceAgent";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://bio-nov.example"),
  title: "BIO N:OV | Fermentation-Based Nitric Oxide Wellness Support",
  description: "Discover BIO N:OV, a fermentation-based wellness formula developed to support the body’s natural nitric oxide pathways, circulation and everyday vitality.",
  openGraph: { title: "BIO N:OV", description: "Clearing the Way to Optimum Health", type: "website", images: ["/images/bio-nov-hero.jpg"] },
  twitter: { card: "summary_large_image", title: "BIO N:OV", description: "Fermentation-based nitric oxide wellness support.", images: ["/images/bio-nov-hero.jpg"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="scroll-smooth"><body className={inter.variable}>{children}<VoiceAgent /></body></html>;
}
