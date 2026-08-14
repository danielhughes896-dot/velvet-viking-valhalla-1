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
crest asset — the only crest file in this repo, referenced everywhere
(hero, header, footer, favicon, Open Graph/social imagery) through one
component, `src/components/ui/Crest.tsx`. Reproduce it as-is per brand
guidance — composition, wording and the gold/navy identity are not to be
altered. The PNG has a transparent background (only the circular gold/navy
crest and the "EARN YOUR PLACE" wordmark are opaque) so it can be dropped
onto light or dark sections, merchandise, and third-party surfaces without
a black background box; keep any future master in that transparent form.
Only a raster master exists today; because there's a single reference
point, a professionally mastered SVG can replace it later as a one-line
change, without a page redesign.

`public/brand/experimental-svg/` holds a first-pass genuine vector
reconstruction (`velvet-viking-crest-master.svg`, full detail; and
`velvet-viking-mark-simple.svg`, a reduced mark for favicon/small-UI sizes
where the full crest turns to mush below ~96px). Both are real paths/strokes
with gradients, not a traced or embedded bitmap. **Neither is wired into
the site and neither should be treated as canonical** — side-by-side against
the PNG they read as a clean, flatter, simplified interpretation, not a
faithful reproduction of the photoreal metal/engraving in the raster
master. Keep the PNG as the production asset until a design-approved SVG
replaces this folder's contents.

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
