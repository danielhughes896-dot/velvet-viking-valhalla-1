import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";
import PricingCard from "@/components/sections/PricingCard";
import CheckoutNotice from "@/components/sections/CheckoutNotice";
import TrialTerms from "@/components/sections/TrialTerms";
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
          {/* Renders only when Stripe has returned a cancelled checkout to
              this page — see CheckoutNotice for why that address is ours. */}
          <CheckoutNotice />
          <PricingCard />

          {/* THE TRIAL TERMS MOVED HERE FROM /start, AND THIS IS WHERE THEY
              SHOULD ALWAYS HAVE BEEN.
              /start is the app's builder entry now — stage 01, which asks
              nothing and sells nothing — so terms about what happens to a
              card after fourteen days had no surface left to sit on there.
              Deleting them was not an option: TrialTerms is the one place
              that states the period is chosen when the trial STARTS rather
              than settled afterwards, and trialModel guards that sentence.
              Below the card rather than above it, because the terms are the
              small print of the prices directly above them, and a reader
              meets the figure before the conditions attached to it. */}
          <div className="mt-12 flex justify-center">
            <TrialTerms />
          </div>
        </div>
      </section>
    </>
  );
}
