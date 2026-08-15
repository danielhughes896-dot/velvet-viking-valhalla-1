import type { Metadata, Viewport } from "next";
import { Cinzel, Oswald, Inter, JetBrains_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = "https://velvet-viking-website-preview.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Velvet Viking — Valhalla Awaits. Earn Your Place.",
    template: "%s — Velvet Viking",
  },
  description:
    "Endurance coaching that pays attention to what you actually do, not just what was planned. Valhalla by Velvet Viking.",
  openGraph: {
    title: "Velvet Viking",
    description:
      "Endurance coaching that pays attention to what you actually do, not just what was planned. Valhalla by Velvet Viking.",
    url: siteUrl,
    siteName: "Velvet Viking",
    images: ["/brand/velvet-viking-crest.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Velvet Viking",
    description: "Valhalla Awaits. Earn Your Place.",
    images: ["/brand/velvet-viking-crest.png"],
  },
  // Deliberately NOT the same file as openGraph/twitter images above: favicon and
  // apple-touch-icon render very small (browser tab, home-screen icon), where the
  // full detailed crest is known to turn illegible below ~96px. Held back on the
  // pre-swap asset pending a dedicated small-size review — see brand crest notes
  // in README.md.
  icons: {
    icon: "/brand/velvet-viking-icon-source.png",
    apple: "/brand/velvet-viking-icon-source.png",
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
      className={`${cinzel.variable} ${oswald.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-vv-bg font-sans text-vv-ink">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
