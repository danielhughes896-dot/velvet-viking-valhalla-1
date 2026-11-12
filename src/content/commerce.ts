import { appSignInUrl, appGetUrl } from "@/content/site";

// Central commercial configuration — pricing, trial terms, plan tiers, and
// the routing seams that hand off to the account/entitlement system.
//
// Marketing components read prices, trial terms and feature copy from here
// rather than hard-coding them, so a pricing change is a data edit, not a
// template edit — and so no component has to encode entitlement logic itself.
//
// COMMERCIAL LAUNCH. This file used to say "nothing here activates a real
// purchase", which was true for the whole of the private beta and is not true
// now: the app's commercial system is live against Stripe, and the seams below
// hand an athlete into it. What has NOT changed is where authority lives —
// this file names a price for a reader, and the server resolves the price that
// is actually charged. The site never sends a price, a price id, or an
// entitlement claim.

export const plans = {
  standard: {
    id: "standard",
    name: "Standard",
    // HUMAN COPY PASS: "coaching core" is internal product vocabulary, and
    // it also appeared verbatim as pages.pricing.sub, so the same phrase
    // ran twice inside one viewport. Both are now plain English and
    // deliberately different from each other.
    tagline: "The whole of Sacoro.",
    // Working hypothesis, not yet finalized pricing.
    price: { amount: 11.99, currency: "GBP", period: "month" },
    // ANNUAL BILLING OPTION for the SAME plan — not a second tier, and not
    // a promotion. Standard is still one plan with one feature set; this is
    // only a second billing period for it, which is why it lives beside
    // `price` here rather than in the `basic`/`pro` tier architecture
    // below, and why the pricing page still says "One plan" and "No tiers
    // to compare" truthfully.
    //
    // DELIBERATELY NOT DERIVED, AND DELIBERATELY NOT COMPARED. There is no
    // savings figure, no per-month equivalent, no discount percentage, no
    // "best value" flag and no struck-through monthly total stored here,
    // because none of that is to be shown. Anything computed from these two
    // numbers (11.99 x 12 = 143.88, so annual is 53.89 less) is exactly the
    // comparative-savings framing the brief rules out, so the arithmetic is
    // recorded in this comment and nowhere the UI can reach it. The two
    // prices are presented as equal, parallel choices.
    //
    // Distinct from `foundingOffer` below: that is a time-limited
    // promotional price for the monthly plan and stays gated behind
    // `enabled: false`. This is a permanent billing option, and at commercial
    // launch both periods are genuinely purchasable — the sentence that used
    // to sit here saying neither could be bought described the beta.
    // FINAL APPROVED COMMERCIAL PRICING. Was 79.99 while the annual figure
    // was still being decided; 89.99 is the settled number. Monthly is
    // untouched at 11.99.
    priceAnnual: { amount: 89.99, currency: "GBP", period: "year" },
    // Possible founding-launch offer. `enabled: false` until pricing is
    // explicitly approved for publication — do not flip this on, and do
    // not surface `discounted` anywhere in the UI, until that approval
    // lands. Kept here (not deleted) so turning it on later is a config
    // change, not new component work.
    foundingOffer: {
      enabled: false,
      price: { amount: 9.99, currency: "GBP", period: "month" },
      months: 12,
    },
    // HUMAN COPY PASS. Four of these seven carried a machine-writing
    // pattern, and none of the fixes changes what is being promised:
    //   1. dash used as a colon, and "from day one" also appeared verbatim
    //      in valhallaProduct.points on the homepage;
    //   3. a fourth "not just" (seven site-wide) plus a redundant
    //      "actually";
    //   5. the clause after the dash restated the clause before it — the
    //      same defect as the homepage's "Adaptation with purpose" bullet,
    //      which it also duplicated;
    //   6. "doesn't spiral into a rescue plan" was word-for-word identical
    //      to a sentence on /valhalla.
    features: [
      "Training built around you: your fitness, pace zones and race target set the plan from the start.",
      "Clear guidance for every session: exactly what to do, and how it should feel.",
      "Reads how a session went, not whether you ticked it off.",
      "Waits for a real pattern before it changes anything.",
      "Explains why, every time.",
      "Doesn’t chase missed-session debt. A skipped day never turns into a backlog.",
      "You decide. Every proposed change is yours to accept or decline.",
    ],
  },
  // Basic and Pro exist in the tier architecture but are not sold yet, and
  // nothing renders them — this shape just means the entitlement work
  // later doesn't need a schema change. Do not build tier UI off these
  // until `available` flips true.
  basic: { id: "basic", name: "Basic", available: false },
  pro: { id: "pro", name: "Pro", available: false },
} as const;

// THE AUTHORISED TRIAL MODEL, AS FACTS RATHER THAN PROSE.
//
// Card up front, period chosen up front, automatic conversion unless the
// athlete cancels. Every public sentence about the trial is composed from these
// four flags, so no surface can drift into a friendlier version of the deal
// than the one that actually applies. In particular the site must never imply
// that no card is needed, that payment details are collected only after the
// trial, that the athlete can trial without picking a period, or that doing
// nothing avoids the charge — the last one being the difference between clear
// and misleading.
//
// These are commercial UX facts. The contractual refund and cancellation terms
// are a separate matter and remain gated in @/content/legal until HQ supplies
// the approved wording.
// THE FREE TIER THAT REPLACES THE TRIAL — DECIDED, NOT YET TRUE.
//
// Founder: "I think it should be 7 days free trial. And when they sign up for
// free all data after 7 days is hidden. Then when they pay they see the full
// data." Asked which of three shapes that meant, they chose: a free account
// that never expires and never shows more than the next seven days of the
// block, with payment revealing the whole thing.
//
// THIS IS NOT A SHORTER TRIAL. It is a different commercial object, and
// calling it a trial would mislead in three separate ways: there is no card,
// nothing expires, and nothing converts. An athlete who never pays keeps a
// working account forever — they simply never see past the end of next week.
//
// `live` IS FALSE AND MUST STAY FALSE UNTIL THE APP BEHAVES THIS WAY. The
// product today does the opposite of all three: api/_products.js sets
// TRIAL_DAYS = 14, checkout collects a card before the trial starts, and the
// subscription converts automatically. Describing the free tier while that is
// true would be a live commercial misrepresentation on a site with real
// Stripe prices behind it — somebody could sign up expecting free and be
// charged. Same rule as `trial.live` below: copy follows the product.
//
// WHAT HAS TO HAPPEN BEFORE IT FLIPS, in order:
//   1. SYSTEM teaches the app a visibility horizon. Nothing like it exists:
//      the entitlement model has capabilities (`can('execution_review')`) and
//      a locked-out state, but nothing that hides part of a plan by date.
//   2. SYSTEM makes an account creatable without a payment method, and stops
//      the subscription auto-starting.
//   3. The Terms are republished. The live ones promise a 14-day card-
//      required trial and that "Nothing is held back for paying subscribers",
//      which this model contradicts outright. See termsCommercialV3Draft in
//      content/legal.ts — drafted, unapproved, unpublished.
//   4. Then this flag, and only then.
export const freeTier = {
  planId: "standard" as const,
  /**
   * How far ahead of today a free account can see, in days.
   *
   * A HORIZON, NOT A COUNTDOWN. It does not tick down and it is not a
   * quota: on day 90 a free athlete still sees the next seven days. The
   * distinction matters for copy — "your next 7 days" is true forever,
   * "7 days free" sounds like something running out.
   */
  horizonDays: 7,
  /** No payment method is needed to create the account or to keep it. */
  cardRequired: false,
  /** It does not expire. There is no date on which access ends. */
  expires: false,
  /** Nothing starts by itself. Paying is a deliberate act, or it never happens. */
  autoConverts: false,
  /** Paying reveals the whole block, not an extra week. */
  paidRevealsFullBlock: true,
  /** See the block comment above. Do not flip this from the website side. */
  live: false,
} as const;

/**
 * Which commercial model the site is allowed to describe.
 *
 * ONE BRANCH, READ BY EVERY SURFACE, so the question "what are we offering"
 * is answered in a single place rather than in each component. While the free
 * tier is not live this resolves to "trial", and every page keeps describing
 * the product the app actually runs today.
 */
export const COMMERCIAL_MODEL: "freeTier" | "trial" = freeTier.live ? "freeTier" : "trial";

// THE FREE TIER'S CUSTOMER-FACING SENTENCES, WRITTEN BUT NOT RENDERED.
//
// Kept here for the same reason content/legal.ts keeps unpublished drafts in
// the file: the wording is the part worth deciding early and reviewing on its
// own, and writing it now means the flip later is a review rather than a
// first draft under time pressure. Nothing reads this while
// COMMERCIAL_MODEL is "trial" — a test enforces that.
//
// WHAT THE WORDING HAS TO GET RIGHT, and where each line earns its place:
//
//   "FREE" WITHOUT "TRIAL". Every sentence avoids the word, because the
//   offer has no clock. An athlete reading "7 days free" hears a countdown
//   and will expect to be locked out on day eight; they will not be. The
//   horizon is a window that moves with them.
//
//   "YOUR NEXT SEVEN DAYS", NOT "THE FIRST SEVEN DAYS". The second is what a
//   trial would give. This one stays true in month three.
//
//   NOTHING IS TAKEN AND NOTHING STARTS. Two separate promises, both load-
//   bearing, because the model they replace did the opposite of each: a card
//   up front, and a subscription that began by itself.
//
//   NO SAVINGS FRAMING, SAME AS THE PRICES ABOVE. "Subscribing reveals the
//   whole block" states what paying does. It does not rank, discount or
//   compare, and there is no urgency in it.
export const freeTierCopy = {
  /** Replaces "AFTER YOUR TRIAL" above the two prices. */
  pricesEyebrow: "To see the whole block",
  /** The one-line statement of the offer, for cards and intros. */
  offer: `Free to use, always. You see your next ${freeTier.horizonDays} days.`,
  /** The full terms paragraph, replacing the trial sentence block. */
  terms:
    `Sacoro is free to use, and stays free. There is no payment method to add and nothing to cancel. ` +
    `A free account shows the next ${freeTier.horizonDays} days of your training block, ` +
    `and keeps showing them for as long as you train. Subscribing reveals the whole block.`,
  /** The note under the billing-period choice. */
  periodNote: (money: string, period: string) =>
    `${money} a ${period} reveals your whole block. Nothing starts by itself, and nothing is taken until you subscribe.`,
  /** The hero's one honest line under the button. */
  ctaNote: `Get the app, then answer a few questions. Sacoro is free to use — subscribe when you want to see past your next ${freeTier.horizonDays} days.`,
} as const;

export const trial = {
  planId: "standard" as const,
  days: 14,
  /** A payment method is supplied BEFORE the trial begins, not after it ends. */
  cardRequired: true,
  /** The chosen subscription starts by itself; cancelling is what stops it. */
  autoConverts: true,
  /** Monthly or annual is chosen BEFORE the trial, and sets the eventual price. */
  periodChosenUpfront: true,
  // Whether an ordinary visitor can actually start a trial today. This is the
  // single flag that decides whether the site's trial copy may claim to be
  // live, and it tracks WHETHER SOMEBODY CAN BUY rather than whether the
  // machinery behind the purchase exists.
  //
  // TRUE AT COMMERCIAL LAUNCH, and both of the conditions the previous comment
  // named are now met:
  //
  //   CHARGING IS ON. VVV_COMMERCE_ENABLED and VVV_COMMERCIAL_REQUIRED are set
  //   in the app's Production environment, against live Stripe prices for
  //   £11.99/month and £89.99/year with a 14-day trial. Before this, checkout
  //   refused every athlete with commerce_disabled.
  //
  //   SIGNUP IS OPEN. Public signup was closed by a trigger on auth.users that
  //   refused any address not on the private-beta allowlist. The private beta
  //   is retired: the trigger is dropped and the allowlist is kept as history
  //   rather than as an entitlement. An ordinary visitor can now become an
  //   account, which is what made every earlier version of this sentence
  //   false.
  //
  // The direction of the fix has not changed: copy follows the product. If
  // either condition is ever reversed, this goes back to false first.
  live: true,
} as const;

// Handoff seams into the app's account/entitlement system.
//
// FILLED IN AT COMMERCIAL LAUNCH. These were null for the whole of the private
// beta — the nullable shape exists so an unwired action renders as visibly
// present but inactive rather than as a fake "#" link or a success path that
// does not exist. The backend contract has landed, so they now name the real
// routes.
//
// THE APP OWNS EVERYTHING BEHIND THEM. The site hands over an intent and, at
// most, a billing period; identity, entitlement, agreements, checkout and the
// Stripe customer are all resolved on the app's own origin against the athlete
// on the bearer token. Nothing commercial is decided on this side of the link.
export const commerceSeams = {
  /**
   * WAS `createAccount`, POINTING AT THE APP'S BUILDER, and both halves of
   * that were wrong once the founder set the road map: "It should take them
   * to the app. Then they download the app and register and build from
   * there." A first-time athlete is sent to the install page, and the account
   * is created afterwards, at the sign-in shell — api/beta-signin posts
   * create_user:true with no allowlist, so one email address both registers
   * and signs in. Naming this seam after account creation described a screen
   * the website does not hand off to, and pointing it at /start described one
   * the journey no longer visits first.
   */
  firstTimeEntry: appGetUrl as string | null,
  signIn: appSignInUrl as string | null,
} as const;
