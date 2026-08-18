// Central commercial configuration — pricing, trial terms, plan tiers, and
// the routing seams that hand off to the account/entitlement system.
//
// Nothing here activates a real purchase. Marketing components read prices,
// trial terms and feature copy from here rather than hard-coding them, so a
// pricing change is a data edit, not a template edit — and so no component
// has to encode entitlement logic itself.
//
// PHASE 3 SCOPE: the backend commercial entitlement/payment system is not
// live. `trial.live` and the null seam URLs below are what actually gate
// whether any commercial action on the site is real — see PricingCard and
// the /start page, which render their disabled/pending state directly off
// these flags rather than a hard-coded "coming soon" string.

export const plans = {
  standard: {
    id: "standard",
    name: "Standard",
    // HUMAN COPY PASS: "coaching core" is internal product vocabulary, and
    // it also appeared verbatim as pages.pricing.sub, so the same phrase
    // ran twice inside one viewport. Both are now plain English and
    // deliberately different from each other.
    tagline: "The whole of Valhalla.",
    // Working hypothesis, not yet finalized pricing.
    price: { amount: 11.99, currency: "GBP", period: "month" },
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

export const trial = {
  planId: "standard" as const,
  days: 14,
  cardRequired: true,
  autoConverts: true,
  // Whether trial signup is actually wired to a real backend. False until
  // the commercial entitlement/payment system is approved and connected —
  // see the Phase 3 brief. This is the single flag that decides whether
  // the site's trial copy can ever claim to be live.
  live: false,
} as const;

// Handoff seams to the account/entitlement system System 3A1 is building.
// Nullable by design — the same pattern as `footer.social` in site.ts: a
// null href renders the action as visibly present but inactive, never a
// fake "#" link or a success path that doesn't exist. Fill in the real
// route the moment the backend contract lands; no component change
// required beyond this file.
export const commerceSeams = {
  createAccount: null as string | null,
  signIn: null as string | null,
} as const;
