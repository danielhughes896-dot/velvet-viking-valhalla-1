import type { Metadata } from "next";
import LegalDocument from "@/components/sections/LegalDocument";
import PageIntro from "@/components/sections/PageIntro";
import { LEGAL_APPROVALS, betaTermsDraft } from "@/content/legal";

// PUBLISHED, and reachable by URL rather than by navigation. This is the
// CANONICAL Private Beta Terms document; the app Settings screen and the beta
// onboarding note both resolve here.
//
// NOINDEX AND NOT IN THE SITEMAP, on purpose and not as an oversight. These terms
// govern an invited beta for five people, so they need to be one tap away for
// those five and are not public-facing content. Publishing them is about the
// testers being able to read what they have agreed to, not about reach — so the
// page is live, linked from the product, and left out of both the sitemap and the
// index. It is also deliberately absent from the website footer: the footer is
// public furniture and this is not a public document.
export const metadata: Metadata = {
  title: "Private Beta Terms",
  description: "The terms that apply to Velvet Viking's invited private beta.",
  alternates: { canonical: "/beta-terms" },
  robots: { index: false, follow: true },
};

export default function BetaTermsPage() {
  if (LEGAL_APPROVALS.betaTerms) {
    return <LegalDocument doc={betaTermsDraft} />;
  }

  return (
    <PageIntro
      eyebrow="Velvet Viking"
      heading="Private Beta Terms"
      sub="[Private beta terms to be confirmed.]"
      body="This page will hold the terms for Velvet Viking's invited private beta once finalised. No terms content is published here yet."
    />
  );
}
