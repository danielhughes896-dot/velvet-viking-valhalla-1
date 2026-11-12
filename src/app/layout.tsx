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
    /* WAS "Velvet Viking — Sacoro Awaits. Earn Your Place." The middle
       clause named a product that no longer exists and could not simply be
       renamed: "Sacoro Awaits" asserts nothing, because Sacoro is a family
       name rather than a hall you are summoned to.

       THE ORDER THEN SWAPPED, which is the part worth recording. It led with
       the company, and the template made every page "Pricing — Velvet
       Viking", "Build Your Training Block — Velvet Viking". A tab and a
       search result are about as customer-facing as text gets, and the
       founder's rule is "If it's customer facing SACORO" — so somebody
       searching for the thing they use met the name of the company that
       makes it. The lockup here is now exactly the masthead's: the product,
       then the company signing it. */
    default: "Sacoro by Velvet Viking — Earn Your Place.",
    template: "%s — Sacoro",
  },
  // POSITIONING PASS: "Endurance coaching" -> "Endurance training", here
  // and in the Open Graph description below. These two are the site's
  // widest-reach copy — the search-result snippet and the link preview
  // pasted into any chat or social post — so a coach claim here reached
  // people who never opened the site. Kept character-identical to
  // hero.sub in content/site.ts, which is the same sentence.
  description:
    "Training that learns how you train. The longer you run with Sacoro, the better it understands how you respond.",
  // Site-wide default; every route below overrides this with its own path
  // so each page declares its own canonical URL rather than inheriting "/".
  alternates: { canonical: "/" },
  openGraph: {
    // THE SHARED THING IS THE PRODUCT. A link pasted into a chat previews
    // whatever it is about, and these pages are about Sacoro; the company
    // signs the card in the artwork and in the footer of every page behind
    // it. siteName follows for the same reason — it is the label a crawler
    // prints beside the title, and printing the company there put the two
    // names in the wrong order on the one surface people see before they
    // have decided whether to click.
    title: "Sacoro",
    description:
      "Training that learns how you train. The longer you run with Sacoro, the better it understands how you respond.",
    url: siteUrl,
    siteName: "Sacoro",
    // THE CARD IS THE MARK NOW. It was the crest, recompressed to ~300KB for
    // crawlers. The crest is retired — its lettering is artwork reading
    // VALHALLA AWAITS, so it could not be renamed, only withdrawn — and this
    // card is composed from the same parts the site uses: the mark between its
    // two gold dots, the motto, and the company byline underneath, which is
    // the lockup the public app pages carry too.
    // WAS: the raw canonical crest (2.1MB) served directly
    // as the social-preview image. Same artwork, same transparency, no
    // crop or recomposite — just resized (longest edge 1200px) and
    // recompressed for a payload social crawlers actually fetch quickly.
    // The canonical file itself is untouched; Crest.tsx still renders the
    // full-resolution original everywhere on-page.
    images: ["/brand/sacoro-og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sacoro",
    description: "Earn Your Place. By Velvet Viking.",
    images: ["/brand/sacoro-og.png"],
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
      {/* THE SITE IS DARK. Founder: "the whole background should be black… Ever
          end user reach point should be black background. Only use white around
          the video."

          Put on <body> rather than section by section, so a page that is added
          later is dark because that is what the site is, not because somebody
          remembered. :root stays ivory and .theme-light is unchanged, so the
          one surface that wants white asks for it explicitly and everything
          else inherits — which is also why this is a two-line change rather
          than a repaint. */}
      <body className="theme-dark flex min-h-full flex-col bg-vv-bg font-sans text-vv-ink">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
