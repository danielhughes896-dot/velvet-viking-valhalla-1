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
  sub: "Endurance coaching that learns from your training and adapts with you.",
  cta: { label: "Explore Valhalla", href: "/valhalla" },
  media: {
    placeholder: "[HERO PHOTOGRAPH]",
    alt: "[HERO PHOTOGRAPH — athlete in training, environment to be confirmed]",
  },
} as const;

export const brandStory = {
  eyebrow: "Velvet Viking",
  heading: ["Performance isn't given.", "It's built."],
  body: "Progress comes from doing the right work consistently — knowing when to push, when to adapt and when to recover.",
  media: {
    placeholder: "[ATHLETE / TRAINING PHOTOGRAPH]",
    alt: "[ATHLETE / TRAINING PHOTOGRAPH — placeholder]",
  },
} as const;

export const valhallaProduct = {
  eyebrow: "The Flagship",
  heading: "Valhalla",
  sub: "Endurance coaching that responds to the athlete, not just the plan.",
  body: "Valhalla doesn't just give you a training plan. It learns from what you actually do, interprets what matters and helps decide what comes next.",
  points: [
    {
      heading: "Training built around you",
      body: "Your fitness, training zones, race target and available days shape the plan from the start.",
    },
    {
      heading: "Adaptation with purpose",
      body: "Completed sessions feed back into the plan, so adaptation is based on what actually happened — not just what was scheduled.",
    },
    {
      heading: "Coaching, not just data",
      body: "Pace, heart rate, effort and execution are interpreted together, so the numbers lead to coaching rather than another dashboard.",
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
} as const;

export const futureWorld = {
  eyebrow: "Beyond Valhalla",
  heading: ["One philosophy.", "Different expressions."],
  body: "Velvet Viking begins with Valhalla, but it isn't defined by a single product. The same standards of purpose, performance and refinement will shape everything that carries the name.",
  categories: ["Performance", "Apparel", "Training", "Community"],
} as const;

export const finalCta = {
  heading: "Valhalla Awaits.",
  sub: "Training doesn't stand still. Neither should your coaching.",
  cta: { label: "Explore Valhalla", href: "/valhalla" },
} as const;

export const footer = {
  tagline: "Earn Your Place.",
  // Nullable on purpose — no real accounts exist yet. Add the URL here when
  // one goes live; SocialLinks renders that single platform automatically,
  // with no other code change required. Leave a platform null indefinitely
  // if it's never used — it simply never renders.
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
    eyebrow: "The Flagship",
    heading: "Valhalla",
    sub: "Intelligent endurance coaching by Velvet Viking.",
    body: "[This page will hold the full Valhalla product story — real product screenshots, concise explanations of how training is built and adapted, and a path in. Placeholder foundation only.]",
  },
  philosophy: {
    eyebrow: "Velvet Viking",
    heading: "Earn Your Place.",
    sub: "The philosophy behind the brand.",
    body: "[This page will hold the complete Velvet Viking philosophy — the discipline of becoming capable, and why the work matters more than the claim. Placeholder foundation only.]",
  },
  about: {
    eyebrow: "Velvet Viking",
    heading: "About",
    sub: "A performance brand, built with intent.",
    body: "[This page will hold Velvet Viking's genuine story, purpose and approach as it is confirmed. No history, team or claims are fabricated here.]",
  },
} as const;
