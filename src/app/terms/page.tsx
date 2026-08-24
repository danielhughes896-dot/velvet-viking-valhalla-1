import type { Metadata } from "next";
import LegalDocument from "@/components/sections/LegalDocument";
import PageIntro from "@/components/sections/PageIntro";
import LegalReview, { otherLegalDocs } from "@/components/sections/LegalReview";
import { LEGAL_APPROVALS, termsDraft } from "@/content/legal";

// PUBLISHED 24 August 2026, so the metadata describes a document rather than a
// promise of one. Both fields here were written for the placeholder and both
// were wrong the moment the gate flipped: the description said the page "will
// hold" the terms once finalised, and the noindex hid a live consumer contract
// from the people most likely to search for it.
//
// The noindex is computed rather than constant for the same reason it is on
// /privacy: review mode must stay out of the index even though the route itself
// now belongs in it. A constant could only be right for one of the two.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const review = (await searchParams).review === "1";
  return {
    title: "Terms",
    description:
      "The agreement between you and Velvet Viking when you use Valhalla: subscriptions, the trial, cancellation, refunds and your rights as a consumer.",
    alternates: { canonical: "/terms" },
    // Unpublished OR under review: keep it out of the index. Published and not
    // under review: it is a live contract and should be findable.
    ...(review || !LEGAL_APPROVALS.terms ? { robots: { index: false, follow: true } } : {}),
  };
}

// PUBLISHED. The founder gave full-document approval on 24 August 2026 after
// solicitor review of the complete document, and the liability cap this gate
// had been waiting on is decided and written into section 12. So
// LEGAL_APPROVALS.terms is true and the real contract renders.
//
// The placeholder branch below is kept rather than deleted. It is what this
// route serves if the gate is ever closed again, and a page that says plainly
// it is not ready is the only safe thing to show in that state.
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
