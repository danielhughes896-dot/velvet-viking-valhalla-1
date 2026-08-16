// Central content configuration for the Velvet Viking website.
//
// Layout/visual components read from here rather than hard-coding copy,
// image paths, alt text or nav labels, so future content edits are a data
// change, not a template change. Bracketed strings are deliberate
// placeholder positions, not filler — see PlaceholderMedia / the
// `placeholder` fields for how they render.

export const brand = {
  name: "Velvet Viking",
  product: "Valhalla",
  tagline: "Valhalla Awaits.",
  motto: "Earn Your Place.",
  crestAlt: "The Velvet Viking crest",
} as const;

export const nav = {
  links: [
    { label: "Valhalla", href: "/valhalla" },
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
  heading: ["Valhalla Awaits.", "Earn Your Place."],
  sub: "Endurance coaching that pays attention — to what you actually do, not just what was planned.",
  cta: { label: "Explore Valhalla", href: "/valhalla" },
  media: {
    placeholder: "[HERO PHOTOGRAPH]",
    alt: "[HERO PHOTOGRAPH — athlete in training, environment to be confirmed]",
  },
} as const;

export const brandStory = {
  eyebrow: "Velvet Viking",
  heading: ["Performance isn't given.", "It's built."],
  body: "Not punishment. Not luck. Progress comes from showing up, doing the right work, and knowing when to push and when to recover.",
  media: {
    placeholder: "[ATHLETE / TRAINING PHOTOGRAPH]",
    alt: "[ATHLETE / TRAINING PHOTOGRAPH — placeholder]",
  },
} as const;

export const valhallaProduct = {
  eyebrow: "The Flagship",
  heading: "Valhalla",
  sub: "Endurance coaching that reads your training, not just your calendar.",
  // COPY AUDIT: was "...Valhalla pays attention to what you actually do,
  // and helps you understand what that means for what comes next." — a
  // near-duplicate of hero.sub one scroll later. Rewritten to state the
  // actual differentiator (waits for a pattern, explains why, athlete
  // decides) as this section's lead sentence, so it reads as a headline
  // claim before the "Adaptation with purpose" point below elaborates on
  // it — not just a third repeated variant of "pays attention."
  body: "A training plan shouldn't go stale the moment real training starts. Valhalla watches what actually happens — and waits for a real pattern before it changes anything. When a change is genuinely justified, it tells you why, and you decide whether to take it.",
  points: [
    {
      heading: "Training built around you",
      body: "Your fitness, training zones, race target and available days shape the plan from day one — down to the paces and effort that are actually right for you.",
    },
    {
      heading: "Adaptation with purpose",
      // PHASE 2 AUDIT: previously re-narrated the section body's restraint
      // logic almost verbatim ("one tough session doesn't change anything…
      // you decide whether to take it") in the very next scroll position.
      // Reweighted to the one facet the body states but doesn't elaborate —
      // that the reason is visible — instead of repeating the threshold.
      body: "Every proposed adjustment comes with the pattern behind it — never a change without a reason you can see.",
    },
    {
      heading: "Coaching, not just data",
      body: "Pace, heart rate, effort and execution are read together — not as separate charts, but as one picture of how a session actually went.",
    },
  ],
  cta: { label: "Explore Valhalla", href: "/valhalla" },
  // PROTOTYPE: both slots are now portrait/phone-first — Valhalla has no
  // desktop app to screenshot. `primary` is Next Move/Plan Evolution (the
  // dominant, foregrounded frame); `secondary` is Execution Review (the
  // smaller, offset frame). Renamed from desktop/mobile.
  screenshots: {
    primary: {
      placeholder: "[VALHALLA — NEXT MOVE / PLAN EVOLUTION]",
      alt: "[VALHALLA SCREENSHOT — Next Move / Plan Evolution, placeholder]",
    },
    secondary: {
      placeholder: "[VALHALLA — EXECUTION REVIEW]",
      alt: "[VALHALLA SCREENSHOT — Execution Review, placeholder]",
    },
  },
} as const;

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
  caption: "Consistency Compounds.",
} as const;

export const earnYourPlace = {
  eyebrow: "Velvet Viking",
  heading: "Earn Your Place.",
  body: "Not through one perfect session. Through the work you return to, again and again, with purpose.",
  media: {
    placeholder: "[ATHLETE / TRAINING PHOTOGRAPH]",
    alt: "[ATHLETE / TRAINING PHOTOGRAPH — placeholder]",
  },
  // Slots for a future horizontal gallery of training moments — "the work
  // you return to, again and again" reads more naturally as several images
  // than one. Each is a placeholder position, not a real photograph; swap
  // labels for real alt text/src when photography exists, no layout change
  // required.
  gallery: [
    { placeholder: "[TRAINING MOMENT]", alt: "[TRAINING MOMENT — placeholder]", aspect: "portrait" },
    { placeholder: "[ATHLETE DETAIL]", alt: "[ATHLETE DETAIL — placeholder]", aspect: "square" },
    { placeholder: "[ENVIRONMENT]", alt: "[ENVIRONMENT — placeholder]", aspect: "landscape" },
  ],
} as const;

export const futureWorld = {
  eyebrow: "Beyond Valhalla",
  heading: ["One philosophy.", "Different expressions."],
  body: "Velvet Viking begins with Valhalla, but it isn't defined by a single product. The same standards of purpose, performance and refinement will shape everything that carries the name.",
  // Deliberately framed as direction, not a product list — none of these
  // exist yet. The kicker label above the words in FutureWorld.tsx exists
  // specifically so this can't be misread as an active business structure.
  categoriesKicker: "Where the philosophy could go next",
  categories: ["Performance", "Apparel", "Training", "Community"],
} as const;

export const finalCta = {
  heading: "Valhalla Awaits.",
  sub: "Training doesn't stand still. Neither should your coaching.",
  // PHASE 3: was { label: "Explore Valhalla", href: "/valhalla" } — the
  // homepage's own Hero and ProductShowcase CTAs already send readers to
  // /valhalla twice before this section. As the page's final, bottom-of-
  // scroll moment, this is the "ready to commit" beat — the one CTA graph
  // dead end the Phase 2 audit flagged now resolves forward into the
  // commercial entry point instead of back to a page already reached.
  cta: { label: "See Standard Pricing", href: "/pricing" },
} as const;

export const footer = {
  tagline: "Earn Your Place.",
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
  legalLinks: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
  ],
  legalLine: "© " + new Date().getFullYear().toString() + " Velvet Viking. All rights reserved.",
} as const;

export const pages = {
  pricing: {
    eyebrow: "Standard",
    heading: "Pricing",
    sub: "One plan. The full Valhalla coaching core.",
    body: "No tiers to compare and nothing held back for later — Standard is Valhalla, in full.",
  },
  start: {
    eyebrow: "Standard",
    heading: "Start Your Trial",
    sub: "Here's exactly what happens next.",
    body: "Trial signup isn't open yet. This is the journey as it's designed to work, and it'll go live here the moment it's real.",
  },
  valhalla: {
    eyebrow: valhallaProduct.eyebrow,
    heading: valhallaProduct.heading,
    sub: valhallaProduct.sub,
    body: "A closer look at how Valhalla actually works.",
    // PHASE 3: this page previously had no closing action at all — after
    // the screenshots, the scroll just ended. That's the literal "dead
    // end" the Phase 2 audit flagged in the CTA graph. Now closes into the
    // commercial entry point instead of looping back to itself.
    closingCta: { label: "See Standard Pricing", href: "/pricing" },
    // Real product screenshots will eventually sit alongside this copy —
    // see the device mockups below it on this page. Nothing here describes
    // functionality beyond what the app genuinely does today.
    expanded: [
      "Valhalla builds your plan from what's true about you — your current fitness, a real benchmark performance, your race target and the days you can actually train. From there, it works out the paces and effort levels that make sense for your training, not generic ones.",
      "Once training starts, Valhalla pays attention. Every session is compared with what was planned — pace, heart rate, effort, execution. But one hard day doesn't change anything on its own. Valhalla waits for a real pattern before it acts, then proposes a specific adjustment to what comes next. You decide whether to take it.",
      // PHASE 2 AUDIT: was "It's a coach that's actually looking at it" —
      // flagged against Business's unearned-claim list ("coach-like",
      // "understands training"). Rewritten to keep the not-a-dashboard
      // contrast without asserting the product is a cognitive/coaching
      // agent — reuses "pays attention," already established in hero.sub,
      // rather than a new anthropomorphizing claim.
      "It isn't a dashboard of your data. It's built to pay attention to it — and tell you only what actually matters.",
    ],
  },
  philosophy: {
    eyebrow: "Velvet Viking",
    heading: "Earn Your Place.",
    sub: "The philosophy behind the brand.",
    body: "Earn Your Place is not a slogan. It's the standard everything else is built on.",
    // COPY AUDIT: paragraph 1 was trimmed — its back half ("showing up,
    // doing the right session on the right day, and letting progress come
    // from that, rather than from a single perfect effort") duplicated
    // Home's brandStory/earnYourPlace almost word for word. Kept the part
    // of this paragraph that's genuinely unique to Philosophy (motivation
    // — not proving anything to anyone else). Paragraph 2 drops the
    // trailing "— every time": an absolute claim the copy hadn't earned.
    expanded: [
      "Earn Your Place isn't about suffering for its own sake, and it isn't about proving something to anyone else. It's about doing the right work on the right day — not chasing a single perfect effort.",
      "That means knowing when to push. It also means knowing when to hold back, because recovery is part of the work, not a break from it. Consistency, applied intelligently, beats intensity applied carelessly.",
      "Valhalla exists to support that: to help you do the right work, understand what it's telling you, and keep coming back to it.",
    ],
  },
  about: {
    eyebrow: "Velvet Viking",
    heading: "About",
    sub: "A performance brand, built with intent.",
    // COPY AUDIT: was "...that real progress comes from consistent,
    // intelligent work — not shortcuts, not hype..." — that's Philosophy's
    // thesis, restated here for roughly the sixth time site-wide. About's
    // job is the entity, not the training belief: what Velvet Viking is,
    // and its relationship to Valhalla.
    body: "Velvet Viking is a performance brand. Valhalla, its endurance coaching product, is the first thing it has built.",
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
    expanded: [
      "Valhalla is not a side project. It is Velvet Viking's first product, built to the same standard the name is meant to carry.",
    ],
  },
} as const;
