import BUILDER_SPEC from "./vendor/builder-spec.js";

// THE APP'S OWN ENTRY POINT, READ FROM THE APP'S OWN SPECIFICATION.
//
// Founder: "The build a plan needs to be the same as the app! Exactly same
// entry point build. Copy the apps into this route."
//
// WHAT /start USED TO BE. A marketing page: a Cinzel headline, a paragraph,
// two read-only price cards and a button that left for the app. It described
// building a plan. The app's /start IS the builder — an eleven-stage wizard
// that opens on an orientation screen with a progress rail. Two different
// objects wearing the same name, which is what the founder was looking at.
//
// WHAT MOVED, AND WHY ONLY THIS MUCH. Stage 01 OVERVIEW moved here whole. The
// app's own specification is explicit that it can: "OVERVIEW is a pure
// orientation screen -- no field, no validation, nothing handleGeneratePlan()
// reads." It collects nothing, so hosting it on this origin loses nothing.
//
// STAGES 02-11 CANNOT MOVE, and this is a fact about the app rather than a
// preference about the website. The app banks an athlete's answers in
// localStorage under 'vvv_pending_build' on its own origin, and its /start
// reads the query string for exactly one thing — magic-link auth errors
// (consumeAuthError()). There is no parameter, no POST target and no shared
// storage by which a questionnaire on velvetviking.co.uk could hand eleven
// answers to app.velvetviking.co.uk. A copy of the questions here would end
// with the athlete answering all of them a second time, which is worse than
// not copying them. Making it possible means changes inside the app — an
// inbound answer format, and CORS on /api/preview — which is SYSTEM's repo.
//
// SO THE SEAM IS AT "CONTINUE", the one place in the whole builder where
// moving between surfaces costs nothing, because nothing has been typed yet.
//
// THE STAGE DATA IS NOT RETYPED. content/vendor/builder-spec.js is the app's
// assets/builder-spec.js, byte for byte. That file exists precisely so more
// than one surface can ask the same questions — "CONSUMED THREE WAYS, FROM
// ONE FILE, WITH NO COPY ANYWHERE" — and it is served publicly by the app for
// the same reason. Vendoring the file rather than copying the eleven stage
// names into a TypeScript literal means the rail's length, the stage's name
// and its heading and lede are the app's values, and a drift test can diff
// the two files instead of a human comparing prose.
//
// PROVENANCE. Vendored from velvet-viking-valhalla-2 at app commit
// 011d5dc; the spec file itself last changed in 39dd77a. test/builderEntry
// Parity.test.js re-diffs it against the app checkout whenever one is present
// beside this repo, and otherwise holds the shape this module depends on.

type Stage = { key: string; name: string; heading: string; lede: string };

const SPEC = BUILDER_SPEC as { stages: Stage[] };

/** All eleven stages, in the app's order. The rail's length is this length. */
export const builderStages: readonly Stage[] = SPEC.stages;

/** Stage 01. The one the app opens on, and now the one this route opens on. */
export const overviewStage: Stage = SPEC.stages[0];

// THE THREE ROWS ARE VENDORED BY HAND, because the app keeps them in markup
// rather than in the spec — renderOverviewStage() in start.html writes them
// inline, and the protected app writes the same three again in its own setup
// modal. They are already duplicated inside the app, so there is no single
// file to point at; these are start.html's copies, verbatim, curly
// apostrophe included. If the app's orientation copy changes, the parity test
// is what notices.
export const overviewRows: readonly { title: string; detail: string }[] = [
  {
    title: "Answer a few questions",
    detail: "We understand your running and what you’re aiming for.",
  },
  {
    title: "Sacoro builds your plan",
    detail: "Workouts, paces and progression are created for you.",
  },
  {
    title: "We adapt as you go",
    detail: "Log your runs and Sacoro gets smarter as the block progresses.",
  },
];

/** The app's own labels for the two controls on this screen. */
export const entryLabels = {
  continue: "Continue →",
  signIn: "Trained with Sacoro before? Sign in",
} as const;
