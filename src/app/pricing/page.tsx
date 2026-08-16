import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";
import PricingCard from "@/components/sections/PricingCard";
import { pages } from "@/content/site";

export const metadata: Metadata = {
  title: pages.pricing.heading,
  description: pages.pricing.sub,
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <PageIntro {...pages.pricing} />
      <section className="border-t border-vv-line-soft bg-vv-bg">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:px-8 sm:py-24">
          <PricingCard />
        </div>
      </section>
    </>
  );
}
