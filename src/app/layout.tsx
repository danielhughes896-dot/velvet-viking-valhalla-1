import type { Metadata, Viewport } from "next";
import { Cinzel, Oswald, Inter, JetBrains_Mono } from "next/font/google";
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

// THE FOURTH FACE, AND IT CARRIES ONE LABEL.
//
// globals.css used to say "No --font-mono override: nothing on the site uses
// font-mono", which was true until /start became the app's builder entry. The
// app sets its stage counter in --num-face, 'JetBrains Mono' — the rail reads
// "01 / 11", and a proportional face gives the two numerals different widths,
// so the slash sits off-centre and the counter wobbles as the stage advances.
// That is the whole reason a monospace is specified there, and dropping it
// would make this screen not-quite the app's screen in the one place the
// founder is most likely to look.
//
// ONE WEIGHT ONLY. .bld-stage-no is 700 and nothing else on this site uses
// the face, so the payload is a single woff2 rather than the five Inter
// carries.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    /* WAS "Velvet Viking — Sacoro Awaits. Earn Your Place." The middle
       clause named a product that no longer exists and could not simply be
       renamed: "Sacoro Awaits" asserts nothing, because Sacoro is a family
       name rather than a hall you are summoned to. What remains is the
       company, the product and the standard — which is also what a search
       result needs to carry. */
    default: "Velvet Viking — Sacoro. Earn Your Place.",
    template: "%s — Velvet Viking",
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
    title: "Velvet Viking",
    description:
      "Training that learns how you train. The longer you run with Sacoro, the better it understands how you respond.",
    url: siteUrl,
    siteName: "Velvet Viking",
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
    title: "Velvet Viking",
    description: "Sacoro. Earn Your Place.",
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
      className={`${cinzel.variable} ${oswald.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
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
