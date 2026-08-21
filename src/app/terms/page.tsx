import type { Metadata } from "next";
import LegalDocument from "@/components/sections/LegalDocument";
import PageIntro from "@/components/sections/PageIntro";
import LegalReview, { otherLegalDocs } from "@/components/sections/LegalReview";
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
export default async function TermsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  if (LEGAL_APPROVALS.terms) {
    return <LegalDocument doc={termsDraft} />;
  }

  // REVIEW MODE. Unlinked, noindex (see metadata above), and it does not change
  // the approval gate: the public page below is still what an ordinary visitor
  // gets. See LegalReview.tsx for why this mechanism and not another.
  if ((await searchParams).review === "1") {
    return <LegalReview doc={termsDraft} otherDocs={otherLegalDocs("/terms")} />;
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
