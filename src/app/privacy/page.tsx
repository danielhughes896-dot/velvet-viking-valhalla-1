import type { Metadata } from "next";
import LegalDocument from "@/components/sections/LegalDocument";
import PageIntro from "@/components/sections/PageIntro";
import { LEGAL_CONTENT_APPROVED, privacyDraft } from "@/content/legal";

// OVERNIGHT AUDIT: was { title: "Privacy" } only — missing description (the
// only page on the site without one) and indexable by default despite
// holding no real content yet. noindex is standard, reversible practice for
// a placeholder legal page; drop it the moment real policy content ships.
export const metadata: Metadata = {
  title: "Privacy",
  description: "This page will hold Velvet Viking's privacy policy once finalised.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

// PUBLICATION GATE. The drafted policy in @/content/legal was written from the
// product's real observed behaviour, but it has not been reviewed by a
// solicitor and the company's statutory facts are still outstanding. Publishing
// unreviewed legal text is worse than publishing none, so the placeholder below
// remains the live state until LEGAL_CONTENT_APPROVED is flipped. Flipping it is
// the only change needed here.
export default function PrivacyPage() {
  if (LEGAL_CONTENT_APPROVED) {
    return <LegalDocument doc={privacyDraft} />;
  }

  return (
    <PageIntro
      eyebrow="Velvet Viking"
      heading="Privacy"
      sub="[Privacy policy to be confirmed.]"
      body="This page will hold Velvet Viking's privacy policy once finalised. No policy content is published here yet."
    />
  );
}
