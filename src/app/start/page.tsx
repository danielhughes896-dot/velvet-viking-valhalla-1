import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";
import CtaButton from "@/components/ui/CtaButton";
import { pages, betaAccess } from "@/content/site";
import { plans, trial, commerceSeams } from "@/content/commerce";

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
const steps = [
  "Create your account",
  `Add a card (${trial.days} days free, on us)`,
  `Train on ${plan.name} for the full ${trial.days} days, no charge`,
  trial.autoConverts
    ? `Continues at ${currencySymbol}${plan.price.amount.toFixed(2)}/${plan.price.period} afterwards, unless you cancel first`
    : `Choose whether to continue on ${plan.name} afterwards`,
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
                Trial signup isn’t live. Account creation and billing switch on together, once
                that’s ready.
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

          <div className="flex w-full flex-col items-center gap-4">
            <CtaButton href={commerceSeams.createAccount} className="w-full">
              Create Account
            </CtaButton>

            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-vv-ink-faint">Already training with Valhalla?</p>
              <CtaButton href={commerceSeams.signIn} variant="ghost" className="w-full">
                Sign In
              </CtaButton>
            </div>
          </div>

          {/* HUMAN COPY PASS: the dash was bolting two independent clauses
              into one 33-word sentence. Split in two, which is what the
              dash was standing in for. "from having one" dropped as
              redundant once the clauses are separate sentences. */}
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
