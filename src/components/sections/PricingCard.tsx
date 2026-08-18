import CtaButton from "@/components/ui/CtaButton";
import { plans, trial } from "@/content/commerce";

const CURRENCY_SYMBOL: Record<string, string> = { GBP: "£" };

// Single-plan card, deliberately — Basic and Pro exist in the tier
// architecture (content/commerce.ts) but render nowhere: launch is Standard
// only, and a comparison table for tiers nobody can buy yet would be the
// "giant wall of feature comparison" the Phase 3 brief explicitly rules
// out. If a second tier goes on sale later, this becomes a map over an
// array of one; not built ahead of that need.
export default function PricingCard() {
  const plan = plans.standard;
  const symbol = CURRENCY_SYMBOL[plan.price.currency] ?? "";

  return (
    <div className="mx-auto w-full max-w-md rounded-vv-lg border border-vv-line bg-vv-bg-2 p-8 shadow-vv sm:p-10">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.28em] text-vv-bronze-text">
        {plan.name}
      </p>
      <p className="mt-2 text-sm text-vv-ink-dim">{plan.tagline}</p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="font-display text-4xl font-semibold text-vv-ink sm:text-5xl">
          {symbol}
          {plan.price.amount.toFixed(2)}
        </span>
        <span className="font-head text-sm text-vv-ink-faint">/ {plan.price.period}</span>
      </div>

      {/* HUMAN COPY PASS: was "Includes a 14-day free trial — card
          required." The dash was appending a two-word qualifier where a
          full stop reads more naturally in British English. Same two
          facts, same conditional on trial.cardRequired. */}
      <p className="mt-3 text-sm text-vv-ink-dim">
        Includes a {trial.days}-day free trial.{trial.cardRequired ? " Card required." : ""}
      </p>

      <CtaButton href="/start" className="mt-8 w-full">
        Start Trial
      </CtaButton>

      <ul className="mt-10 flex flex-col gap-4 border-t border-vv-line-soft pt-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm leading-relaxed text-vv-ink-dim">
            <span aria-hidden className="mt-[3px] shrink-0 text-vv-bronze-text">
              —
            </span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
