import type { Metadata } from "next";
import LegalDocument from "@/components/sections/LegalDocument";
import PageIntro from "@/components/sections/PageIntro";
import { LEGAL_CONTENT_APPROVED, cookiesDraft } from "@/content/legal";

// OVERNIGHT AUDIT: see privacy/page.tsx for the same fix and rationale.
export const metadata: Metadata = {
  title: "Cookies",
  description: "This page will hold Velvet Viking's cookie policy once finalised.",
  alternates: { canonical: "/cookies" },
  robots: { index: false, follow: true },
};

// PUBLICATION GATE. The drafted policy in @/content/legal was written from the
// product's real observed behaviour, but it has not been reviewed by a
// solicitor and the company's statutory facts are still outstanding. Publishing
// unreviewed legal text is worse than publishing none, so the placeholder below
// remains the live state until LEGAL_CONTENT_APPROVED is flipped. Flipping it is
// the only change needed here.
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
