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
   * YEAR-ROUND COACHING — BUILT, BUT NOT SHIPPED. DO NOT FLIP WITHOUT CHECKING.
   *
   * The lifecycle beyond race day (post-race recovery, Maintain, Aerobic Base,
   * a next goal) lives on feature/year-round-coaching at 9a82431. It is real
   * code and it works, and it is NOT merged into the app's main: verified with
   * `git merge-base --is-ancestor`, which reports it is not an ancestor.
   *
   * On main the only blocks that exist are the four RACE-DISTANCE blocks —
   * Aerobic & Tempo, Endurance & Long Run, Speed & Threshold, Time-on-Feet &
   * Back-to-Back. "Speed & Threshold" in particular is a block chosen for 5K
   * and 10K races, not an off-season phase, so quoting it as evidence of
   * year-round coaching would be quoting it out of its own meaning.
   *
   * The copy is written and sits behind this flag. FLIP IT TO true THE DAY
   * feature/year-round-coaching MERGES TO THE APP'S MAIN, and not before: at
   * that point "Valhalla keeps coaching after race day" becomes a claim the
   * product can substantiate, which is the only test that matters.
   */
  yearRoundCoaching: false,

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
