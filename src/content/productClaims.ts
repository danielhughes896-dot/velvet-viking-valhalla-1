// WHAT THE WEBSITE IS ALLOWED TO CLAIM THE PRODUCT DOES.
//
// Modelled directly on LEGAL_APPROVALS in @/content/legal, and for the same
// reason: some copy is written and ready, but publishing it depends on a fact
// outside this repository. There, the fact is "has HQ approved this wording".
// Here, it is "does the shipped app actually do this yet". A marketing site
// that describes an unmerged feature branch is making a claim an athlete who
// subscribes today cannot hold us to.
//
// Each flag was set by reading the Valhalla app repository, not by reading a
// brief about it. The evidence is recorded beside each one so the next person
// can re-check it rather than trust this comment.
export const PRODUCT_CLAIMS = {
  /**
   * ADAPTIVE RACE COACHING — TRUE ON THE APP'S MAIN BRANCH.
   *
   * Execution Review, Plan Evolution, Next Move and athlete-state reasoning
   * are all present in api/ and protected/ on main. This is the product an
   * athlete gets today, and the website may describe it in the present tense.
   */
  adaptiveCoaching: true,

  /**
   * YEAR-ROUND — NOW SHIPPED, AND RE-VERIFIED BEFORE FLIPPING.
   *
   * This was false because the lifecycle lived on an unmerged branch. It has
   * since reached the app's main, and the flip was made only after checking
   * the app rather than on the strength of being told. On app main 87587b4:
   * "Maintain & Protect", "Aerobic Base", "Race Goal" and "Measured Fitness"
   * are all present, where every one of them returned zero files on the
   * previous main (7578494).
   *
   * ONE CLAIM WAS CHECKED PARTICULARLY CAREFULLY, because getting it wrong
   * was the earlier risk: the copy must not imply Valhalla moves an athlete
   * between phases on its own. The app is explicit that it does not —
   * "ATHLETE DECIDES", and "the athlete chooses, and choosing nothing is a
   * legitimate answer" — so the website says the athlete chooses too.
   */
  yearRoundCoaching: true,

  /**
   * THE LEARNING PROPOSITION — the primary hook, and substantiated on app
   * main 87587b4 rather than asserted: response modelling across session
   * families, recovery-pattern and volume-tolerance learning, measured
   * performances and a longitudinal athlete record all exist there.
   *
   * What this flag does NOT license, and the copy does not say: that the
   * product knows everything about an athlete, understands them medically,
   * guarantees a performance, replaces a human coach, or is the only adaptive
   * running product. Those are the claims to keep out.
   */
  learningProgramme: true,

  /**
   * GARMIN — GATED IN THE APP, SO GATED HERE.
   *
   * api/_garmin.js reads `enabled: env('VVV_GARMIN_ENABLED') === '1'`, so the
   * integration is off unless a deployment explicitly switches it on, and the
   * developer application is not complete. The site must not imply a live
   * Garmin connection. If it is mentioned at all it is as planned, and that is
   * a decision for HQ rather than a default.
   */
  garminIntegration: false,

  /**
   * STRAVA — TRUE. The most established integration in the app by some
   * distance: authorisation, sync, webhook and admin surfaces all on main.
   */
  stravaIntegration: true,
} as const;
