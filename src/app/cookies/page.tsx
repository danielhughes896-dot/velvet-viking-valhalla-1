import type { Metadata } from "next";
import LegalDocument from "@/components/sections/LegalDocument";
import PageIntro from "@/components/sections/PageIntro";
import { LEGAL_CONTENT_APPROVED, cookiesDraft } from "@/content/legal";

export const metadata: Metadata = { title: "Cookies" };

// See the note in privacy/page.tsx — the drafted policy is gated behind
// LEGAL_CONTENT_APPROVED until a solicitor has reviewed it.
export default function CookiesPage() {
  if (LEGAL_CONTENT_APPROVED) {
    return <LegalDocument doc={cookiesDraft} />;
  }

  return (
    <PageIntro
      eyebrow="Velvet Viking"
      heading="Cookies"
      sub="[Cookie policy to be confirmed.]"
      body="This page will hold Velvet Viking's cookie policy once finalised. No policy content is published here yet."
    />
  );
}
