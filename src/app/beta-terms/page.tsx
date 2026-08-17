import type { Metadata } from "next";
import LegalDocument from "@/components/sections/LegalDocument";
import PageIntro from "@/components/sections/PageIntro";
import { LEGAL_CONTENT_APPROVED, betaTermsDraft } from "@/content/legal";

// The Private Beta Terms draft existed in @/content/legal with no route to
// reach it, which made it unreadable by the five people it is written for.
// Deliberately not in sitemap.ts: an unpublished page is not something to hand
// a search engine, and it is reached by a direct link given to invited testers.
export const metadata: Metadata = {
  title: "Private Beta Terms",
  description:
    "The terms that apply to Velvet Viking's invited private beta, once finalised.",
  alternates: { canonical: "/beta-terms" },
  robots: { index: false, follow: true },
};

// PUBLICATION GATE, the same one the other legal pages use. These terms are
// short on purpose — five invited, non-paying testers using pre-release
// software, not a commercial contract — but short is not the same as reviewed,
// so the gate applies here too.
export default function BetaTermsPage() {
  if (LEGAL_CONTENT_APPROVED) {
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
