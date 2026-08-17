import type { Metadata } from "next";
import LegalDocument from "@/components/sections/LegalDocument";
import PageIntro from "@/components/sections/PageIntro";
import { LEGAL_CONTENT_APPROVED, privacyDraft } from "@/content/legal";

export const metadata: Metadata = { title: "Privacy" };

// The drafted policy in @/content/legal is deliberately gated: it has been
// written from real product behaviour but not reviewed by a solicitor, and
// publishing unreviewed legal text is worse than publishing none. Flip
// LEGAL_CONTENT_APPROVED after review — no change is needed here.
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
