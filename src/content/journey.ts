import { appUrl } from "@/content/site";

// THE ACQUISITION JOURNEY, AND THE ONE FLAG THAT GATES ITS DEEP LINK.
//
// The approved first-time journey is: Build My Plan -> builder -> personalised
// preview -> Save My Plan / authenticate -> trial or purchase -> app. The
// athlete sees a real programme built from their own answers before anything
// is asked of them.
//
// THE APP IS MID-CHANGE. At the time this shipped, the Valhalla app's /start
// still opened on "Step one of three — Create your account, or sign in", i.e.
// the old account-first order, and the app worker owns moving it. Pointing the
// public CTAs straight at that screen would mean a button labelled "Build My
// Plan" landing on a signup form: exactly the production mismatch this work
// was told not to create.
//
// So the label and the architecture ship now, and the DEEP LINK waits behind
// this flag. While it is false, Build My Plan goes to this site's own /start,
// which states the journey honestly and hands off from there. Flip it to true
// once the app exposes the value-first flow and every CTA on the site deep
// links into the builder instead — one line, no component changes.
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
  valueFirstLive: false,
} as const;

/**
 * Where every public "Build My Plan" CTA points.
 *
 * One export, so the whole site moves together when the flag flips and no
 * component has to know the flag exists.
 */
export const buildUrl: string = JOURNEY.valueFirstLive ? appUrl : "/start";
