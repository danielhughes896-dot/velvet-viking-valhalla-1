import { appGetUrl } from "@/content/site";

// THE ACQUISITION JOURNEY, AND WHERE THE WEBSITE STOPS.
//
// Founder: "Build my plan should not build it on the website. It should take
// them to the app. Then they download the app and register and build from
// there."
//
// THE ROAD MAP, IN FULL, AND WHICH SIDE OWNS EACH STEP:
//
//   1. WEBSITE   Build My Plan, anywhere on the site.
//   2. APP       /get — "Get Sacoro". Android installs the APK, iPhone adds
//                it to the home screen, and anything else opens it in the
//                browser. All three of those end at the app's root.
//   3. APP       The root is the protected runtime. With the commercial gate
//                on and no session it answers 302 /account.
//   4. APP       /account takes an email and sends a sign-in link.
//                api/beta-signin posts create_user:true and no longer checks
//                an allowlist — "NO ELIGIBILITY CHECK HERE ANY MORE. A new
//                address is a new athlete" — so this registers as well as
//                signs in. That is what makes step 4 a real door rather than
//                a wall for anybody who was never invited to the beta.
//   5. APP       Signed in, the runtime builds the plan, with the app's own
//                eleven-stage builder and its own engine.
//
// THE WEBSITE PERFORMS NONE OF THEM. It names a destination; everything from
// the download onward is the app's. No identity, no commerce, no builder.

export const JOURNEY = {
  /**
   * True once the app's own public entry is live, so the site may deep-link
   * into it rather than holding a first-time athlete on /start.
   *
   * WHAT CHANGED UNDER THIS FLAG, AND WHAT DID NOT. It was introduced to ask
   * one question — does the app's entry open on a builder rather than on
   * account creation? — because pointing a button labelled "Build My Plan" at
   * a signup form was the production mismatch it existed to prevent. That
   * answer is still yes, verified on app main 58b5fb0: pane-build mounts the
   * BLD_STAGES builder and asks for an account at step three.
   *
   * What changed is WHICH of the app's three public doors the site opens. The
   * founder has put the install first — "they download the app and register
   * and build from there" — so the deep link is the app's /get rather than
   * its /start. The gate's job is unchanged and so is its shape: one switch,
   * one exported route, closable in a single line to bring a first-time
   * athlete back to this site's own /start if the app's entry ever goes away.
   *
   * THE NAME NOW DESCRIBES THE APP RATHER THAN THE SITE. "Value first" was
   * the order this website drove: a programme before a signup. The website no
   * longer drives any order — the app does, behind an install. The flag is an
   * HQ-approved launch flag, so it is not renamed here; if HQ wants the name
   * to match its new subject that is their call, not this repository's.
   *
   * VERIFY AGAINST THE APP BEFORE FLIPPING: the check is whether the app
   * genuinely serves /get, /account and a runtime at its root, not whether
   * the work is merged somewhere.
   */
  valueFirstLive: true,
} as const;

/**
 * Where every public "Build My Plan" CTA points: the app's install page.
 *
 * One export, so the whole site moves together and no component has to know
 * which of the app's public routes is the current front door, or that a flag
 * decides it.
 */
export const buildUrl: string = JOURNEY.valueFirstLive ? appGetUrl : "/start";

// THE BILLING PERIOD NO LONGER TRAVELS ON THIS URL, AND IT IS WORTH SAYING
// WHY RATHER THAN QUIETLY DROPPING IT.
//
// buildUrlForPeriod() appended ?period=monthly or ?period=yearly, and the
// app's /start read it as a preselection on its trial card, so an athlete who
// chose annual on /pricing was not asked the same question again at the
// commercial step.
//
// That worked because /pricing linked straight at /start. It cannot work now:
// the install page sits between them, and it forwards nothing — its three
// buttons all go to "/" with no query at all. A parameter on /get would be
// read by nobody, which is worse than no parameter, because the next person
// to read this would believe the choice still crosses.
//
// SO THE CHOICE ON /pricing IS INFORMATION, not a preselection: it answers
// "what does each one cost", and the app asks for the binding answer at the
// trial card, where the card is actually taken. Making it survive the install
// means carrying the parameter through /get and into the runtime, which is a
// change inside the app and belongs to SYSTEM rather than here.
