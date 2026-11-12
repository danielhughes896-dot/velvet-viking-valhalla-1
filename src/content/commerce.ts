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
// THE PENDING REVISION TO THE TRIAL — DECIDED, NOT YET TRUE.
//
// Founder, across four messages, each one narrowing the last:
//   "I think it should be 7 days free trial. And when they sign up for free
//    all data after 7 days is hidden. Then when they pay they see the full
//    data."
//   "Nooo. Just a single 7 days. Then it ends. But a user can only see 7 days."
//   "No I want the card to start."
//
// WHAT IT LANDED ON IS A REVISION, NOT A DIFFERENT PRODUCT, and that is why
// this is a small object rather than a parallel commercial model. Two passes
// built bigger things first — a permanent free tier, then a card-free trial
// that expires — and both were wrong in the same direction: they changed
// machinery the founder had not asked to change. The card is taken up front
// and the subscription converts automatically, exactly as `trial` below
// already says and exactly as the published Terms already describe.
//
// ONLY TWO THINGS MOVE:
//   days        14 -> 7. The free period is shorter.
//   horizonDays NEW. During the trial an athlete sees seven days of their
//               training block rather than the whole of it. "when they pay
//               they see the full data."
//
// TWO SEVENS, AND THEY ARE DIFFERENT NUMBERS. One is how long the trial
// lasts; the other is how much of the block it shows. They coincide here,
// which is exactly why they are two fields: the length of a trial and the
// depth of its view are separate decisions, and deriving one from the other
// would hide the day they diverge.
//
// WHAT IS DELIBERATELY ABSENT: no cardRequired, no autoConverts, no
// expires. Restating them here would create a second place where they are
// declared and a second place for them to drift. They are unchanged, they
// live in `trial`, and a test asserts this object does not redeclare them.
//
// `live` IS FALSE AND MUST STAY FALSE UNTIL THE APP BEHAVES THIS WAY. The
// app charges on day fourteen (api/_products.js, TRIAL_DAYS = 14) and shows
// the whole block throughout. Saying "7 days" while Stripe bills on the
// fourteenth is a false commercial claim; saying "you see 7 days" while the
// app shows all of it is merely wrong, but it is still wrong in public.
//
// WHAT HAS TO HAPPEN BEFORE IT FLIPS, in order:
//   1. SYSTEM sets TRIAL_DAYS = 7 and the Stripe trial_period_days with it.
//   2. SYSTEM teaches the app a visibility horizon. Nothing like it exists:
//      the entitlement model has capabilities (`can('execution_review')`) and
//      a locked-out state, but nothing that shows only part of a block.
//   3. The Terms are republished. The live ones say fourteen days, and say
//      "Nothing is held back for paying subscribers" — which a seven-day
//      view contradicts outright. See TRIAL_REVISION_LEGAL_AMENDMENT in
//      content/legal.ts: drafted, unapproved, unpublished.
//   4. Then this flag, and only then.
export const trialRevision = {
  /** Replaces `trial.days`. The free period, shortened from fourteen. */
  days: 7,
  /**
   * NEW, and the only genuinely new idea in the revision: how much of the
   * training block is displayed while the trial runs. Sacoro builds the
   * whole block; this governs how much of it an athlete is shown before the
   * subscription begins.
   */
  horizonDays: 7,
  /** See the block comment above. Do not flip this from the website side. */
  live: false,
} as const;

// THE REVISED TRIAL'S CUSTOMER-FACING SENTENCES, WRITTEN BUT NOT RENDERED.
//
// Kept here for the same reason content/legal.ts keeps unpublished drafts in
// the file: the wording is the part worth deciding early and reviewing on its
// own. Nothing reads this while `trialRevision.live` is false — a test
// enforces that.
//
// WHAT THE WORDING HAS TO GET RIGHT:
//
//   THE CARD IS STILL TAKEN FIRST, and the copy must keep saying so. An
//   earlier draft of this block said "no card" — a different model, and the
//   single most damaging sentence available here, because a reader who
//   believes no card is involved has not understood that a subscription
//   begins by itself a week later.
//
//   IT MUST NAME THE LIMIT WITHOUT SOUNDING LIKE A CATCH. "You see 7 days of
//   your block during the trial" is the plain version. The thing being
//   withheld is the rest of a programme the athlete can have in full by
//   subscribing, so it is stated as what the subscription adds.
//
//   THE CONVERSION STAYS EXPLICIT. "Cancel before it ends and you won't be
//   charged. Otherwise your subscription starts automatically." That
//   sentence is the one the whole trial model rests on and it does not get
//   softened because the trial got shorter.
export const trialRevisionCopy = {
  /** Replaces "AFTER YOUR TRIAL" above the two prices. */
  pricesEyebrow: "After your 7 days",
  /** The one-line statement of the offer, for cards and intros. */
  offer: `${trialRevision.days} days free. You see ${trialRevision.horizonDays} days of your block.`,
  /** The full terms paragraph, replacing the trial sentence block. */
  terms:
    `Your first ${trialRevision.days} days are free. You choose monthly or annual and add a ` +
    `payment method to start, and nothing is taken during the ${trialRevision.days} days. ` +
    `During them you can see ${trialRevision.horizonDays} days of your training block; your ` +
    `subscription shows you the whole of it. Cancel before the ${trialRevision.days} days end ` +
    `and you won't be charged. Otherwise the option you picked starts automatically.`,
  /** The note under the billing-period choice. */
  periodNote: (money: string, period: string) =>
    `After ${trialRevision.days} days this becomes ${money} a ${period}, unless you cancel.`,
  /** The hero's one honest line under the button. */
  ctaNote: `Get the app, then answer a few questions. Your first ${trialRevision.days} days are free.`,
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
