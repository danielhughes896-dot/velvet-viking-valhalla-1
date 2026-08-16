import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";

// OVERNIGHT AUDIT: was { title: "Privacy" } only — missing description (the
// only page on the site without one) and indexable by default despite
// holding no real content yet. noindex is standard, reversible practice for
// a placeholder legal page; drop it the moment real policy content ships.
export const metadata: Metadata = {
  title: "Privacy",
  description: "This page will hold Velvet Viking's privacy policy once finalised.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <PageIntro
      eyebrow="Velvet Viking"
      heading="Privacy"
      sub="[Privacy policy to be confirmed.]"
      body="This page will hold Velvet Viking's privacy policy once finalised. No policy content is published here yet."
    />
  );
}
