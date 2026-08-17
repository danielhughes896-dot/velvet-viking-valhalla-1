import type { Metadata } from "next";
import LegalDocument from "@/components/sections/LegalDocument";
import PageIntro from "@/components/sections/PageIntro";
import { LEGAL_APPROVALS, privacyDraft } from "@/content/legal";

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
export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Valhalla stores about your training, why, how long it is kept, and the rights you have over it.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
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
