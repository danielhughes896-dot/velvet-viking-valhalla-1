"use client";

import { useState } from "react";
import CtaButton from "@/components/ui/CtaButton";
import { trial } from "@/content/commerce";
import {
  DEFAULT_BILLING_PERIOD,
  priceForPeriod,
  type BillingPeriodId,
} from "@/content/billingPeriod";

const CURRENCY_SYMBOL: Record<string, string> = { GBP: "£" };

// THE ONE CHOICE ON THIS PAGE. Both entries resolve to the same plan object —
// Standard — because that is the literal truth of what is being chosen: not
// two products, not two tiers, not two feature sets, just how often the same
// subscription is billed. Reading the prices through priceForPeriod rather
// than writing two hand-written blocks is what guarantees they can never drift
// from the ones on /pricing.
//
// The ids come from content/billingPeriod.ts, not from this file. They are the
// same two words /start validates on arrival and the same two the backend's
// allow-list accepts, so the offer, the reflection and the eventual request
// cannot drift into three slightly different vocabularies.
// The price type is derived from priceForPeriod rather than written out.
// `plans` is declared `as const`, so `typeof plans.standard.price` is the
// LITERAL type { amount: 11.99, period: "month" } and the yearly price is not
// assignable to it — a type that describes one specific price cannot describe
// both. Deriving the union from the resolver keeps this correct if a third
// period is ever added.
const OPTIONS: { id: BillingPeriodId; label: string; price: ReturnType<typeof priceForPeriod> }[] = [
  { id: "monthly", label: "Monthly", price: priceForPeriod("monthly") },
  { id: "yearly", label: "Yearly", price: priceForPeriod("yearly") },
];

// SELECTION IS NATIVE RADIO BEHAVIOUR, NOT REACT STATE.
//
// Each option is a real <input type="radio"> inside its own <label>, inside a
// <fieldset>. That buys three things a div-with-onClick would not: keyboard
// arrow-key navigation between the options, a correct accessible name and
// checked state announced to screen readers, and — because the selected
// styling is driven by Tailwind's `peer-checked:` variants rather than by a
// state value — a control that still visibly responds before React hydrates
// and on a page where JavaScript never runs at all. The site already ships a
// <noscript> nav fallback; this keeps that standard.
//
// useState exists for exactly ONE reason: to carry the choice into the CTA's
// href. It is not the source of truth for what looks selected.
export default function BillingPeriodChoice() {
  const [selected, setSelected] = useState<BillingPeriodId>(DEFAULT_BILLING_PERIOD);

  return (
    <div className="mx-auto w-full max-w-xl rounded-vv-lg border border-vv-line bg-vv-bg-2 p-8 shadow-vv sm:p-10">
      {/* NOT-LIVE NOTICE, same pattern and same single source of truth as
          /start: it renders off trial.live (content/commerce.ts), so when
          billing genuinely switches on, this disappears by flipping one flag
          rather than by someone remembering to delete a paragraph. Stated
          before the choice rather than after it, so nobody picks a period
          believing they have just started something. */}
      {!trial.live ? (
        <div className="mb-8 rounded-vv border border-vv-line bg-vv-bg px-5 py-4 text-center">
          <p className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-vv-bronze-text">
            Not open yet
          </p>
          <p className="mt-2 text-sm leading-relaxed text-vv-ink-dim">
            Choosing here doesn’t start a trial or take payment. Signup switches on when account
            creation and billing are ready.
          </p>
        </div>
      ) : null}

      <fieldset>
        <legend className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-vv-bronze-text">
          After your trial
        </legend>

        {/* Stacked on mobile, side by side from sm. Both tiles are the same
            element with the same classes and share a `basis-0 grow` track, so
            they are identical in width, padding, type scale and border
            weight at every breakpoint. Neither is ordered, flagged or sized
            to read as the better one — the only difference a visitor can see
            between them is the word and the number.

            Each tile uses `group` + `group-has-[:checked]:` rather than
            `peer-checked:`. Tailwind's peer variant compiles to a
            general-SIBLING selector, so it can only reach elements sitting
            next to the input, never the nested spans below — the selection
            mark and the label text would have silently stayed
            unselected-looking forever. Scoping off the label's own
            :has(:checked) reaches any depth. */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          {OPTIONS.map((option) => (
            <label
              key={option.id}
              className="group flex grow basis-0 cursor-pointer flex-col gap-2 rounded-vv border border-vv-line bg-vv-bg p-5 transition duration-200 hover:border-vv-bronze has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:checked]:border-vv-bronze"
            >
              <input
                type="radio"
                name="billing-period"
                value={option.id}
                defaultChecked={option.id === DEFAULT_BILLING_PERIOD}
                onChange={() => setSelected(option.id)}
                className="sr-only"
              />

              <span className="flex items-center gap-2">
                {/* Selection mark. A hairline ring that fills bronze when
                    checked — the site's own gold/bronze accent doing the
                    work, rather than an imported checkbox or tick icon that
                    would read as generic checkout UI. */}
                <span
                  aria-hidden
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-vv-line group-has-[:checked]:border-vv-bronze"
                >
                  <span className="h-2 w-2 rounded-full bg-transparent group-has-[:checked]:bg-vv-bronze" />
                </span>
                <span className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-vv-ink-faint group-has-[:checked]:text-vv-bronze-text">
                  {option.label}
                </span>
              </span>

              <span className="flex items-baseline gap-1.5">
                <span className="font-display text-3xl font-semibold text-vv-ink">
                  {CURRENCY_SYMBOL[option.price.currency] ?? ""}
                  {option.price.amount.toFixed(2)}
                </span>
                <span className="font-head text-sm text-vv-ink-faint">/ {option.price.period}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* The no-feature-difference statement, said plainly and once. This is
          the sentence that stops the two tiles reading as two products. */}
      <p className="mt-6 text-sm leading-relaxed text-vv-ink-dim">
        Both are Standard, in full. The only difference is how often you’re billed.
      </p>

      {/* ONE CTA, never two. A second button beside it would turn a billing
          preference into a purchase decision, and there is nothing to
          purchase.

          The chosen period travels on the query string, and /start now READS
          it: step four quotes the price for whichever period was chosen here
          rather than always quoting the monthly one. That is display only.
          The parameter is reader-editable by definition, which is fine for
          choosing between two already published prices and would not be fine
          for anything that decides what somebody is billed. When there is a
          real session, /start must take the period from the server's
          subscription state instead of from this link. */}
      <CtaButton href={`/start?billing=${selected}`} className="mt-8 w-full">
        Continue to Account
      </CtaButton>

      {/* Accurate for the intended flow, and no further. It states the trial
          length and that a card is needed, both of which are already true of
          trial.days / trial.cardRequired. It promises nothing about
          cancellation or refunds, because no such terms are approved. */}
      <p className="mt-4 text-center text-xs leading-relaxed text-vv-ink-faint">
        You won’t be charged during your {trial.days}-day trial.
        {trial.cardRequired ? " A card will be required when billing is live." : ""}
      </p>
    </div>
  );
}
