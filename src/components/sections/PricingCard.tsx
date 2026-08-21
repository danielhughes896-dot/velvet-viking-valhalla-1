import CtaButton from "@/components/ui/CtaButton";
import { plans, trial } from "@/content/commerce";

const CURRENCY_SYMBOL: Record<string, string> = { GBP: "£" };

// Single-plan card, deliberately — Basic and Pro exist in the tier
// architecture (content/commerce.ts) but render nowhere: launch is Standard
// only, and a comparison table for tiers nobody can buy yet would be the
// "giant wall of feature comparison" the Phase 3 brief explicitly rules
// out. If a second tier goes on sale later, this becomes a map over an
// array of one; not built ahead of that need.
//
// TWO PRICES IS NOT TWO TIERS. The card shows a monthly and an annual
// price for the one Standard plan. The feature list, the trial terms and
// the CTA below are shared by both and are not repeated or varied per
// price, because the plan itself does not vary — only how often it is
// billed. Nothing here ranks, recommends or compares the two options: no
// badge, no "best value", no savings figure, no per-month equivalent, no
// struck-through total. See the note beside `priceAnnual` in
// content/commerce.ts for why the arithmetic behind them is kept out of
// this component entirely.
//
// NOTHING HERE IS PURCHASABLE. Adding a second price does not add checkout
// behaviour: the CTA still links to /start, which renders its own
// not-open-yet state off `trial.live`, and the account/billing seams are
// still the null URLs in commerceSeams. There is no billing-period choice
// to submit anywhere, so none is offered.
export default function PricingCard() {
  const plan = plans.standard;
  // TWO BILLING PERIODS, ONE PLAN. Rendered from a list so both options go
  // through the SAME markup, not two hand-written blocks that could drift
  // apart in size, weight or spacing later. Neither is flagged, badged,
  // ordered by value or annotated with a comparison — the only difference
  // between the two rows a visitor sees is the number and the period.
  const priceOptions = [plan.price, plan.priceAnnual];

  return (
    <div className="mx-auto w-full max-w-md rounded-vv-lg border border-vv-line bg-vv-bg-2 p-8 shadow-vv sm:p-10">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.28em] text-vv-bronze-text">
        {plan.name}
      </p>
      <p className="mt-2 text-sm text-vv-ink-dim">{plan.tagline}</p>

      {/* Stacked rather than side by side: at this card's width two
          text-5xl prices on one line would have to shrink to fit, which
          would make the display type here smaller than it is everywhere
          else on the site and would set the two options against each other
          visually. Stacked, each row keeps the exact type scale, weight,
          colour and baseline alignment the single monthly price already
          had, so neither option is subordinate to the other. */}
      <div className="mt-6 flex flex-col gap-3">
        {priceOptions.map((price) => (
          <div key={price.period} className="flex items-baseline gap-1.5">
            <span className="font-display text-4xl font-semibold text-vv-ink sm:text-5xl">
              {CURRENCY_SYMBOL[price.currency] ?? ""}
              {price.amount.toFixed(2)}
            </span>
            <span className="font-head text-sm text-vv-ink-faint">/ {price.period}</span>
          </div>
        ))}
      </div>

      {/* THE TRIAL, STATED IN FULL RATHER THAN FLATTERINGLY.
          Was "Includes a 14-day free trial. Card required." — true as far as
          it went, and it left out the two things an athlete most needs to
          know: that the period is chosen up front, and that the subscription
          starts by itself unless they cancel. "Card required" alone invites
          the assumption that nothing happens automatically. Each clause is
          conditional on its own flag in content/commerce.ts, so if the
          commercial model ever changes the sentence changes with it. */}
      <p className="mt-3 text-sm leading-relaxed text-vv-ink-dim">
        {trial.days}-day free trial.
        {trial.periodChosenUpfront && trial.cardRequired
          ? " Choose monthly or annual and add a payment method to start it."
          : trial.cardRequired
            ? " A payment method is required to start it."
            : ""}
        {trial.autoConverts
          ? " Cancel before it ends and you won’t be charged. Otherwise your chosen subscription starts automatically."
          : ""}
      </p>

      {/* ONE CTA FOR ONE PRODUCT. The card shows two billing periods but
          deliberately does NOT sprout a button per period: that would turn
          this page into a two-option checkout and make the periods read as
          two products.

          It goes to /start, which is now the commercial entry itself. It
          used to go to /trial, a page whose whole job was asking monthly or
          annual -- a question the app asks again at the point the answer
          does something, so the middle page collected an answer nothing
          could act on. /start carries both prices and the trial terms and
          hands off to the real account surface. */}
      <CtaButton href="/start" className="mt-8 w-full">
        Start Free Trial
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
