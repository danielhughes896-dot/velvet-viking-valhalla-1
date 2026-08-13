import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";

export const metadata: Metadata = { title: "Privacy" };

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
