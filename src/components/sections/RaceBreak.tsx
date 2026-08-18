import Image from "next/image";

type RaceBreakProps = {
  src: string;
  alt: string;
  caption?: string;
};

// REAL-IMAGERY PASS: an editorial full-width break, but NOT a reuse of
// FullWidthPhoto's sticky/100vh mechanic — that component assumes a
// landscape source and cover-crops it to fill a viewport-shaped frame. This
// photo is portrait (668x864, ~3:4): force-covering a ~16:9 frame with it
// would scale the image up until only a narrow vertical sliver survives,
// losing the outstretched arms, the crowd, the whole "this is a real race"
// context that's the entire point of using it. So the box here is sized to
// the photo's OWN ratio instead of the frame's — object-cover inside a box
// that already matches the source ratio never has anything to crop.
//
// Width-authority on mobile (the box fills the padded column, height
// follows), height-authority from sm+ (the box is tall and centered, width
// follows) — a plain w-full box at this ratio would tower over a wide
// desktop viewport if it stayed height-unconstrained, and a plain
// height-capped box would overflow a narrow phone screen if it stayed
// width-unconstrained. Same photo, same crop (none), different authority.
//
// CONSISTENCY COMPOUNDS SCROLL RESTORATION: this is the one deliberate
// immersive scroll moment on the homepage, restoring the original
// FullWidthPhoto sticky-then-covered transition (see git history: commit
// 5afaf41 introduced it, replaced by this component without it in 9c7cd45)
// adapted to THIS photo rather than reused verbatim — that version assumed
// a full-bleed landscape source and force-cropped to fill the frame; this
// photo keeps its own portrait box above, never cropped. The photo box
// itself pins in place (pure CSS position: sticky, no scroll-jacking) at
// sm+ only; the spacer below gives it real scroll room to hold before
// WorkTravels — pulled up over this section from below, see the className
// passed to it in page.tsx — visibly rises and covers it, the same "next
// section rolls over the pinned image" behaviour the original had. Sits
// out entirely on mobile — no sticky, no spacer, identical to the
// previous static rendering — and under prefers-reduced-motion, where a
// held-in-place element while the rest of the page keeps moving is itself
// a motion effect worth switching off.
//
// CAPTION VISIBILITY FIX: the below-photo caption previously became
// permanently invisible once the cover transition engaged — it sat in the
// exact document region WorkTravels' pull-up occupies (confirmed by direct
// scroll tracing; nesting it inside the sticky unit didn't work either,
// since photo+caption pinned together is taller than many sm+ viewports).
// Fixed by giving it two renderings, gated on the exact same
// `motion-safe:sm:` condition the sticky/cover mechanic itself uses:
//   - at motion-safe:sm+ (where the photo pins and gets covered), the
//     caption moves INTO the photo's own relative container as a small,
//     restrained overlay — reusing the same "small tracked label +
//     text-shadow for legibility over a real photo" treatment WorkTravels'
//     own location labels already use elsewhere on this page, not a new
//     visual language. It is now part of the same pinned surface as the
//     photo, so it holds and gets covered together with it.
//   - below sm, and under prefers-reduced-motion at any width (where the
//     photo is a plain static block), the ORIGINAL below-photo caption
//     renders completely unchanged — same classes, same position, same
//     size — exactly as it did before the cover transition existed.
// The wording is identical in both; only which one is shown, and how the
// sm+/motion-safe one is styled, differs.
//
// OVERLAY POSITIONED NEAR THE TOP, NOT THE BOTTOM, OF THE PHOTO: the
// pull-up amount that guarantees WorkTravels fully closes over the photo
// before the pin releases (see the className passed to WorkTravels in
// page.tsx) necessarily means WorkTravels already covers most of the
// photo's lower two-thirds from the moment the pin engages — verified by
// direct measurement: the uncovered band at pin-start is only the photo's
// own top ~130px, shrinking to zero well before the hold ends. A caption
// placed near the bottom, however small, would be covered before or at
// the instant it appears — never actually seen. Top placement is the only
// position genuinely visible for a meaningful stretch of the pin. This is
// a deliberate deviation from a literal "over the lower part of the
// photograph" for that reason, not an oversight — see the report for the
// exact measurements this was based on.
export default function RaceBreak({ src, alt, caption }: RaceBreakProps) {
  return (
    <section className="theme-dark bg-vv-bg">
      <div className="mx-auto flex max-w-4xl justify-center px-6 pt-20 motion-safe:sm:sticky motion-safe:sm:top-24 sm:px-8 sm:pt-28">
        <div className="relative aspect-3/4 w-full max-w-sm overflow-hidden rounded-vv shadow-vv sm:h-[78vh] sm:w-auto sm:max-w-none">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 640px) 55vw, 90vw"
            className="object-cover"
          />
          {caption ? (
            <p
              className="pointer-events-none absolute inset-x-0 top-3 hidden text-center font-head text-xs font-semibold uppercase tracking-[0.24em] text-vv-gold-text motion-safe:sm:block sm:top-5 sm:text-sm"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
            >
              {caption}
            </p>
          ) : null}
        </div>
      </div>
      {/* Pure scroll-distance spacer, not a visible element — see comment
          above for why the sticky box needs this to hold for a moment
          rather than releasing the instant it's pinned. */}
      <div aria-hidden className="hidden motion-safe:sm:block motion-safe:sm:h-[40vh]" />
      {/* motion-safe:sm:invisible, not hidden: this paragraph must keep
          occupying its original box at that breakpoint (the overlay
          caption above is position:absolute and contributes no height of
          its own) so the sticky pin's hold duration — calibrated against
          this section's total document height — stays exactly what it
          was before this fix. visibility:hidden also removes it from the
          accessibility tree, same as display:none would, so there's no
          duplicate-caption announcement at sm+ either. */}
      {caption ? (
        <p className="mt-10 pb-20 text-center font-display text-xl font-semibold uppercase tracking-[0.08em] text-vv-ink sm:pb-28 sm:text-3xl motion-safe:sm:invisible">
          {caption}
        </p>
      ) : null}
    </section>
  );
}
