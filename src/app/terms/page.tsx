import type { Metadata } from "next";
import LegalDocument from "@/components/sections/LegalDocument";
import PageIntro from "@/components/sections/PageIntro";
import { LEGAL_APPROVALS, termsDraft } from "@/content/legal";

// OVERNIGHT AUDIT: see privacy/page.tsx for the same fix and rationale.
export const metadata: Metadata = {
  title: "Terms",
  description: "This page will hold Velvet Viking's terms of use once finalised.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
};

// STILL GATED, and NOT covered by the private-beta publication approval. HQ
// approved two documents -- the Privacy Policy and the Private Beta Terms -- and
// this commercial terms of service is neither of them, so LEGAL_APPROVALS.terms stays false and the
// placeholder below remains the live state.
//
// Do not flip this alongside a beta approval. Publishing it would represent as
// approved a document nobody has approved, which is a worse outcome than the page
// saying plainly that it is not ready.
export default function TermsPage() {
  if (LEGAL_APPROVALS.terms) {
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
