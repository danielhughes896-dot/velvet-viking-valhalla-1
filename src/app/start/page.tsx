import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";
import TrialTerms from "@/components/sections/TrialTerms";
import CtaButton from "@/components/ui/CtaButton";
import { pages, roadMap, betaAccess, appSignInUrl, buildCta, signInCta } from "@/content/site";
import { buildUrl } from "@/content/journey";

export const metadata: Metadata = {
  title: pages.start.heading,
  description: pages.start.sub,
  alternates: { canonical: "/start" },
};

// THE HANDOFF, AND NOTHING IS BUILT HERE.
//
// Founder: "Build my plan should not build it on the website. It should take
// them to the app. Then they download the app and register and build from
// there. Make sure that hole road map works."
//
// WHAT WAS HERE AN HOUR AGO. The app's builder, stage 01 — the eleven-segment
// rail, "BUILD YOUR TRAINING BLOCK", Continue. It was a faithful copy and it
// was the wrong idea: a visitor met a progress rail on a marketing site and
// had every reason to think the plan was being built where they stood. The
// website does not build plans. It is removed, with the vendored
// builder-spec, its parity test and the monospace face the stage counter
// needed — the whole apparatus, rather than the visible part of it.
//
// WHAT IS HERE NOW. The road map, named in three steps, and one button into
// the app's install page. See content/journey.ts for the full chain and which
// system owns each link; see content/site.ts `roadMap` for the copy.
//
// THE STEPS ARE NOT NUMBERED, DELIBERATELY. They are ordered and they read
// top to bottom, which is enough; numerals would make three stages look like
// a form to work through. This route once carried six numbered steps
// describing account creation and they were removed for exactly that reason.
//
// THE TRIAL TERMS COME BACK WITH IT. They moved to /pricing when this page
// became a builder, because a screen that shows no price should not discuss
// what happens to a card. This page is a commercial entry again — it is the
// last thing a visitor reads before leaving for an install — so what the
// trial turns into belongs on it. /pricing keeps its own copy; both read the
// same flags in content/commerce.ts, so they cannot describe two products.
export default function StartPage() {
  return (
    <>
      <PageIntro {...pages.start} />

      <section className="border-t border-vv-line-soft bg-vv-bg">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-12 px-6 pb-24 sm:px-8 sm:pb-32">
          {/* THE ROAD MAP. Each step is a title and a sentence, and the rule
              between them is the only ornament — this is a list of stages,
              not three cards competing for a tap. The one tappable thing on
              the page is below them. */}
          <div className="w-full pt-14">
            <p className="font-head text-xs font-semibold tracking-[0.28em] text-vv-gold-text uppercase">
              {roadMap.eyebrow}
            </p>
            <div className="mt-6">
              {roadMap.steps.map((step, i) => (
                <div
                  key={step.title}
                  className="py-5"
                  style={
                    i === roadMap.steps.length - 1
                      ? undefined
                      : { borderBottom: "1px solid var(--vv-line-soft)" }
                  }
                >
                  <p className="font-head text-base font-semibold text-vv-ink">{step.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-vv-ink">{step.body}</p>
                </div>
              ))}
            </div>
          </div>

          <TrialTerms />

          {/* THE DOOR. buildUrl is the app's install page — step one of the
              three above, and the only step this site performs any part of.
              Full width and stacked at every breakpoint: these are the two
              most important taps on the site and a thumb should not have to
              find a narrow one.

              TWO GENUINELY DIFFERENT DESTINATIONS. The first-time athlete
              goes to /get to install; the returning one goes to /account,
              which is their own sign-in, not an install they already did. */}
          <div className="flex w-full flex-col items-center gap-6">
            <CtaButton href={buildUrl} variant="cherry" className="w-full">
              {buildCta.label}
            </CtaButton>

            <div className="flex w-full flex-col items-center gap-2">
              <p className="text-xs text-vv-ink">Already have an account?</p>
              <CtaButton href={appSignInUrl} variant="ghost" className="w-full">
                {signInCta.label}
              </CtaButton>
            </div>
          </div>

          {/* THE NO-PASSWORD PROMISE. Sign-in is an emailed link and there is
              no password anywhere in the product, so somebody looking for one
              is looking for something that does not exist. */}
          <p className="max-w-sm text-center text-xs leading-relaxed text-vv-ink">
            Signing in is by emailed link — there is no password to create or remember. Installing
            the app is the first step above, and your account is created the first time you sign in.
          </p>

          {/* FIVE-PERSON PRIVATE BETA: a separate lane, on its own URL, with
              its own label. Last on the page and ghost-styled so the
              commercial entry above keeps the page's visual weight. */}
          <div className="flex w-full flex-col items-center gap-3 border-t border-vv-line-soft pt-10 text-center">
            <p className="font-head text-xs font-semibold tracking-[0.2em] text-vv-bronze-text uppercase">
              {betaAccess.eyebrow}
            </p>
            <p className="text-xs text-vv-ink">{betaAccess.body}</p>
            <CtaButton href={betaAccess.cta.href} variant="ghost">
              {betaAccess.cta.label}
            </CtaButton>
          </div>
        </div>
      </section>
    </>
  );
}
