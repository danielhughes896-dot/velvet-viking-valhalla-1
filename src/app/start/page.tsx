import type { Metadata } from "next";
import BuilderEntry from "@/components/sections/BuilderEntry";
import CtaButton from "@/components/ui/CtaButton";
import { overviewStage } from "@/content/builderEntry";
import { betaAccess } from "@/content/site";

export const metadata: Metadata = {
  title: overviewStage.heading,
  description: overviewStage.lede,
  alternates: { canonical: "/start" },
};

// THIS ROUTE IS THE BUILDER'S FRONT DOOR NOW, NOT A PAGE ABOUT ONE.
//
// Founder: "The build a plan needs to be the same as the app! Exactly same
// entry point build. Copy the apps into this route."
//
// WHAT WAS HERE. A marketing page — PageIntro's serif headline, the trial
// terms, two read-only price cards, a Build My Plan button, a sign-in link
// and the private-beta footer. Everything about building a plan was a
// description of building a plan. Put beside the app's /start, which opens
// straight into the eleven-stage builder, the two pages did not look like the
// same product, and that is what the founder was looking at.
//
// WHAT IS HERE. The app's stage 01, rendered from the app's own specification
// file. The heading and lede on this page are the spec's — which is also why
// the metadata above reads from it rather than from content/site.ts, so the
// browser tab, the search result and the screen cannot say three things.
//
// THE PRICES AND THE TRIAL TERMS LEFT WITH THE REST, and that is not a
// deletion. /pricing states both periods in full, and the period choice now
// follows the app's own selection rules there (see PeriodChoice). The app
// states the trial terms again at the commercial step, where the card is
// actually taken. This screen asks nothing and sells nothing — matching the
// app, whose stage 01 is pure orientation — so a price on it would be the
// one thing on the page that is not the app's.
//
// THE PRIVATE-BETA DOOR STAYS, AND I NEARLY REMOVED IT.
//
// The first pass deleted it on the reasoning that the app's stage 01 has no
// such door, so a faithful copy should not either. Three separate tests
// failed at once — commercialEntry, entryJourney and productionReadiness all
// guard it — which was the suite doing exactly what it was built for. The
// reasoning was wrong on a fact: the beta lane does NOT point where Continue
// points. It goes to velvet-viking-valhalla-1.vercel.app/get, a different
// origin from app.velvetviking.co.uk, under its own label ("Continue to
// Sacoro"), and entryJourney asserts it must never be folded into the public
// journey. Deleting it would have shut the only door five private testers
// have, which is not something the founder asked for and not something a
// visual change should decide.
//
// SO IT SITS UNDER THE BUILDER, ghost-styled and last, exactly where it sat
// before: the commercial entry keeps the page's weight, and the lane that
// matters to five people stays open without competing with the one that
// matters to everybody else.
export default function StartPage() {
  return (
    <>
      <BuilderEntry />

      <section className="bg-vv-bg">
        <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-3 border-t border-vv-line-soft px-5 pt-10 pb-24 text-center sm:pb-32">
          {/* THE NO-PASSWORD PROMISE, KEPT — AND NOT ON THE BUILDER SCREEN.
              commercialEntry guards this sentence because sign-in is an
              emailed link and there is no password anywhere in the product,
              so a visitor who goes looking for one is looking for something
              that does not exist. The first pass dropped it with the rest of
              the old page, which was a real loss rather than a tidy-up.
              It does not go back above, because the app's stage 01 does not
              carry it and that screen is meant to be the app's exactly. Here,
              in the website's own chrome under the builder, it is a sentence
              the site is free to say. */}
          <p className="mb-6 max-w-sm text-xs leading-relaxed text-vv-ink">
            Signing in is by emailed link — there is no password to create or remember.
            Installing the app on your phone is a separate step, and it comes after this.
          </p>

          <p className="font-head text-xs font-semibold tracking-[0.2em] text-vv-bronze-text uppercase">
            {betaAccess.eyebrow}
          </p>
          <p className="text-xs text-vv-ink">{betaAccess.body}</p>
          <CtaButton href={betaAccess.cta.href} variant="ghost">
            {betaAccess.cta.label}
          </CtaButton>
        </div>
      </section>
    </>
  );
}
