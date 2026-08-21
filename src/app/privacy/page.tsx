import type { Metadata } from "next";
import LegalDocument from "@/components/sections/LegalDocument";
import PageIntro from "@/components/sections/PageIntro";
import LegalReview, { otherLegalDocs } from "@/components/sections/LegalReview";
import { LEGAL_APPROVALS, privacyDraft, privacyCommercialDraft } from "@/content/legal";

// PUBLISHED. HQ gave publication approval for the two private-beta documents and
// this is one of them, so LEGAL_APPROVALS.privacy is true and the real policy
// renders. This page is the CANONICAL Privacy Policy: the website footer, the app
// Settings screen and the beta onboarding note all resolve here rather than
// carrying a copy of their own.
//
// The noindex that used to sit here is deliberately gone. It was correct for an
// empty placeholder and is wrong now — this is the real policy and it should be
// findable. The previous note here said to drop it the moment real policy content
// ships, which is exactly what has happened. /beta-terms keeps its noindex,
// because that document is for five invited testers rather than for the public.
// REVIEW MODE NEEDS ITS OWN ROBOTS DIRECTIVE HERE, unlike /terms and /cookies.
// Those routes are noindex in every state because the document is unpublished.
// This one is published and SHOULD be indexed — so the noindex has to attach to
// the review variant only, which means metadata has to be computed from the
// query string rather than declared as a constant. Without this, the review URL
// would inherit an indexable route and could put an unapproved commercial draft
// into search results.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const review = (await searchParams).review === "1";
  return {
    title: "Privacy",
    description:
      "What Valhalla stores about your training, why, how long it is kept, and the rights you have over it.",
    alternates: { canonical: "/privacy" },
    ...(review ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function PrivacyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // REVIEW SHOWS THE COMMERCIAL DRAFT, NOT THE LIVE POLICY. The live policy is
  // approved and accurate for today; what HQ needs to read before launch is the
  // one that replaces it once payments and integrations exist.
  if ((await searchParams).review === "1" && !LEGAL_APPROVALS.privacyCommercial) {
    return <LegalReview doc={privacyCommercialDraft} otherDocs={otherLegalDocs("/privacy")} />;
  }

  if (LEGAL_APPROVALS.privacyCommercial) {
    return <LegalDocument doc={privacyCommercialDraft} />;
  }

  if (LEGAL_APPROVALS.privacy) {
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
