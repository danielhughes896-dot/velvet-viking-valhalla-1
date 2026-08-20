import { plans } from "@/content/commerce";

// THE BILLING PERIOD, IN ONE PLACE.
//
// Three surfaces need to agree on what a billing period is: /trial offers the
// choice, /start reflects it back, and one day an account step will hand it to
// the backend. Before this module they would have agreed by coincidence —
// three copies of the same two strings — which is exactly how a fourth surface
// later ends up accepting "annual" or "YEARLY" and quietly falling through to
// the wrong price.
//
// ============================ READ THIS FIRST ============================
// THIS IS DISPLAY STATE. IT IS NOT PAYMENT AUTHORITY.
//
// The period travels between website pages as a query parameter, which means
// it is entirely under the reader's control: anyone can type ?billing=yearly.
// That is harmless for what this module does — deciding which of two already
// public prices to print — and would be catastrophic for anything else.
//
// The backend contract is built the same way round, and deliberately so. From
// api/_checkout.js in the Valhalla app repository:
//
//   WHAT THE BROWSER MAY DECIDE
//     the PERIOD, and only by naming one of two words that are validated
//     against an allow-list before anything else happens.
//   WHAT THE BROWSER MAY NOT DECIDE
//     the price, the amount, the currency, the trial length, the customer,
//     the tier, or whether it is entitled to any of them.
//
// So the one value the browser is ever allowed to name is the one value this
// module carries, and it is validated at both ends. Never add an amount, a
// currency, a Stripe price id, a trial length or an entitlement flag here.
// Those are resolved server-side from configuration and from the authenticated
// user, and a website that can name them is a website that can be told to lie.
// =========================================================================

export const BILLING_PERIODS = ["monthly", "yearly"] as const;

export type BillingPeriodId = (typeof BILLING_PERIODS)[number];

/** The default when nothing has been chosen, or when what arrived is junk.
 *  Monthly because it is the lower commitment and because /trial defaults to
 *  it — a reader who never touched the control sees the same thing on both
 *  pages. It is not a recommendation and must never be presented as one. */
export const DEFAULT_BILLING_PERIOD: BillingPeriodId = "monthly";

/** The two words the backend's allow-list accepts, matched exactly. */
export function isBillingPeriod(value: unknown): value is BillingPeriodId {
  return typeof value === "string" && (BILLING_PERIODS as readonly string[]).includes(value);
}

/**
 * Resolve a period for DISPLAY from an untrusted query value.
 *
 * Deliberately total: every possible input returns one of the two known
 * periods, so no caller has to handle a failure and no page can be made to
 * render a broken or empty price by editing the address bar. Arrays (which is
 * what `?billing=a&billing=b` produces) and every other malformed shape fall
 * back rather than throwing — a 500 on the account journey would be a far
 * worse outcome than showing the default.
 *
 * NO NORMALISATION ON PURPOSE. "Yearly", " yearly" and "YEARLY" are not
 * accepted, because the backend allow-list does not accept them either. If
 * this were lenient where the backend is strict, a reader could be shown one
 * period on /start and be charged for the other — which is precisely the
 * failure the strictness exists to prevent.
 */
export function readDisplayPeriod(value: unknown): BillingPeriodId {
  return isBillingPeriod(value) ? value : DEFAULT_BILLING_PERIOD;
}

/** The published price for a period. Both are already public on /pricing; this
 *  reads the same `plans.standard` object so /start can never print a figure
 *  that /pricing does not show. */
export function priceForPeriod(period: BillingPeriodId) {
  return period === "yearly" ? plans.standard.priceAnnual : plans.standard.price;
}

/** "£11.99/month" / "£89.99/year", formatted once so every surface says it the
 *  same way. Deliberately no per-month equivalent for the yearly price and no
 *  comparison between the two: the two options stay uncompared here exactly as
 *  they do on the pricing card. */
export function formatPeriodPrice(period: BillingPeriodId): string {
  const price = priceForPeriod(period);
  const symbol = price.currency === "GBP" ? "£" : "";
  return `${symbol}${price.amount.toFixed(2)}/${price.period}`;
}
