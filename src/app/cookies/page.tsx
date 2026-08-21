import type { Metadata } from "next";
import LegalDocument from "@/components/sections/LegalDocument";
import PageIntro from "@/components/sections/PageIntro";
import LegalReview, { otherLegalDocs } from "@/components/sections/LegalReview";
import { LEGAL_APPROVALS, cookiesDraft } from "@/content/legal";

// OVERNIGHT AUDIT: see privacy/page.tsx for the same fix and rationale.
export const metadata: Metadata = {
  title: "Cookies",
  description: "This page will hold Velvet Viking's cookie policy once finalised.",
  alternates: { canonical: "/cookies" },
  robots: { index: false, follow: true },
};

// STILL GATED, and NOT covered by the private-beta publication approval. HQ
// approved two documents -- the Privacy Policy and the Private Beta Terms -- and
// this cookie policy is neither of them, so LEGAL_APPROVALS.cookies stays false and the
// placeholder below remains the live state.
//
// Do not flip this alongside a beta approval. Publishing it would represent as
// approved a document nobody has approved, which is a worse outcome than the page
// saying plainly that it is not ready.
export default async function CookiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  if (LEGAL_APPROVALS.cookies) {
    return <LegalDocument doc={cookiesDraft} />;
  }

  if ((await searchParams).review === "1") {
    return <LegalReview doc={cookiesDraft} otherDocs={otherLegalDocs("/cookies")} />;
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
