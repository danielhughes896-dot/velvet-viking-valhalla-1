import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";

// OVERNIGHT AUDIT: see privacy/page.tsx for the same fix and rationale.
export const metadata: Metadata = {
  title: "Terms",
  description: "This page will hold Velvet Viking's terms of use once finalised.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <PageIntro
      eyebrow="Velvet Viking"
      heading="Terms"
      sub="[Terms of use to be confirmed.]"
      body="This page will hold Velvet Viking's terms of use once finalised. No terms content is published here yet."
    />
  );
}
