import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import VeloceSite from "@/components/veloce/VeloceSite";
import "./veloce.css";

const veloceSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-veloce-serif",
});

export const metadata: Metadata = {
  title: "VELOCE AUTOMOBILI | Tempesta GT — Edition of 199",
  description:
    "The storm, held still. 830 hp twin-turbo V8, carbon monocoque, 199 pieces. A cinematic real-time 3D experience by Veloce Automobili.",
  openGraph: {
    title: "VELOCE AUTOMOBILI — Tempesta GT",
    description: "Edition of 199. From $420,000. The storm, held still.",
    type: "website",
  },
};

export default function VelocePage() {
  return (
    <main className={veloceSerif.variable}>
      <VeloceSite />
    </main>
  );
}
