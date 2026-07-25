import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import NomadatoastSite from "@/components/nomadatoast/NomadatoastSite";
import "./nomadatoast.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Jo Mendes — Nomadatoast",
  description: "Practical AI tutorials for creators who want to grow, ship, and monetise.",
  openGraph: {
    title: "Jo Mendes — Nomadatoast",
    description: "Practical AI tutorials for creators who want to grow, ship, and monetise.",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className={jakarta.variable}>
      <NomadatoastSite />
    </div>
  );
}
