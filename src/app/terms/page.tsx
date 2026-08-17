import type { Metadata } from "next";
import LegalDocument from "@/components/sections/LegalDocument";
import PageIntro from "@/components/sections/PageIntro";
import { LEGAL_CONTENT_APPROVED, termsDraft } from "@/content/legal";

export const metadata: Metadata = { title: "Terms" };

// See the note in privacy/page.tsx — the drafted terms are gated behind
// LEGAL_CONTENT_APPROVED until a solicitor has reviewed them.
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
