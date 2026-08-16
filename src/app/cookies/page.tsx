import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";

// OVERNIGHT AUDIT: see privacy/page.tsx for the same fix and rationale.
export const metadata: Metadata = {
  title: "Cookies",
  description: "This page will hold Velvet Viking's cookie policy once finalised.",
  alternates: { canonical: "/cookies" },
  robots: { index: false, follow: true },
};

export default function CookiesPage() {
  return (
    <PageIntro
      eyebrow="Velvet Viking"
      heading="Cookies"
      sub="[Cookie policy to be confirmed.]"
      body="This page will hold Velvet Viking's cookie policy once finalised. No policy content is published here yet."
    />
  );
}
