// Central content configuration for the Velvet Viking website.
//
// Layout/visual components read from here rather than hard-coding copy,
// image paths, alt text or nav labels, so future content edits are a data
// change, not a template change. Bracketed strings are deliberate
// placeholder positions, not filler — see PlaceholderMedia / the
// `placeholder` fields for how they render.

// THE PRODUCTION ORIGIN, IN ONE PLACE.
//
// This was a string literal in both layout.tsx and sitemap.ts, and both still
// read velvet-viking-website-preview.vercel.app long after the site had a real
// domain — which is how the canonical URL, the Open Graph URL and every sitemap
// entry came to point search engines and social crawlers at a preview
// deployment. Two copies of one fact is what let it go stale twice, so there is
// now one copy, and a test fails if a vercel.app host reappears in either file.
//
// PUBLIC ORIGIN ONLY. The Valhalla app is a separate deployment on its own
// Vercel hostname; that link further down this file is a genuine deployment URL
// rather than a stale preview reference, and must stay exactly as it is.
export const siteUrl = "https://velvetviking.co.uk";

// THE CANONICAL APP ENTRY, IN ONE PLACE.
//
// The website is the shop window; the Valhalla app owns everything behind it —
// account, plan builder, preview, trial. Every acquisition CTA that leaves this
// site for the product lands here, and it is written down once for exactly the
// reason siteUrl is: the previous app URL was a raw Vercel hostname pasted into
// content, and a second copy is how the first one goes stale unnoticed.
//
// Separate from betaAccess.cta below on purpose. That one is the private beta's
// own door on the app's /get, still used by the existing invited testers, and
// it is NOT retired here — retiring it is HQ's call, not a side effect of
// pointing the public CTAs at the front door.
export const appUrl = "https://app.velvetviking.co.uk/start";

export const brand = {
  name: "Velvet Viking",
  product: "Valhalla",
  tagline: "Valhalla Awaits",
  motto: "Earn Your Place",
  crestAlt: "The Velvet Viking crest",
} as const;

export const nav = {
  links: [
    { label: "Valhalla", href: "/valhalla" },
    // GALLERY: MobileNav relabels "Valhalla" -> "Valhalla App" for display
    // only; this array is also the source for Header's <noscript> fallback
    // nav, so adding Gallery here (rather than hard-coding it into either
    // component separately) keeps both surfaces in sync automatically.
    { label: "Gallery", href: "/gallery" },
    { label: "Pricing", href: "/pricing" },
    { label: "Philosophy", href: "/philosophy" },
    { label: "About", href: "/about" },
  ],
  cta: { label: "Explore Valhalla", href: "/valhalla" },
  // Secondary utility action, not a brand destination — kept out of `links`
  // so MobileNav can render it visually distinct (quiet, not display type).
  // href is filled in once commerceSeams.signIn (content/commerce.ts) is
  // live; MobileNav renders this exact label as the CtaButton pending
  // state until then.
  signIn: { label: "Sign In" },
} as const;

export const hero = {
  // PROTOTYPE NOTE: was "Velvet Viking". The crest above already states
  // "Velvet Viking" (it's baked into the artwork), so the eyebrow becomes
  // "The Flagship" instead — reusing valhallaProduct.eyebrow's own exact
  // wording, not new copy — so this eyebrow now reads as introducing
  // Valhalla as a product noun ("The Flagship / Valhalla Awaits.") rather
  // than repeating the brand name a second time in the same viewport.
  // heading/sub/cta below are unchanged and remain protected verbatim.
  eyebrow: "The Flagship",
  // FINAL TYPOGRAPHY CONSISTENCY CHANGE: supersedes the earlier "internal
  // periods stay" rule for this specific set of major display headlines —
  // no full stop anywhere in this heading now, internal or terminal.
  heading: ["Valhalla Awaits", "Earn Your Place"],
  // HUMAN COPY PASS: the dash after "pays attention" severed the verb from
  // its own complement and did no grammatical work. layout.tsx's meta
  // description had ALREADY been written without it, so the two surfaces
  // now state the same sentence identically instead of differing by a
  // stray mark on the site's most-read line. Wording is otherwise
  // untouched; "actually" is kept here because it carries the real
  // contrast against "what was planned".
  // POSITIONING PASS: "Endurance coaching that pays attention…" became
  // "Endurance training…". One word, because the rest of this line is
  // already doing the right job: it describes a behaviour (paying
  // attention to what happened rather than what was scheduled) instead of
  // claiming a credential. "Training" is the honest category noun — it is
  // what the athlete does and what the product plans — where "coaching"
  // implied a qualified person behind it. layout.tsx's meta and Open Graph
  // descriptions carry the same sentence and were changed identically, so
  // the two surfaces still match exactly.
  sub: "Endurance training that pays attention to what you actually do, not just what was planned.",
  cta: { label: "Explore Valhalla", href: "/valhalla" },
  media: {
    placeholder: "[HERO PHOTOGRAPH]",
    alt: "[HERO PHOTOGRAPH — athlete in training, environment to be confirmed]",
  },
} as const;

export const brandStory = {
  eyebrow: "Velvet Viking",
  // FINAL TYPOGRAPHY CONSISTENCY CHANGE: no full stop anywhere in this
  // heading now — see the matching note on hero.heading above.
  heading: ["Performance isn’t given", "It’s built"],
  body: "Not punishment. Not luck. Progress comes from showing up, doing the right work, and knowing when to push and when to recover.",
  media: {
    placeholder: "[ATHLETE / TRAINING PHOTOGRAPH]",
    alt: "[ATHLETE / TRAINING PHOTOGRAPH — placeholder]",
  },
} as const;

export const valhallaProduct = {
  eyebrow: "The Flagship",
  heading: "Valhalla",
  // POSITIONING PASS: was "Endurance coaching that reads your training,
  // not just your calendar." Deliberately NOT resolved the same way as
  // hero.sub above — repeating "Endurance training that…" twice on one
  // scroll would be a mechanical find-and-replace rather than an edit.
  // Dropping the category noun altogether leaves the verb doing the work,
  // which is the whole point: what Valhalla does is read. This string is
  // also pages.valhalla.sub, so it is the /valhalla page subheading and
  // that route's meta description as well — it reads correctly under the
  // "Valhalla" heading that precedes it in all three places.
  sub: "Reads your training, not just your calendar.",
  // COPY AUDIT: was "...Valhalla pays attention to what you actually do,
  // and helps you understand what that means for what comes next." — a
  // near-duplicate of hero.sub one scroll later. Rewritten to state the
  // actual differentiator (waits for a pattern, explains why, athlete
  // decides) as this section's lead sentence, so it reads as a headline
  // claim before the "Adaptation with purpose" point below elaborates on
  // it — not just a third repeated variant of "pays attention."
  // HUMAN COPY PASS: a dash placed before a coordinating "and" is one of the
  // most recognisable machine-writing tics, and it was doing nothing a
  // reader could hear. Deleted outright rather than swapped for another
  // mark. "actually" also dropped from "what actually happens" — the
  // sentence is unchanged in meaning without it, and the word appeared ten
  // times across the site.
  body: "A training plan shouldn’t go stale the moment real training starts. Valhalla watches what happens and waits for a real pattern before it changes anything. When a change is genuinely justified, it tells you why, and you decide whether to take it.",
  points: [
    {
      heading: "Training built around you",
      body: "Your fitness, training zones, race target and available days shape the plan from day one, down to the paces and effort that are right for you.",
    },
    {
      heading: "Adaptation with purpose",
      // PHASE 2 AUDIT: previously re-narrated the section body's restraint
      // logic almost verbatim ("one tough session doesn't change anything…
      // you decide whether to take it") in the very next scroll position.
      // Reweighted to the one facet the body states but doesn't elaborate —
      // that the reason is visible — instead of repeating the threshold.
      // HUMAN COPY PASS: the clause after the dash restated the clause
      // before it, negated ("comes with the pattern" / "never a change
      // without a reason"). Restatement-by-inversion is a machine-writing
      // signature, and this one also duplicated commerce.ts's own
      // "Explains why, every time" feature. Cut rather than repunctuated:
      // the first clause already says all of it.
      body: "Every proposed adjustment comes with the pattern behind it.",
    },
    {
      // POSITIONING PASS: was "Coaching, not just data" — the most direct
      // coach claim in the product copy, and the one a visitor was most
      // likely to read as "you are buying a coach". Keeps the original's
      // "X, not just Y" shape and its contrast with raw numbers, but the
      // thing being promised is now the behaviour the body goes on to
      // describe: the session is read, not merely logged.
      heading: "Read, not just recorded",
      // HUMAN COPY PASS: was a dash plus the "not X, but Y" frame in one
      // sentence. Removing only the dash would have left the giveaway
      // construction, so the contrast is now carried by an ordinary
      // "rather than" and the sentence keeps the same claim.
      body: "Pace, heart rate, effort and execution are read together, as one picture of how a session went rather than four separate charts.",
    },
  ],
  cta: { label: "Explore Valhalla", href: "/valhalla" },
  // PROTOTYPE: both slots are now portrait/phone-first — Valhalla has no
  // desktop app to screenshot. `primary` is Next Move/Plan Evolution (the
  // dominant, foregrounded frame); `secondary` is Execution Review (the
  // smaller, offset frame). Renamed from desktop/mobile.
  // REAL-IMAGERY PASS: real screenshots, so alt text now describes what the
  // screen actually is rather than an aspirational placeholder concept —
  // "Today" (Next Move + Pace Reference) and "Full Plan" (the block/week
  // structure), not the previous "Execution Review" placeholder, which
  // isn't the screen supplied.
  screenshots: {
    primary: {
      src: "/photography/app-today.jpg",
      placeholder: "[VALHALLA — TODAY]",
      alt: "Valhalla’s Today screen: the day’s Next Move card and pace reference table",
    },
    secondary: {
      src: "/photography/app-full-plan.jpg",
      placeholder: "[VALHALLA — FULL PLAN]",
      alt: "Valhalla’s Full Plan screen: the training block broken into weeks and phases",
    },
  },
} as const;

// RESTORED: an intentional, permanent seam for a future real Velvet Viking
// reel — not an accidental unfinished box. Deliberately kept even after the
// zero-placeholder pass elsewhere on the homepage; see DocumentaryReel.tsx.
export const documentaryReel = {
  media: {
    placeholder: "[DOCUMENTARY REEL — placeholder]",
    alt: "[DOCUMENTARY REEL — placeholder, opening motion piece, footage to be confirmed]",
  },
} as const;

export const fullWidthPhoto = {
  media: {
    placeholder: "[CAMPAIGN PHOTOGRAPH]",
    alt: "[CAMPAIGN PHOTOGRAPH — full-width training/environment moment, placeholder]",
  },
  caption: "Consistency Compounds",
} as const;

// REAL-IMAGERY PREVIEW: replaces fullWidthPhoto in this exact homepage slot
// (see RaceBreak.tsx for why it isn't force-cropped the same way) — kept as
// a distinct export rather than overwriting fullWidthPhoto above, since
// that placeholder config is still correct for whatever eventually fills
// that slot if this preview isn't shipped.
export const raceBreak = {
  media: {
    src: "/photography/race-finish.jpg",
    alt: "Dan running a marathon, arms out, cheered on by the crowd",
  },
  caption: "Consistency Compounds",
} as const;

// REAL-IMAGERY PREVIEW: concise provenance, not a biography — see
// Provenance.tsx. No race time, placing, or count of marathons is claimed;
// none of that is established anywhere in this repository, and the brief
// for this pass is explicit that nothing should be invented.
export const provenance = {
  eyebrow: "Velvet Viking",
  // FINAL TYPOGRAPHY CONSISTENCY CHANGE: no full stop anywhere in this
  // heading now — see the matching note on hero.heading above.
  heading: ["Built by a runner", "For runners"],
  // HUMAN COPY PASS: this is the ONE em dash deliberately retained in body
  // copy site-wide. It introduces a genuine appositive afterthought in
  // spoken rhythm ("after enough of those — plans that…"), which a colon
  // would make more formal and a comma would make ambiguous. Keeping one
  // considered dash is what stops the copy reading as mechanically
  // de-dashed; the other twenty-two were habit, this one is a choice.
  body: "A training plan that doesn’t adapt to real life isn’t much of a plan. Dan built Valhalla after enough of those — plans that looked perfect on paper and fell apart the moment an actual week got in the way.",
  media: {
    src: "/photography/founder-medal.jpg",
    alt: "Dan holding his marathon finisher’s medal, smiling",
  },
} as const;

// REAL-IMAGERY PREVIEW / EDITORIAL TRAVEL GRID: the finished "Work Travels"
// creative is one flat composite (headline band + temple + map baked into
// a single file) — see WorkTravels.tsx for how the hero crops that same
// file to its top band via CSS object-position rather than a separate
// file, while temple and map are real, unaltered sub-crops saved as their
// own files (object-fit alone can't isolate an arbitrary interior
// rectangle of a source image, only a full-width or full-height slice).
// Mobile keeps its own dedicated headline crop for text legibility at
// narrow widths — a wide crop shrunk to 390px reads as illegible, not
// just smaller.
export const workTravels = {
  desktop: { src: "/photography/work-travels-with-you.jpg" },
  mobile: {
    headline: "/photography/work-travels-mobile-headline.jpg",
  },
  // The dash here is NOT ours to remove: this alt text transcribes the
  // headline physically baked into the supplied composite artwork. Editing
  // it would make the alt text stop describing the image.
  alt: "The Work Travels With You — different place, same purpose. You don’t need perfect conditions, you need consistency. Earn Your Place.",
  heroLocation: "Athens, Greece",
  temple: {
    src: "/photography/work-travels-temple.jpg",
    alt: "A gilded Buddha shrine at a temple in Koh Samui, Thailand, with Dan smiling in front of it",
    location: "Koh Samui, Thailand",
  },
  map: {
    src: "/photography/work-travels-map.jpg",
    alt: "A GPS running route traced along the coastline of Koh Tao, Thailand",
    location: "Koh Tao, Thailand",
  },
} as const;

// RESTORED, NOW POPULATED: the three-slot gallery composition is approved
// as part of the visual architecture. All three slots now carry real,
// unaltered photographs — a uniform "portrait" aspect across all three per
// the brief's "equal visual slots, consistent dimensions" instruction
// (previously varied portrait/square/landscape while empty). Each
// objectPosition is tuned per source photo so a runner's head is never
// clipped by the crop — see PlaceholderMedia's objectPosition prop.
export const earnYourPlace = {
  eyebrow: "Velvet Viking",
  heading: "Earn Your Place",
  body: "Not through one perfect session. Through the work you return to, again and again, with purpose.",
  media: {
    placeholder: "[ATHLETE / TRAINING PHOTOGRAPH]",
    alt: "[ATHLETE / TRAINING PHOTOGRAPH — placeholder]",
  },
  // FINAL POLISH — CAPTION/PHOTO SEMANTIC CORRECTION: the mountain trail
  // shot is the one image with genuine, legible environmental context (a
  // wide valley backdrop) — the two race photos are both close, blurred-
  // background effort shots with little sense of place between them, so
  // "The Environment" belongs on the trail photo, not either race photo.
  // Of the two race photos, the grey-shirt shot (mid-stride, visible
  // strain) reads as the grind in progress — "The Work" — while the
  // orange-shirt finish-line shot reads more as a composed portrait of
  // the athlete himself — "The Athlete".
  gallery: [
    {
      placeholder: "[TRAINING MOMENT]",
      src: "/photography/earn-your-place-training-moment.jpg",
      alt: "Dan on a mountain trail, pack on, overlooking a wide valley",
      caption: "The Environment",
      aspect: "portrait",
      objectPosition: "center 25%",
    },
    {
      placeholder: "[ATHLETE DETAIL]",
      src: "/photography/earn-your-place-athlete-detail.jpg",
      alt: "Dan mid-stride at a road race, bib 2268",
      caption: "The Work",
      aspect: "portrait",
      objectPosition: "center 0%",
    },
    {
      placeholder: "[ENVIRONMENT]",
      src: "/photography/earn-your-place-environment.jpg",
      alt: "Dan mid-stride finishing a road race, bib 2345",
      caption: "The Athlete",
      aspect: "portrait",
      objectPosition: "center 0%",
    },
  ],
} as const;

// THE YEAR-ROUND STORY. Written, and deliberately not published: it renders
// only while PRODUCT_CLAIMS.yearRoundCoaching is true, and that flag is false
// because the feature is on an unmerged app branch. See productClaims.ts for
// the evidence and for the one condition that should flip it.
//
// Five stages, not a feature matrix. Each names a moment an athlete already
// recognises from their own year, and says what Valhalla does in it — the
// point being that the fifth stage loops back to the first, which is the whole
// argument. No feature names, because an athlete does not buy "Plan Evolution",
// they buy not having to work out what to do in January.
export const yearRound = {
  eyebrow: "Beyond Race Day",
  heading: ["A race is a milestone", "Not the finish"],
  body: "Most plans end when the race does, and leave you to work out the rest of the year on your own. Valhalla keeps going.",
  stages: [
    { label: "Race Build", body: "The block that gets you to the start line ready." },
    { label: "Race", body: "The day itself, with the taper behind it." },
    { label: "Recovery", body: "Real recovery afterwards, prescribed rather than guessed." },
    { label: "Base & Speed", body: "Aerobic base and honest speed work, holding the fitness you just earned." },
    { label: "Next Goal", body: "When the next race appears, you start from where you actually are." },
  ],
} as const;

export const futureWorld = {
  eyebrow: "Beyond Valhalla",
  // FINAL TYPOGRAPHY CONSISTENCY CHANGE: no full stop anywhere in this
  // heading now — see the matching note on hero.heading above.
  heading: ["One philosophy", "Different expressions"],
  // HUMAN COPY PASS: dropped the abstract trio "purpose, performance and
  // refinement" — three nouns that named nothing checkable and made this
  // the vaguest passage on the homepage. "The same standards" still points
  // at Philosophy and About, which is where the standard is actually
  // stated. Nothing factual is lost; the sentence is eleven words shorter.
  body: "Velvet Viking begins with Valhalla, but it isn’t defined by a single product. The same standards will shape everything that carries the name.",
  // Deliberately framed as direction, not a product list — none of these
  // exist yet. The kicker label above the words in FutureWorld.tsx exists
  // specifically so this can't be misread as an active business structure.
  categoriesKicker: "Where the philosophy could go next",
  categories: ["Performance", "Apparel", "Training", "Community"],
} as const;

export const finalCta = {
  heading: "Valhalla Awaits",
  // POSITIONING PASS: "Neither should your coaching." -> "your plan."
  // One word, and the sentence gets stronger rather than weaker: the
  // contrast the line wants is with a plan that stands still, which is
  // exactly the second half of the claim boundary (not a coach, but not a
  // static downloadable plan either). Rhythm and length unchanged.
  sub: "Training doesn’t stand still. Neither should your plan.",
  // PHASE 3: was { label: "Explore Valhalla", href: "/valhalla" } — the
  // homepage's own Hero and ProductShowcase CTAs already send readers to
  // /valhalla twice before this section. As the page's final, bottom-of-
  // scroll moment, this is the "ready to commit" beat — the one CTA graph
  // dead end the Phase 2 audit flagged now resolves forward into the
  // commercial entry point instead of back to a page already reached.
  cta: { label: "See Standard Pricing", href: "/pricing" },
} as const;

export const footer = {
  tagline: "Earn Your Place",
  // Nullable on purpose — no real accounts exist yet. All four platforms
  // are always visually present (SocialLinks renders an inactive mark for
  // a null URL, not nothing), so the row's design can be finished ahead of
  // the accounts existing. Add a URL here when one goes live; that single
  // platform becomes a real link automatically, no other code change
  // required. Leave a platform null indefinitely if it's never used — it
  // stays visible but inactive, never a fake link.
  social: {
    instagram: null as string | null,
    strava: null as string | null,
    youtube: null as string | null,
    tiktok: null as string | null,
  },
  // Public legal footer links moved to publicLegalLinks in @/content/legal —
  // derived from each document's own LEGAL_APPROVALS gate rather than a
  // static list here, so Terms/Cookies appear automatically once approved
  // instead of requiring someone to remember this array.
  legalLine: "© " + new Date().getFullYear().toString() + " Velvet Viking. All rights reserved.",
} as const;

// FIVE-PERSON PRIVATE BETA: the current, authoritative Valhalla access/
// download page — owned entirely by the app repo, not this one. The
// website is only ever a doorway to it, never a second download surface;
// the app's own Supabase beta gate remains the sole authority on who can
// actually sign in from there. Real and working today — unlike
// commerceSeams in content/commerce.ts, this isn't gated behind an
// unapproved backend contract, so it isn't nullable. Deliberately absent
// from primary nav/hero — reachable only by following the existing trial
// journey to /start, so it isn't presented as a public, open invitation.
export const betaAccess = {
  eyebrow: "Private Beta",
  body: "Already invited to the private beta?",
  cta: { label: "Continue to Valhalla", href: "https://velvet-viking-valhalla-1.vercel.app/get" },
} as const;

export const pages = {
  pricing: {
    eyebrow: "Standard",
    heading: "Pricing",
    // HUMAN COPY PASS: "coaching core" was product-team vocabulary, not
    // customer vocabulary, and it appeared twice inside one viewport (here
    // and again as the plan tagline in commerce.ts). Both are now plain
    // English, and deliberately different from each other. The body's dash
    // was standing in for a full stop, so it became one.
    sub: "One plan. Everything Valhalla does.",
    body: "No tiers to compare, nothing held back for later. Standard is Valhalla, in full.",
  },
  // BILLING PREFERENCE STEP — the page the pricing CTA now lands on, sitting
  // between /pricing and /start. Its whole job is one choice: how Standard
  // continues once the free trial ends. Eyebrow is "Standard" rather than
  // "Velvet Viking" to match /pricing and /start, the two pages either side
  // of it in this journey, so the eyebrow keeps reading as "which plan am I
  // in" all the way down the funnel.
  //
  // Deliberately says nothing comparative about the two periods. No savings
  // figure, no effective monthly rate, no recommendation — the same rule the
  // pricing card follows, for the same reason.
  trial: {
    eyebrow: "Standard",
    heading: "Start Your Free Trial",
    sub: "14 days of the whole of Valhalla.",
    body: "Choose how you'd like to continue when the trial ends. The trial itself is the same either way.",
  },
  start: {
    eyebrow: "Standard",
    // HEADING ONLY. Was "Start Your Trial", which stopped being accurate the
    // moment /trial went in front of this page: the trial is started there,
    // and what happens here is the account. It also collided with /trial's
    // own "Start Your Free Trial" one click earlier, so arriving via a button
    // labelled "Continue to Account" landed on a heading that read like the
    // previous step repeated. Everything else on this page — the eyebrow,
    // sub, body, the four journey steps, the not-live notice, the CTAs and
    // the private beta entry below them — is deliberately untouched.
    heading: "Create Your Account",
    sub: "Here’s exactly what happens next.",
    // HUMAN COPY PASS: "the journey as it's designed to work" — "journey"
    // was the one piece of soft marketing jargon on the site, and it meant
    // nothing more than "the signup steps".
    body: "Trial signup isn’t open yet. This is how it will work, and it’ll go live here the moment it’s real.",
  },
  valhalla: {
    eyebrow: valhallaProduct.eyebrow,
    heading: valhallaProduct.heading,
    sub: valhallaProduct.sub,
    body: "A closer look at how Valhalla works.",
    // PHASE 3: this page previously had no closing action at all — after
    // the screenshots, the scroll just ended. That's the literal "dead
    // end" the Phase 2 audit flagged in the CTA graph. Now closes into the
    // commercial entry point instead of looping back to itself.
    closingCta: { label: "See Standard Pricing", href: "/pricing" },
    // Real product screenshots will eventually sit alongside this copy —
    // see the device mockups below it on this page. Nothing here describes
    // functionality beyond what the app genuinely does today.
    expanded: [
      // HUMAN COPY PASS: the dash was introducing a list, which is what a
      // colon is for. Straight character swap; wording untouched.
      // "actually" is kept in "the days you can actually train" — there it
      // carries a real contrast (days available in life, not days on a
      // calendar) rather than acting as filler.
      "Valhalla builds your plan from what’s true about you: your current fitness, a real benchmark performance, your race target and the days you can actually train. From there, it works out the paces and effort levels that make sense for your training, not generic ones.",
      // FINAL QA FIX PASS: was near-identical to valhallaProduct.body's own
      // closing ("waits for a real pattern... you decide whether to take
      // it") one scroll after the homepage already said it. Kept the
      // pattern-before-acting claim (it's true and belongs here too), but
      // deepened it with what an adjustment actually is — the pace/effort
      // target for the next session, not a rewritten plan — grounded in
      // valhallaProduct.points above, not a new claim. Closing reframed so
      // it advances the homepage's line instead of repeating it verbatim.
      // HUMAN COPY PASS: three em dashes and a colon inside 78 words made
      // this the second-densest passage on the site. Repunctuating alone
      // wouldn't have fixed it — the problem was four ideas welded into
      // three sentences — so it's now six shorter ones. Every claim is
      // carried over verbatim in substance, and the phrase
      // "the pace or effort target set for your next session, not a plan
      // rewritten from scratch" is preserved exactly (finalQaFixPass.test.js
      // asserts on it).
      "Once training starts, Valhalla pays attention. Every session is compared with what was planned: pace, heart rate, effort, execution. But a single hard day doesn’t change anything on its own. Only once a real pattern shows up does Valhalla act, and what changes is specific. It’s the pace or effort target set for your next session, not a plan rewritten from scratch. You see exactly what’s proposed and the reasoning behind it, and the choice to act on it is still yours.",
      // PHASE 4 AUDIT: two genuine gaps, not duplication — confirmed against
      // the app's real decision engine before writing this. (1) Every other
      // paragraph on this page frames "change" as something cautious/
      // downward ("waits", "one hard day doesn't change anything"); nothing
      // said Valhalla also recognises when training is going well and lets
      // it continue, or when recovery should outrank the schedule entirely
      // — both are real, evidence-gated outcomes, not aspirational. (2)
      // Nothing on the product-explanation pages said what happens to a
      // MISSED session — "doesn't chase missed-session debt" previously
      // only existed as a Pricing feature bullet, reached after a visitor
      // has already left "understand the product" behind. Stated here in
      // plain outcomes, no internal state names (no HOLD/PROGRESS/ADAPT/
      // RECOVER, no "Plan Evolution").
      // HUMAN COPY PASS: the densest passage on the site — one em dash,
      // the site's only semicolon and a colon inside 62 words. Now five
      // plain sentences with none of the three. No claim added, removed or
      // softened; "the training itself" lost "itself" as redundant.
      "A missed session doesn’t spiral into a rescue plan. The days worth rescheduling get another chance when the calendar allows it. The rest are simply left behind, because that protects the training, not a completion percentage. And a change isn’t automatically a step back. Valhalla knows when to hold the current plan, when to let progression continue, and when recovery matters more than the schedule.",
      // PHASE 2 AUDIT: was "It's a coach that's actually looking at it" —
      // flagged against Business's unearned-claim list ("coach-like",
      // "understands training"). Rewritten to keep the not-a-dashboard
      // contrast without asserting the product is a cognitive/coaching
      // agent — reuses "pays attention," already established in hero.sub,
      // rather than a new anthropomorphizing claim.
      // HUMAN COPY PASS: was "It isn't a dashboard of your data. It's built
      // to pay attention to it — and tell you only what actually matters."
      // Three problems in one short paragraph: the "X isn't Y, it's Z"
      // frame (used three times site-wide), a second dash-before-"and", and
      // a fourth "actually". Recast so the contrast with a dashboard is
      // still made — that positioning point is worth keeping — but stated
      // positively, about what each thing does, rather than as a denial.
      "A dashboard shows you everything. Valhalla reads your training and tells you only what matters.",
    ],
  },
  // GALLERY: a curated visual home, not a rehearsal of Valhalla/Philosophy/
  // About's own claims — see gallery.ts for the photographs themselves and
  // why each one was chosen. Copy stays minimal on purpose: the page's job
  // is to let the photography carry it.
  gallery: {
    eyebrow: "Velvet Viking",
    heading: "The Work, in Pictures",
    sub: "Training, racing and the places they happen.",
    body: "Real moments, not staged for a shoot.",
  },
  // SUPPORT: a stable public URL, required by the app stores, Garmin and
  // Stripe as much as by athletes. Copy stays plain and short — this is the
  // page someone opens when something has gone wrong, and brand voice matters
  // less there than being answered.
  support: {
    eyebrow: "Velvet Viking",
    heading: "Support",
    sub: "Something not working, or a question about your account?",
    body: "Write to us and a person will read it.",
  },
  philosophy: {
    eyebrow: "Velvet Viking",
    heading: "Earn Your Place",
    sub: "The philosophy behind the brand.",
    body: "Earn Your Place is not a slogan. It’s the standard everything else is built on.",
    // COPY AUDIT: paragraph 1 was trimmed — its back half ("showing up,
    // doing the right session on the right day, and letting progress come
    // from that, rather than from a single perfect effort") duplicated
    // Home's brandStory/earnYourPlace almost word for word. Kept the part
    // of this paragraph that's genuinely unique to Philosophy (motivation
    // — not proving anything to anyone else). Paragraph 2 drops the
    // trailing "— every time": an absolute claim the copy hadn't earned.
    expanded: [
      // HUMAN COPY PASS: dash to comma, no rewriting. This is the ONE
      // "isn't X, it's Y" construction deliberately kept of the three that
      // existed — here the denial is doing real work, pre-empting a genuine
      // misreading of Earn Your Place as an invitation to suffer. The other
      // two (on /valhalla and /about) were denials nobody needed and are
      // now positive statements.
      "Earn Your Place isn’t about suffering for its own sake, and it isn’t about proving something to anyone else. It’s about doing the right work on the right day, not chasing a single perfect effort.",
      // HUMAN COPY PASS: closing line was "Consistency, applied
      // intelligently, beats intensity applied carelessly." — a perfectly
      // mirrored aphorism (noun + adverbial participle, twice, with
      // antonyms in both slots) that read as generated rather than spoken.
      // Same claim, said the way someone would actually say it, and the
      // preceding two sentences already carry the "applied intelligently"
      // nuance.
      "That means knowing when to push. It also means knowing when to hold back, because recovery is part of the work, not a break from it. Consistency beats heroics.",
      "Valhalla exists to support that: to help you do the right work, understand what it’s telling you, and keep coming back to it.",
    ],
  },
  about: {
    eyebrow: "Velvet Viking",
    heading: "About",
    // HUMAN COPY PASS: was "A performance brand, built with intent." —
    // the vaguest line on the site, and the second thing a reader sees on
    // this page. "Built with intent" asserts nothing checkable. Replaced
    // with a plain statement of what the page contains, which is also what
    // the body below it goes on to say.
    sub: "What Velvet Viking is, and what it builds.",
    // COPY AUDIT: was "...that real progress comes from consistent,
    // intelligent work — not shortcuts, not hype..." — that's Philosophy's
    // thesis, restated here for roughly the sixth time site-wide. About's
    // job is the entity, not the training belief: what Velvet Viking is,
    // and its relationship to Valhalla.
    // POSITIONING PASS: "its endurance coaching product" -> "its endurance
    // training app". Factual and already established elsewhere on the site
    // (MobileNav labels it "Valhalla App"; /start explains installing the
    // app on your phone), so this names the thing rather than implying a
    // service staffed by coaches. "first thing it has built" is preserved
    // verbatim — finalQaFixPass.test.js asserts that fact appears exactly
    // once in this block.
    body: "Velvet Viking is a performance brand. Valhalla, its endurance training app, is the first thing it has built.",
    // No founder/origin story: the repository holds no factual basis for
    // one, and inventing personal history is explicitly out of scope for
    // this pass. This page states only what's actually true.
    //
    // COPY AUDIT: the previous line here ("...The same standards —
    // purpose, performance, refinement — will apply to whatever Velvet
    // Viking builds next.") was a near-duplicate of FutureWorld's own
    // sentence on the homepage. FutureWorld already owns that forward-
    // looking claim; this one stays about the Valhalla/Velvet Viking
    // relationship instead.
    // FINAL QA FIX PASS: was "Valhalla is not a side project. It is Velvet
    // Viking's first product..." — restating body's own "first product"
    // fact a second time, back-to-back, on a two-sentence page. body keeps
    // that fact as the page's one statement of it; this reframes toward
    // the standard behind it instead, drawing on Philosophy's own
    // established language ("the standard everything else is built on")
    // rather than inventing a new claim.
    expanded: [
      // HUMAN COPY PASS: was "Earn Your Place isn't a marketing line here —
      // it's the bar every decision at Velvet Viking has to clear before it
      // ships." The "X isn't Y — it's Z" frame is the single most
      // recognisable machine-writing shape, and the denial pre-empted a
      // doubt no reader had yet. The positive half was always the sentence.
      "Earn Your Place is the bar every decision at Velvet Viking has to clear before it ships.",
    ],
  },
} as const;
