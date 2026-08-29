import { appUrl } from "@/content/site";

// THE ACQUISITION JOURNEY, AND THE ONE FLAG THAT GATES ITS DEEP LINK.
//
// The approved first-time journey is: Build My Plan -> builder -> personalised
// preview -> Save My Plan / authenticate -> trial or purchase -> app. The
// athlete sees a real programme built from their own answers before anything
// is asked of them.
//
// THE APP NOW EXPOSES IT, so this is on. When the flag was introduced the
// Valhalla app's /start still opened on "Step one of three — Create your
// account, or sign in", and pointing a button labelled "Build My Plan" at a
// signup form was the production mismatch it existed to prevent.
//
// VERIFIED ON APP MAIN 58b5fb0 BEFORE FLIPPING, on two counts rather than one:
//   ORDER      pane-build -> pane-preview ("Step two of three") -> Save My
//              Plan -> pane-auth ("Step three of three") -> trial. The app's
//              own source says so: "THE APPROVED JOURNEY: builder -> preview
//              -> 'Save My Plan' -> trial".
//   AUTHORITY  pane-build carries ZERO inline form controls now. It mounts the
//              app's staged nine-stage builder (BLD_STAGES, the 01/09 rail,
//              bld-back/bld-next) instead of the old one-page mini-questionnaire.
//              That matters more than the order: the website must never send
//              anybody into a second implementation of the athlete
//              questionnaire, and the app is the single builder authority.
//
// This is not a claim gate like PRODUCT_CLAIMS or LEGAL_APPROVALS: nothing
// here decides what the site may say about the product, only where a button
// goes. It is separate from trial.live (commerce.ts) for the same reason —
// that flag governs whether money can change hands, this one governs a route.
export const JOURNEY = {
  /**
   * True once the Valhalla app's own entry point opens on the builder rather
   * than on account creation. VERIFY AGAINST THE APP BEFORE FLIPPING — the
   * check is whether app /start's first pane builds a plan, not whether the
   * work is merged somewhere.
   */
  valueFirstLive: true,
} as const;

/**
 * Where every public "Build My Plan" CTA points.
 *
 * One export, so the whole site moves together when the flag flips and no
 * component has to know the flag exists.
 */
export const buildUrl: string = JOURNEY.valueFirstLive ? appUrl : "/start";

/**
 * The same route, carrying the billing period the athlete has already chosen.
 *
 * WHY THE PERIOD TRAVELS. Commercial launch: a visitor who picks Monthly or
 * Annual on the pricing page has made the choice, and asking them to make it
 * again at the commercial step is the site forgetting what they said. The app
 * treats it as a PRESELECTION and nothing more — it can still be changed
 * before the trial starts, and the price is resolved server-side from the
 * offer code, never from this parameter. Nothing purchasable is named here.
 *
 * WHY IT IS NOT A PRICE ID. A URL that carried a Stripe price would be a URL
 * anybody could edit into a different one. "monthly" and "yearly" are the only
 * two values the app accepts, and it resolves both itself.
 */
export function buildUrlForPeriod(period: "monthly" | "yearly"): string {
  const sep = buildUrl.indexOf("?") === -1 ? "?" : "&";
  return `${buildUrl}${sep}period=${period}`;
}
