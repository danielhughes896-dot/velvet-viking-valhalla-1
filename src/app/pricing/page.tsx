import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";
import PricingCard from "@/components/sections/PricingCard";
import { pages } from "@/content/site";

export const metadata: Metadata = {
  title: pages.pricing.heading,
  description: pages.pricing.sub,
  alternates: { canonical: "/pricing" },
};

// THE ONE CHECKOUT RETURN SURFACE THIS WEBSITE OWNS.
//
// Verified against api/_stripe.js on the Valhalla app's stripe-foundation
// branch, which builds exactly two redirect URLs from two DIFFERENT origins:
//
//   success_url: appOrigin       + '/account?checkout=complete&session_id=...'
//   cancel_url:  marketingOrigin + '/pricing?checkout=cancelled'
//
// The marketing site and the backend are separate Vercel projects on separate
// hosts and Vercel does not route between them, so only the cancel path comes
// back here. Success lands on the app's own /account, which that repository
// serves from its own vercel.json. This website neither needs nor should have
// an /account route, and a "payment complete" screen here would be a screen
// asserting something this origin cannot possibly know.
//
// WHAT THIS NOTICE MAY SAY. Only what the redirect itself proves: the reader
// came back from Checkout without finishing. It deliberately makes NO claim
// about charges, subscriptions or entitlement — not even a reassuring one —
// because a redirect is not the authority on any of those, and the moment
// this page starts describing payment state is the moment it can be made to
// describe it wrongly by anyone who types the parameter in.
function CheckoutCancelledNotice() {
  return (
    <div
      role="status"
      className="mx-auto mb-10 w-full max-w-md rounded-vv border border-vv-line bg-vv-bg-2 px-6 py-5 text-center"
    >
      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-vv-bronze-text">
        Checkout cancelled
      </p>
      <p className="mt-2 text-sm leading-relaxed text-vv-ink-dim">
        You came back before finishing. Choose again whenever you’re ready.
      </p>
    </div>
  );
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Exact match on the one value Stripe is configured to send. Anything else,
  // including ?checkout=complete typed in by hand, shows the ordinary page —
  // this origin must never render a success state.
  const cancelled = (await searchParams).checkout === "cancelled";

  return (
    <>
      <PageIntro {...pages.pricing} />
      <section className="border-t border-vv-line-soft bg-vv-bg">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:px-8 sm:py-24">
          {cancelled ? <CheckoutCancelledNotice /> : null}
          <PricingCard />
        </div>
      </section>
    </>
  );
}
