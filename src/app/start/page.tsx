import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";
import TrialTerms from "@/components/sections/TrialTerms";
import CtaButton from "@/components/ui/CtaButton";
import { pages, betaAccess, appUrl, appSignInUrl } from "@/content/site";

export const metadata: Metadata = {
  title: pages.start.heading,
  description: pages.start.sub,
  alternates: { canonical: "/start" },
};

// THE COMMERCIAL ENTRY. One page between the price and the account, where
// there used to be two.
//
// WHAT THIS PAGE WAS. A numbered explanation of what account creation would
// eventually do, opening with "Trial signup isn't open yet. This is how it
// will work." Six steps describing a journey the athlete could not take, and
// two CTAs that both went to the same URL — one labelled "Start Free Trial"
// and one labelled "Sign In", so an athlete who already had an account was
// sent to the page that starts one. A page that describes a button instead of
// being one is a placeholder however carefully it is written.
//
// WHAT IT IS NOW. The terms, the two prices, and the door. The steps are gone
// because the athlete is about to walk them rather than read about them.
//
// THE ACCOUNT DOES NOT LIVE HERE, AND MUST NOT. The app owns identity: it
// holds the Supabase session, the magic-link redirect, the beta gate and the
// entitlement. Putting an email field on this marketing site would mean a
// second identity surface, a second place holding a publishable key, and a
// second redirect target for a single-use sign-in link — a parallel
// authentication system by any reading. So this page hands off, and the two
// destinations are genuinely different pages now: /start creates an account,
// /account signs an existing one in.
//
// NOTHING COMMERCIAL HAPPENS HERE. No payment provider, no checkout session,
// no card field, no subscription or entitlement record, no request of any
// kind. The page renders two prices read from content/commerce.ts and links
// to the app. That is the entire behaviour.
export default function StartPage() {
  return (
    <>
      <PageIntro {...pages.start} />

      <section className="border-t border-vv-line-soft bg-vv-bg">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-10 px-6 pb-24 sm:px-8 sm:pb-32">
          <TrialTerms />

          {/* THE HANDOFF. "Continue to create account" rather than "Continue
              to account", because the two are different promises and only one
              of them is what the button does: it is where an account is made,
              not where an existing one is managed. Full-width and stacked on
              every breakpoint — these are the two most important taps on the
              site and a thumb should not have to find a narrow one. */}
          <div className="flex w-full flex-col items-center gap-6">
            <CtaButton href={appUrl} className="w-full">
              Continue to Create Account
            </CtaButton>

            <div className="flex w-full flex-col items-center gap-2">
              <p className="text-xs text-vv-ink-faint">Already have an account?</p>
              <CtaButton href={appSignInUrl} variant="ghost" className="w-full">
                Sign In
              </CtaButton>
            </div>
          </div>

          <p className="max-w-sm text-center text-xs leading-relaxed text-vv-ink-faint">
            Signing in is by emailed link — there is no password to create or remember. Installing
            the app on your phone is a separate step, and it comes after this.
          </p>

          {/* FIVE-PERSON PRIVATE BETA: unchanged, and deliberately so. It is
              the door existing testers already use, on the same URL, with the
              same label and the same destination. Last on the page and
              ghost-styled, so the commercial entry above keeps the page's
              visual weight — which is what a general visitor should meet
              first, exactly as they will once the trial genuinely opens. */}
          <div className="flex w-full flex-col items-center gap-3 border-t border-vv-line-soft pt-10 text-center">
            <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-vv-bronze-text">
              {betaAccess.eyebrow}
            </p>
            <p className="text-xs text-vv-ink-faint">{betaAccess.body}</p>
            <CtaButton href={betaAccess.cta.href} variant="ghost">
              {betaAccess.cta.label}
            </CtaButton>
          </div>
        </div>
      </section>
    </>
  );
}
