import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://bio-nov-website.vercel.app"),
  title: "BIO N:OV | Fermentation-Based Nitric Oxide Wellness Support",
  description: "Discover BIO N:OV, a fermentation-based wellness formula developed to support the body’s natural nitric oxide pathways, circulation and everyday vitality.",
  openGraph: { title: "BIO N:OV", description: "Clearing the Way to Optimum Health", type: "website", images: ["/video/bio-nov-hero-poster.jpg"] },
  twitter: { card: "summary_large_image", title: "BIO N:OV", description: "Fermentation-based nitric oxide wellness support.", images: ["/video/bio-nov-hero-poster.jpg"] },
};

/* Google Translate rewrites text nodes in place, swapping them for <font>
   wrappers it owns. React still holds references to the originals, so the next
   time it unmounts or reorders one of those subtrees — opening a modal,
   switching an X-ray stage, changing a tab — removeChild is called against a
   parent that no longer owns the node and the whole app throws
   "a client-side exception has occurred".

   Making the two mutation methods tolerant of that mismatch is the long-
   standing fix (facebook/react#11538). It must run before hydration, hence an
   inline script rather than an effect. */
const translateCrashGuard = `
(function () {
  if (typeof Node !== "function" || !Node.prototype) return;
  var removeChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child && child.parentNode !== this) return child;
    return removeChild.apply(this, arguments);
  };
  var insertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) return newNode;
    return insertBefore.apply(this, arguments);
  };
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: translateCrashGuard }} />
      </head>
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
