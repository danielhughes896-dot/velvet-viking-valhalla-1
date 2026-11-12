"use client";

import { useState } from "react";
import CtaButton from "@/components/ui/CtaButton";
import { plans, trial } from "@/content/commerce";
import { buildCta } from "@/content/site";
import { buildUrlForPeriod } from "@/content/journey";

// THE BILLING PERIOD, CHOSEN THE WAY THE APP ASKS FOR IT.
//
// Founder: "The pay monthly/ yearly or build my plan yearly ect need to
// follow the same selection rules as the app also."
//
// WHAT THE PRICING CARD DID. Two CTAs, stacked: "BUILD MY PLAN — MONTHLY" in
// solid cherry and "BUILD MY PLAN — ANNUAL" as a ghost outline, each a link
// that left the page. Three things were wrong with that against the app:
//
//   IT RANKED THEM. A solid primary above a ghost secondary is the site's own
//   grammar for "do this, or if you must, that". commerce.ts is explicit that
//   the two periods are "equal, parallel choices" with no badge, no saving
//   and no best-value flag — and then the card drew one of them as the
//   recommendation anyway. The app draws them as two halves of one control,
//   `.day{flex:1 1 0}`, identical in every respect but the word.
//
//   IT HAD NO STATE. There was nothing selected, because there was nothing to
//   select — each was a door. The app has a current answer from the moment
//   the control appears (`var period = 'monthly'`, aria-pressed="true" in the
//   markup) and exactly one is pressed at a time.
//
//   IT ANSWERED BY LEAVING. Choosing meant navigating, so a visitor could not
//   look at what annual means and then change their mind without a page load.
//   In the app, picking a period selects it and updates a sentence; a
//   separate button is what moves you on.
//
// SO THIS IS THE APP'S CONTROL: two equal pressed-state buttons, monthly
// preselected, one note that follows the choice, and one action underneath
// carrying whatever is chosen.
//
// THE NOTE IS THE APP'S SENTENCE, assembled from this site's own price data
// rather than copied as a string — the app's AFTER map reads "After 14 days
// this becomes £11.99 a month, unless you cancel." and the figures here come
// from content/commerce.ts, so the two cannot disagree about the price and
// this file cannot drift into quoting a number nobody updated.
//
// NOTHING COMMERCIAL HAPPENS HERE, and adding state does not change that.
// There is no provider, no checkout, no price id: the period is a preselection
// that travels as the word "monthly" or "yearly" on the build URL, and the
// app's server resolves what is actually charged from the offer. See
// buildUrlForPeriod in content/journey.ts.
//
// useState RATHER THAN useSyncExternalStore, which the other client
// components here use: those subscribe to something outside React (scroll
// position, the URL). This is an ordinary local answer with no external
// source to read, so a store would be ceremony around a boolean.

type Period = "monthly" | "yearly";

const CURRENCY_SYMBOL: Record<string, string> = { GBP: "£" };

export default function PeriodChoice() {
  const plan = plans.standard;

  // 'monthly', exactly as the app initialises it. Not an empty state the
  // athlete has to resolve before the button works — the app never shows an
  // unanswered period, and a disabled CTA waiting on a radio would be this
  // site inventing a step the product does not have.
  const [period, setPeriod] = useState<Period>("monthly");

  // The price shape is written out rather than taken as `typeof plan.price`:
  // commerce.ts is `as const`, so that type narrows to the literal 11.99 /
  // "month" and the annual price will not fit in it.
  type Price = { readonly amount: number; readonly currency: string; readonly period: string };
  const options: { key: Period; label: string; price: Price }[] = [
    { key: "monthly", label: "Monthly", price: plan.price },
    { key: "yearly", label: "Annual", price: plan.priceAnnual },
  ];

  const chosen = options.find((o) => o.key === period)!;
  const money = `${CURRENCY_SYMBOL[chosen.price.currency] ?? ""}${chosen.price.amount.toFixed(2)}`;

  return (
    <div>
      {/* .days — display:flex; gap:6px. Each .day is flex:1 1 0, so the two
          are exactly half the control each and neither can read as the
          larger offer. */}
      <div className="flex gap-[6px]" role="group" aria-label="Billing period">
        {options.map((o) => {
          const on = o.key === period;
          return (
            <button
              key={o.key}
              type="button"
              aria-pressed={on}
              onClick={() => setPeriod(o.key)}
              // .day — padding:9px 0; text-align:center; font-size:12px;
              // border:1px var(--line); border-radius:8px; background:var(--bg-2).
              // .day[aria-pressed="true"] — border-color:var(--ink);
              // background:var(--bg-3); font-weight:600. The pressed state is
              // carried by the BORDER and the weight, not by a fill colour:
              // the app does not paint the chosen period in the accent,
              // because selecting a billing period is not the action — the
              // button below it is.
              className={`flex-1 rounded-[8px] border py-[9px] text-center font-head text-[12px] transition-colors ${
                on
                  ? "border-vv-ink bg-vv-bg-3 font-semibold text-vv-ink"
                  : "border-vv-line bg-vv-bg-2 text-vv-ink hover:border-vv-ink"
              }`}
            >
              {/* THE APP'S OWN BUTTON CONTENT, which is the price and not a
                  label: `<b>£11.99</b><br><span>per month</span>`. The first
                  pass wrote "Monthly" over a small figure, which read as a
                  word the visitor had to map onto a price printed elsewhere
                  on the card — and meant the page stated both prices twice
                  within four hundred pixels, once large and once small. The
                  app states each once, inside the thing you press.
                  The figure is larger here than the app's flat 12px: this is
                  a pricing page, where the number is what a visitor came for,
                  and the app's control sits in a 420px pane where it is not.
                  Both options take the same two sizes, so neither can read as
                  the recommendation. */}
              <b className="block text-[22px] leading-[1.1] font-semibold">
                {CURRENCY_SYMBOL[o.price.currency] ?? ""}
                {o.price.amount.toFixed(2)}
              </b>
              <span className="mt-[3px] block text-[12px] font-normal">per {o.price.period}</span>
            </button>
          );
        })}
      </div>

      {/* #choice-note — .quiet, and the app rewrites its textContent on every
          press. aria-live so a screen reader is told the consequence changed,
          which the app gets for free by being a single page and this does
          not. */}
      <p aria-live="polite" className="mt-[14px] text-[12px] leading-[1.55] text-vv-ink">
        {trial.autoConverts
          ? `After ${trial.days} days this becomes ${money} a ${chosen.price.period}, unless you cancel.`
          : `${money} a ${chosen.price.period} after your ${trial.days}-day trial.`}
      </p>

      {/* ONE ACTION, CARRYING THE ANSWER. The app's "Start my 14-day trial"
          sits under the choice rather than being the choice; this is the same
          shape with the website's own job in it, which is to enter the
          builder. The period travels on the URL as a preselection the athlete
          can still change before anything is charged. */}
      <CtaButton href={buildUrlForPeriod(period)} variant="cherry" className="mt-6 w-full">
        {buildCta.label}
      </CtaButton>
    </div>
  );
}
