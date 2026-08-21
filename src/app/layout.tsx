import type { Metadata, Viewport } from "next";
import { Cinzel, Oswald, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteUrl } from "@/content/site";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Velvet Viking — Valhalla Awaits. Earn Your Place.",
    template: "%s — Velvet Viking",
  },
  // POSITIONING PASS: "Endurance coaching" -> "Endurance training", here
  // and in the Open Graph description below. These two are the site's
  // widest-reach copy — the search-result snippet and the link preview
  // pasted into any chat or social post — so a coach claim here reached
  // people who never opened the site. Kept character-identical to
  // hero.sub in content/site.ts, which is the same sentence.
  description:
    "Training that learns how you train. The longer you run with Valhalla, the better it understands how you respond.",
  // Site-wide default; every route below overrides this with its own path
  // so each page declares its own canonical URL rather than inheriting "/".
  alternates: { canonical: "/" },
  openGraph: {
    title: "Velvet Viking",
    description:
      "Training that learns how you train. The longer you run with Valhalla, the better it understands how you respond.",
    url: siteUrl,
    siteName: "Velvet Viking",
    // OVERNIGHT AUDIT: was the raw canonical crest (2.1MB) served directly
    // as the social-preview image. Same artwork, same transparency, no
    // crop or recomposite — just resized (longest edge 1200px) and
    // recompressed for a payload social crawlers actually fetch quickly.
    // The canonical file itself is untouched; Crest.tsx still renders the
    // full-resolution original everywhere on-page.
    images: ["/brand/velvet-viking-crest-og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Velvet Viking",
    description: "Valhalla Awaits. Earn Your Place.",
    images: ["/brand/velvet-viking-crest-og.png"],
  },
  // OVERNIGHT AUDIT: favicon/apple-touch-icon previously pointed straight
  // at velvet-viking-icon-source.png — a 1184x1328, 1.48MB file — fetched
  // by the browser at full size for a tab icon. These two derivatives are
  // that exact same source image resized to the dimensions browsers
  // actually request (192px / Apple's 180px spec size), nothing recomposed
  // or altered. This does NOT resolve the pending "swap to a crest-derived
  // icon" decision noted in README.md — that source image is still the one
  // in use, just delivered efficiently.
  icons: {
    icon: "/brand/velvet-viking-icon-192.png",
    apple: "/brand/velvet-viking-icon-180.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#15110D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${oswald.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-vv-bg font-sans text-vv-ink">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
