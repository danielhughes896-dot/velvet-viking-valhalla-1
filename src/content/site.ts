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
    { label: "Philosophy", href: "/philosophy" },
    { label: "About", href: "/about" },
  ],
  cta: { label: "Explore Valhalla", href: "/valhalla" },
} as const;

export const hero = {
  eyebrow: "Velvet Viking",
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
  body: "A training plan shouldn't go stale the moment real training starts. Valhalla pays attention to what you actually do, and helps you understand what that means for what comes next.",
  points: [
    {
      heading: "Training built around you",
      body: "Your fitness, training zones, race target and available days shape the plan from day one — down to the paces and effort that are actually right for you.",
    },
    {
      heading: "Adaptation with purpose",
      body: "One tough session doesn't change anything. A real pattern does. When the evidence is clear, Valhalla proposes the adjustment that makes sense — and you decide whether to take it.",
    },
    {
      heading: "Coaching, not just data",
      body: "Pace, heart rate, effort and execution are read together — not as separate charts, but as one picture of how a session actually went.",
    },
  ],
  cta: { label: "Explore Valhalla", href: "/valhalla" },
  screenshots: {
    mobile: {
      placeholder: "[VALHALLA MOBILE SCREENSHOT]",
      alt: "[VALHALLA MOBILE SCREENSHOT — placeholder]",
    },
    desktop: {
      placeholder: "[VALHALLA DESKTOP SCREENSHOT]",
      alt: "[VALHALLA DESKTOP SCREENSHOT — placeholder]",
    },
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
  cta: { label: "Explore Valhalla", href: "/valhalla" },
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
  valhalla: {
    eyebrow: valhallaProduct.eyebrow,
    heading: valhallaProduct.heading,
    sub: valhallaProduct.sub,
    body: "A closer look at how Valhalla actually works.",
    // Real product screenshots will eventually sit alongside this copy —
    // see the device mockups below it on this page. Nothing here describes
    // functionality beyond what the app genuinely does today.
    expanded: [
      "Valhalla builds your plan from what's true about you — your current fitness, a real benchmark performance, your race target and the days you can actually train. From there, it works out the paces and effort levels that make sense for your training, not generic ones.",
      "Once training starts, Valhalla pays attention. Every session is compared with what was planned — pace, heart rate, effort, execution. But one hard day doesn't change anything on its own. Valhalla waits for a real pattern before it acts, then proposes a specific adjustment to what comes next. You decide whether to take it.",
      "It isn't a dashboard of your data. It's a coach that's actually looking at it.",
    ],
  },
  philosophy: {
    eyebrow: "Velvet Viking",
    heading: "Earn Your Place.",
    sub: "The philosophy behind the brand.",
    body: "Earn Your Place is not a slogan. It's the standard everything else is built on.",
    expanded: [
      "Earn Your Place isn't about suffering for its own sake, and it isn't about proving something to anyone else. It's about the work itself — showing up, doing the right session on the right day, and letting progress come from that, rather than from a single perfect effort.",
      "That means knowing when to push. It also means knowing when to hold back, because recovery is part of the work, not a break from it. Consistency, applied intelligently, beats intensity applied carelessly — every time.",
      "Valhalla exists to support that: to help you do the right work, understand what it's telling you, and keep coming back to it.",
    ],
  },
  about: {
    eyebrow: "Velvet Viking",
    heading: "About",
    sub: "A performance brand, built with intent.",
    body: "Velvet Viking is a performance brand built around one idea: that real progress comes from consistent, intelligent work — not shortcuts, not hype, and not performance for its own sake.",
    // No founder/origin story: the repository holds no factual basis for
    // one, and inventing personal history is explicitly out of scope for
    // this pass. This page states only what's actually true.
    expanded: [
      "Valhalla, an endurance coaching product, is the first expression of that idea. The same standards — purpose, performance, refinement — will apply to whatever Velvet Viking builds next.",
    ],
    contactNote: "Contact details will be published here soon.",
  },
} as const;
