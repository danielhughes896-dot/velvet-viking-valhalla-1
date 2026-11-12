import PeriodChoice from "@/components/sections/PeriodChoice";
import { plans, trial } from "@/content/commerce";

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
// behaviour: the account/billing seams are still the null URLs in
// commerceSeams, and there is no billing-period choice to submit anywhere, so
// none is offered.
//
// THIS CARD NOW STATES THAT ITSELF, and it did not used to. It delegated the
// not-open-yet state to /start on the grounds that the CTA led there — true
// when that comment was written, and no longer true: the entry-journey pass
// pointed this button at the app builder instead. So the delegation quietly
// stopped happening, and the page most likely to be read by somebody deciding
// whether to buy was the one page showing two prices and a purchase CTA with
// nothing saying they cannot yet act on either. A stale comment is how a page
// keeps a promise it stopped keeping.
export default function PricingCard() {
  const plan = plans.standard;
  // TWO BILLING PERIODS, ONE PLAN — and the list that rendered them moved
  // into PeriodChoice with the prices themselves. The rule it enforced is
  // unchanged and enforced there: both options go through the SAME markup,
  // never two hand-written blocks that could drift apart in size, weight or
  // spacing. Neither is flagged, badged, ordered by value or annotated with a
  // comparison — the only difference a visitor sees is the number and the
  // period.

  return (
    <div className="mx-auto w-full max-w-md rounded-vv-lg border border-vv-line bg-vv-bg-2 p-8 shadow-vv sm:p-10">
      <p className="font-head text-xs font-semibold uppercase tracking-[0.28em] text-vv-bronze-text">
        {plan.name}
      </p>
      <p className="mt-2 text-sm text-vv-ink">{plan.tagline}</p>

      {/* THE BIG STACKED PRICE PAIR IS GONE, AND THE CHOICE CARRIES THE
          FIGURES NOW.
          It was a mapped list of two display-type prices — deliberately one
          markup so neither could be styled as subordinate, which was the
          right instinct. What it could not survive was the period becoming a
          real selection below it: the card then printed £11.99 and £89.99
          large, and printed them again inside the two buttons a few hundred
          pixels down. The same two numbers twice, at two different sizes, is
          the ranking this card has always refused, arriving by another route.
          The app states each price exactly once, inside the control that
          selects it, and so does this now. The guarantee that both go through
          ONE markup moved with them — see the options.map in PeriodChoice —
          so they still cannot drift apart in size or weight. */}

      {/* THE TRIAL, STATED IN FULL RATHER THAN FLATTERINGLY.
          Was "Includes a 14-day free trial. Card required." — true as far as
          it went, and it left out the two things an athlete most needs to
          know: that the period is chosen up front, and that the subscription
          starts by itself unless they cancel. "Card required" alone invites
          the assumption that nothing happens automatically. Each clause is
          conditional on its own flag in content/commerce.ts, so if the
          commercial model ever changes the sentence changes with it. */}
      <p className="mt-3 text-sm leading-relaxed text-vv-ink">
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

          ENTRY-JOURNEY PASS: was "Start Free Trial" -> /trial, a page that
          asked which billing period the athlete wanted BEFORE they had seen
          a single session of their own programme. The parallel commercial
          work removed that page for the same reason and pointed this button
          at /start; under the approved value-first order it goes one step
          further and leads into the build itself, through the same buildUrl
          every other first-time CTA uses. The prices, the trial terms and
          the feature list on this card are untouched: a visitor who came
          here to check the cost still gets the answer, they are simply not
          asked to commit to a period to proceed. */}
      {/* ABOVE THE BUTTON, NOT BELOW IT. Somebody reading a price card reads
          downward and stops at the action; a caveat underneath is a caveat
          they meet after deciding. Same wording and same flag as the notice on
          /start, so the two pages cannot end up describing different states of
          the same product. */}
      {/* COMMERCIAL LAUNCH. The "Not open yet" notice that stood here for the
          whole of the private beta is gone, because the sentence it made is no
          longer true: subscriptions are switched on and this button leads to a
          real trial. It was never a hard-coded string — it read trial.live —
          so removing it is the flag doing its job, not a copy edit racing
          ahead of the product.

          TWO PERIOD BUTTONS NOW, AND THIS IS THE ONE PLACE THAT CHANGED SHAPE.
          The card previously refused to sprout a button per period on the
          grounds that it would read as two products. That reasoning held while
          nothing could be bought: the choice had nowhere to go, so offering it
          twice was noise. It does not hold now. The athlete has to pick a
          period before the trial starts, and picking it here means picking it
          ONCE — the alternative is a visitor deciding "annual" on this page and
          being asked the same question again at the commercial step, which
          reads as the site not listening.

          STILL ONE PRODUCT. Same plan, same feature list below, two ways to
          pay for it — no saving, no per-month equivalent, no "best value", and
          no comparison of any kind, exactly as the pricing block above states
          them. The period travels as a preselection the athlete can still
          change; the price that is charged is resolved by the app's server
          from the offer, never from this link. */}
      {/* AND THE SHAPE CHANGED AGAIN, THIS TIME TO THE APP'S.
          The two buttons above became one control. Founder: "The pay monthly/
          yearly or build my plan yearly ect need to follow the same selection
          rules as the app also."

          The reasoning in the block above — that the athlete should pick the
          period ONCE, here, rather than be asked again at the commercial step
          — is unchanged and is why a choice still lives on this card. What
          was wrong was the form it took. Two CTAs, one solid and one ghost,
          ranked two options this very file insists are "equal, parallel
          choices"; they also had no selected state and answered by
          navigating. The app asks with two equal pressed buttons, monthly
          already chosen, and a sentence that follows the press. See
          PeriodChoice. */}
      <div className="mt-8">
        <PeriodChoice />
      </div>

      <ul className="mt-10 flex flex-col gap-4 border-t border-vv-line-soft pt-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm leading-relaxed text-vv-ink">
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
