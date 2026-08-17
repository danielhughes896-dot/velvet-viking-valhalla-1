import type { Metadata } from "next";
import LegalDocument from "@/components/sections/LegalDocument";
import PageIntro from "@/components/sections/PageIntro";
import { LEGAL_CONTENT_APPROVED, termsDraft } from "@/content/legal";

// OVERNIGHT AUDIT: see privacy/page.tsx for the same fix and rationale.
export const metadata: Metadata = {
  title: "Terms",
  description: "This page will hold Velvet Viking's terms of use once finalised.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
};

// PUBLICATION GATE. The drafted policy in @/content/legal was written from the
// product's real observed behaviour, but it has not been reviewed by a
// solicitor and the company's statutory facts are still outstanding. Publishing
// unreviewed legal text is worse than publishing none, so the placeholder below
// remains the live state until LEGAL_CONTENT_APPROVED is flipped. Flipping it is
// the only change needed here.
export default function TermsPage() {
  if (LEGAL_CONTENT_APPROVED) {
    return <LegalDocument doc={termsDraft} />;
  }

  return (
    <PageIntro
      eyebrow="Velvet Viking"
      heading="Terms"
      sub="[Terms of use to be confirmed.]"
      body="This page will hold Velvet Viking's terms of use once finalised. No terms content is published here yet."
    />
  );
}
