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
  sub: "Adaptive endurance coaching built around your fitness, your training and your progression.",
  cta: { label: "Explore Valhalla", href: "/valhalla" },
  media: {
    placeholder: "[HERO PHOTOGRAPH]",
    alt: "[HERO PHOTOGRAPH — athlete in training, environment to be confirmed]",
  },
} as const;

export const brandStory = {
  eyebrow: "Velvet Viking",
  heading: "The Right Work, Repeated.",
  body: "[VELVET VIKING BRAND STATEMENT — the philosophy behind the name: precision and discipline alongside resilience and effort. Final copy to be confirmed.]",
  media: {
    placeholder: "[ATHLETE / TRAINING PHOTOGRAPH]",
    alt: "[ATHLETE / TRAINING PHOTOGRAPH — placeholder]",
  },
} as const;

export const valhallaProduct = {
  eyebrow: "The Flagship",
  heading: "Valhalla",
  sub: "Intelligent endurance coaching by Velvet Viking.",
  body: "[VALHALLA PRODUCT DESCRIPTION — training built around the athlete, interpreted rather than simply logged. Final copy to be confirmed.]",
  points: [
    "[Training built around the athlete]",
    "[Intelligent, ongoing adaptation]",
    "[Coaching interpretation, not raw statistics]",
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
  body: "[EARN YOUR PLACE — a short supporting statement on process over identity. Final copy to be confirmed.]",
  media: {
    placeholder: "[ATHLETE / TRAINING PHOTOGRAPH]",
    alt: "[ATHLETE / TRAINING PHOTOGRAPH — placeholder]",
  },
} as const;

export const futureWorld = {
  eyebrow: "Beyond Valhalla",
  heading: "A world, not a single product.",
  body: "The same philosophy extends beyond Valhalla — performance, apparel, training and community are natural expressions of it, each arriving only as it's genuinely ready.",
  categories: ["Performance", "Apparel", "Training", "Community"],
} as const;

export const finalCta = {
  heading: ["Valhalla Awaits.", "Earn Your Place."],
  cta: { label: "Explore Valhalla", href: "/valhalla" },
} as const;

export const footer = {
  columns: [
    {
      heading: "Velvet Viking",
      links: [
        { label: "Philosophy", href: "/philosophy" },
        { label: "About", href: "/about" },
      ],
    },
    {
      heading: "Valhalla",
      links: [{ label: "Overview", href: "/valhalla" }],
    },
    {
      heading: "Company",
      links: [
        { label: "Contact", href: "/about#contact" },
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Cookies", href: "/cookies" },
      ],
    },
  ],
  social: [] as { label: string; href: string }[],
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
    body: "[This page will hold the complete Velvet Viking philosophy — the discipline of becoming capable, and why progress is earned rather than declared. Placeholder foundation only.]",
  },
  about: {
    eyebrow: "Velvet Viking",
    heading: "About",
    sub: "A master brand for performance, built with intent.",
    body: "[This page will hold Velvet Viking's genuine story, purpose and approach as it is confirmed. No history, team or claims are fabricated here.]",
  },
} as const;
