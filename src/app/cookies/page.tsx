import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";

export const metadata: Metadata = { title: "Cookies" };

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
