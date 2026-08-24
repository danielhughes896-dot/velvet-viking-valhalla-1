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
  // NO `icons` DECLARATION, DELIBERATELY. It used to name two crest-derived
  // PNGs in /public, which left /favicon.ico returning 404 because nothing
  // served that path — the one URL every browser asks for unprompted.
  //
  // The App Router's file convention now owns all three: src/app/favicon.ico,
  // icon.png and apple-icon.png. Next emits the <link> tags and serves
  // /favicon.ico itself. Declaring `icons` here as well would override the
  // convention and reintroduce exactly the gap it closes.
  //
  // THE MARK, NOT THE CREST, and that is the settled hierarchy rather than a
  // preference: the circular crest is the full identity and keeps the hero;
  // the gold VV is the compact mark for small-format identity, which is what
  // a 16px tab icon is. The crest's wordmark and two mottos are illegible at
  // that size; the VV is one shape and survives it. Generated from the
  // supplied artwork by containing it in a square canvas — never stretched,
  // never cropped, proportions exactly the artwork's 1148x957.
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
