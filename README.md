# Velvet Viking — Master-Brand Website

A pre-launch, editable foundation for the Velvet Viking master-brand website.
Velvet Viking is the parent brand; **Valhalla** — the intelligent endurance
training app in `velvet-viking-valhalla-2` — is its flagship product.

This is a foundation, not a finished public launch. Where final content
doesn't exist yet, sections use clearly-marked placeholder positions (e.g.
`[HERO PHOTOGRAPH]`) rather than invented copy or Lorem Ipsum. No production
domain is connected — develop and review locally or on a Vercel preview.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4, deployed to Vercel.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Design tokens

All colors, radii and shadows in `src/app/globals.css` are extracted verbatim
from the live Valhalla 2 app (`velvet-viking-valhalla.html`'s `:root` and
`[data-theme="light"]` blocks) so the website and the product read as one
visual family. Don't invent new brand colors — pull any additional value from
the app's own token set.

The site has **no user-facing theme toggle**. `:root` is the dark identity;
`.theme-light` is applied per-`<section>` to compose an art-directed
dark/light rhythm down the page — that rhythm is a design decision, not
something the visitor controls.

## Content

All editable copy, nav labels, CTA labels and image-slot placeholders live in
`src/content/site.ts`, separate from layout. Update content there rather than
inside components.

## Brand crest

`public/brand/velvet-viking-crest.png` is the single canonical Velvet Viking
crest asset — the master used everywhere the full crest appears (hero,
header, mobile nav, philosophy page, Open Graph/social imagery) through one
component, `src/components/ui/Crest.tsx`. This file is identical to the
`assets/velvet-viking-crest.png` master in the Valhalla app repo
(`velvet-viking-valhalla-2`) — the two must be kept in sync; there must not
be visually different versions of the full crest across the two products.
Reproduce it as-is per brand guidance — composition, wording and the
gold/navy identity are not to be altered. The PNG has a transparent
background (only the circular gold/navy crest, "VALHALLA AWAITS", "EARN
YOUR PLACE" and its two flanking gold lines are opaque) so it can be
dropped onto light or dark sections, merchandise, and third-party surfaces
without a black background box; keep any future master in that transparent
form.

`public/brand/velvet-viking-icon-source.png` is a **separate, deliberately
older** asset used only for `icons.icon` / `icons.apple` in
`src/app/layout.tsx` (browser favicon, iOS home-screen icon). It is held
back from the current crest master because the full detailed crest is
known to turn illegible below ~96px — see the small-icon comparison
referenced in the brand-asset task history before replacing it.

`public/brand/experimental-svg/` holds a rejected first-pass vector
reconstruction. **Do not use it anywhere or treat it as a starting point.**
The canonical crest is the raster PNG above; kept only as prior-art, not as
an active asset.

**Canonical wording** (do not add to or remove from this without an explicit
brand decision):

```
VELVET VIKING
VALHALLA AWAITS
EARN YOUR PLACE
```

The master crest does not carry category descriptors such as "RUNNING
PROGRAMS" — Velvet Viking is the master brand and is not defined in its core
identity by any one product category. An earlier build of this site
inherited a "RUNNING PROGRAMS" crest variant from Valhalla 2; that asset is
retired and must not be reintroduced.

## Structure

- `/` — homepage: hero → brand story → Valhalla product → full-width
  photography → Earn Your Place → future-brand architecture → final CTA.
- `/valhalla`, `/philosophy`, `/about` — minimal structural foundations for
  future detailed pages.
- `/privacy`, `/terms`, `/cookies` — footer-linked stubs, no fabricated legal
  content.
