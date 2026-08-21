import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";
import CtaButton from "@/components/ui/CtaButton";
import { pages, betaAccess, appUrl } from "@/content/site";
import { plans, trial } from "@/content/commerce";

export const metadata: Metadata = {
  title: pages.start.heading,
  description: pages.start.sub,
  alternates: { canonical: "/start" },
};

const plan = plans.standard;
const currencySymbol = plan.price.currency === "GBP" ? "£" : "";

// HUMAN COPY PASS: step 2 was "Add a card — 14 days free, on us". The other
// three steps carry no terminal punctuation, so a full stop mid-item would
// have read oddly; a parenthetical is the natural British alternative here.
// WHAT ACTUALLY HAPPENS, IN THE APP. The website is the shop window and does
// not run any of this: account, programme build, preview and trial all belong
// to the Valhalla app, and duplicating any of them here would mean two places
// that could disagree about the same athlete. Steps 2 and 3 were missing
// before, which made the journey read as "pay, then find out" rather than
// "see your programme, then decide".
// THE ORDER MATTERS, AND IT IS THE ORDER THE PRODUCT ACTUALLY USES. The
// programme is built and shown BEFORE any payment method is asked for, which
// is worth stating plainly because it is the reverse of what most trials do.
// The choice of period and the card then come together, before the trial
// starts rather than after it ends, and the subscription begins on its own
// unless the athlete cancels. Every one of those is read from the trial flags
// in content/commerce.ts rather than asserted here.
const steps = [
  "Create your account",
  "Answer a few questions about your running, your race and the days you can train",
  "Valhalla builds your programme, and you see it before you pay anything",
  trial.periodChosenUpfront
    ? "Choose monthly or annual, and add your payment method"
    : "Add your payment method",
  `Your ${trial.days}-day free trial starts, with everything Valhalla does`,
  // BOTH PRICES, NOT JUST THE MONTHLY ONE. This page is static, so it cannot
  // know which period an athlete picked; quoting only £11.99/month here would
  // reproduce exactly the defect the earlier audit found on this same step,
  // where a reader who had chosen annual was shown the monthly figure. Naming
  // both is accurate whichever was chosen, and needs no per-visitor state.
  trial.autoConverts
    ? `At the end of the trial the subscription you chose starts automatically, ${currencySymbol}${plan.price.amount.toFixed(2)}/${plan.price.period} or ${currencySymbol}${plan.priceAnnual.amount.toFixed(2)}/${plan.priceAnnual.period}, unless you cancel before then`
    : // The non-converting branch is not "decide later whether to buy": under
      // any model where the subscription does NOT start by itself, what
      // actually happens is that access stops. Saying so keeps this fallback
      // honest instead of quietly describing a manual purchase that does not
      // exist. Unreachable today, since autoConverts is true.
      `Your access ends when the ${trial.days} days are up`,
];

// This page's whole job is honesty about status: it describes the trial
// journey exactly as designed, without ever letting a click resolve as a
// working signup. `trial.live` (content/commerce.ts) is the single flag
// this reads to decide that — flip it, and the status notice and CTAs
// below update themselves; no other change required.
export default function StartPage() {
  return (
    <>
      <PageIntro {...pages.start} />

      <section className="border-t border-vv-line-soft bg-vv-bg">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-12 px-6 pb-24 sm:px-8 sm:pb-32">
          {!trial.live ? (
            <div className="w-full rounded-vv border border-vv-line bg-vv-bg-2 px-6 py-5 text-center">
              <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-vv-bronze-text">
                Not open yet
              </p>
              <p className="mt-2 text-sm leading-relaxed text-vv-ink-dim">
                Paid subscriptions aren’t switched on yet. The steps below are how the trial works
                once they are.
              </p>
            </div>
          ) : null}

          <ol className="flex w-full flex-col gap-5">
            {steps.map((step, i) => (
              <li key={step} className="flex items-start gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-vv-line font-head text-xs font-semibold text-vv-bronze-text">
                  {i + 1}
                </span>
                <p className="pt-0.5 text-sm leading-relaxed text-vv-ink-dim">{step}</p>
              </li>
            ))}
          </ol>

          {/* THE HANDOFF, NOT A SECOND FRONT DOOR.
              These two used to be commerceSeams.createAccount and .signIn,
              both null, so both rendered permanently disabled — the dead CTAs
              at the end of the acquisition journey. The account does not
              belong to this website and never did: the app owns account, plan
              builder, preview and trial, and building any of them here would
              create a second identity surface that could disagree with the
              real one. So both now leave for the app's own front door, which
              is written down once as appUrl in content/site.ts. */}
          <div className="flex w-full flex-col items-center gap-4">
            <CtaButton href={appUrl} className="w-full">
              Start Free Trial
            </CtaButton>

            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-vv-ink-faint">Already training with Valhalla?</p>
              <CtaButton href={appUrl} variant="ghost" className="w-full">
                Sign In
              </CtaButton>
            </div>
          </div>

          <p className="max-w-sm text-center text-xs leading-relaxed text-vv-ink-faint">
            Your account is what holds your trial and your training. Installing the app on your
            phone is a separate step, and it comes after this.
          </p>

          {/* FIVE-PERSON PRIVATE BETA: a quiet, clearly-labelled side door for
              testers who already have an invitation — not a second version of
              the "Start Trial" flow above, and not presented as open signup.
              Deliberately last on the page and ghost-styled so the primary
              (disabled) commercial CTAs above keep the page's real visual
              weight — this is what a general visitor should encounter first,
              exactly as they will once the trial genuinely opens. */}
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
