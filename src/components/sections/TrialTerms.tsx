import { plans, trial } from "@/content/commerce";

const CURRENCY_SYMBOL: Record<string, string> = { GBP: "£" };

// WHAT THE TRIAL TURNS INTO — STATED, NOT CHOSEN.
//
// This was BillingPeriodChoice, and it asked the athlete to pick monthly or
// annual on the website. The app asks the same question again at the point the
// answer actually does something: it is what /api/checkout is given, and it is
// what the subscription is created on. Two surfaces asking one question is not
// a funnel, it is a queue — and the first one was collecting an answer nothing
// could act on, carried forward as a query parameter no page ever read.
//
// So the choice moved to where it has consequences, and what stayed here is
// the part a visitor needs BEFORE they create an account: both prices, and
// what happens when the fourteen days are up. It is now presentational — no
// state, no radios, no client component, no query parameter.
//
// DELIBERATELY UNCOMPARED, exactly as before. No savings figure, no effective
// monthly rate, no recommendation, no ordering that implies one is better.
// Both tiles are the same element with the same classes on a shared
// `basis-0 grow` track, built by mapping one list rather than written twice,
// so the only difference a visitor can see is the word and the number.
const OPTIONS = [
  { id: "monthly", label: "Monthly", price: plans.standard.price },
  { id: "yearly", label: "Annual", price: plans.standard.priceAnnual },
] as const;

export default function TrialTerms() {
  return (
    <div className="mx-auto w-full max-w-xl rounded-vv-lg border border-vv-line bg-vv-bg-2 p-8 shadow-vv sm:p-10">
      {/* STATUS, AND IT IS NOT A PLACEHOLDER. It reads trial.live
          (content/commerce.ts), the same single flag the rest of the site
          reads, so when billing switches on this disappears by flipping one
          value rather than by somebody remembering to delete a paragraph.

          IT SPEAKS ONLY ABOUT THE COMMERCIAL STATE. It used to add "and
          accounts are open to invited testers only" — true, and nobody’s
          business. A marketing page announcing the shape of a private beta is
          advertising internal plumbing to people who have no use for it, and it
          reads as a closed door before a visitor has reached one.

          THE ACCESS RULE IS UNCHANGED, and saying less about it here weakens
          nothing: it is enforced by a trigger on auth.users, not by this
          paragraph, and the app tells an uninvited address plainly at the point
          they actually try. */}
      {!trial.live ? (
        <div className="mb-8 rounded-vv border border-vv-line bg-vv-bg px-5 py-4 text-center">
          <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-vv-bronze-text">
            Not open yet
          </p>
          <p className="mt-2 text-sm leading-relaxed text-vv-ink-dim">
            Paid subscriptions aren’t switched on yet. Nothing below charges you or starts
            a trial.
          </p>
        </div>
      ) : null}

      <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-vv-bronze-text">
        After your trial
      </p>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row">
        {OPTIONS.map((option) => (
          <div
            key={option.id}
            className="flex grow basis-0 flex-col gap-2 rounded-vv border border-vv-line bg-vv-bg p-5"
          >
            <span className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-vv-ink-faint">
              {option.label}
            </span>
            <span className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="font-display text-3xl font-semibold text-vv-ink">
                {CURRENCY_SYMBOL[option.price.currency] ?? ""}
                {option.price.amount.toFixed(2)}
              </span>
              <span className="font-head text-sm text-vv-ink-faint">/ {option.price.period}</span>
            </span>
          </div>
        ))}
      </div>

      {/* The sentence that stops the two tiles reading as two products. */}
      <p className="mt-6 text-sm leading-relaxed text-vv-ink-dim">
        Both are Standard, in full. The only difference is how often you’re billed.
      </p>

      {/* THE WHOLE DEAL, INCLUDING THE PART THAT COSTS MONEY. Commercial facts
          only: what happens and when. No promise about refunds or notice
          periods, because that wording is not approved and is not this
          component's to invent. Every clause follows a flag rather than being
          asserted, so the copy cannot outrun the model. */}
      <p className="mt-4 text-xs leading-relaxed text-vv-ink-faint">
        Your {trial.days}-day trial is free.
        {trial.periodChosenUpfront ? " You choose monthly or annual when you start it." : ""}
        {trial.cardRequired ? " You add a payment method then, and nothing is taken during the trial." : ""}
        {trial.autoConverts
          ? " Cancel before the trial ends and you won’t be charged. Otherwise the option you picked starts automatically."
          : ""}
      </p>
    </div>
  );
}
