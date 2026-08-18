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
// photo keeps its own portrait box above, never cropped. Sticky at every
// width now (see the "REDONE FOR EVERY WIDTH" note below) except under
// prefers-reduced-motion, where a held-in-place element while the rest of
// the page keeps moving is itself a motion effect worth switching off —
// there it's a plain static block, same as it always renders below the
// sm breakpoint... except there is no such breakpoint carve-out any more.
//
// REDONE FOR EVERY WIDTH, WITH A GENUINE HOLD BEFORE THE COVER BEGINS:
// the first version of this transition pulled WorkTravels up by a flat
// -mt-[120vh] restricted to sm+, calibrated only so the cover completed
// before the pin released. That satisfied "fully covers" but not the
// actual requested EXPERIENCE: WorkTravels was already intruding on the
// photo from the instant the pin engaged, with no period where the photo
// was the only thing on screen — it read as the next section being
// yanked up through the current one, not sliding over it once ready.
//
// This version derives the geometry from three named phases instead of
// one flat number:
//   1. HOLD (~30vh of scroll): photo pins, WorkTravels is still entirely
//      below the viewport — not just below the photo, below the fold —
//      so the photo is the only thing visible and fully readable.
//   2. COVER (~100vh of scroll): WorkTravels enters at the viewport's
//      own bottom edge and rises to fully cover the pinned photo, top to
//      bottom — literally "the next section sliding up from the bottom
//      of the screen," not appearing already partway up the photo.
//   3. RELEASE: the pin's own scroll room (the spacer below) is sized to
//      outlast HOLD+COVER with a margin, so full coverage is always
//      reached while still pinned — the same reason this margin existed
//      in the previous version, just recalculated for the new geometry.
//
// The spacer height (140vh, pure vh — it's scroll distance, which is a
// viewport-HEIGHT-relative concept regardless of device) is the same at
// every width. The WorkTravels pull-up is not: the photo's own height is
// viewport-height-driven at sm+ (h-[78vh]) but viewport-WIDTH-driven
// below sm (a fixed-ratio box whose height follows its own width, capped
// at max-w-sm) — see the two className values passed to WorkTravels in
// page.tsx, each solving the same "start WorkTravels at hold+cover below
// the viewport at pin-engage" equation against that breakpoint's actual
// box-height formula, verified against this breakpoint's real rendered
// numbers rather than assumed.
//
// CAPTION: unchanged from the previous fix — a small overlay near the
// TOP of the photo (see below), now even more reliably visible than
// before, since WorkTravels no longer touches the photo at all during
// the entire HOLD phase.
export default function RaceBreak({ src, alt, caption }: RaceBreakProps) {
  return (
    <section className="theme-dark bg-vv-bg">
      <div className="mx-auto flex max-w-4xl justify-center px-6 pt-20 motion-safe:sticky motion-safe:top-24 sm:px-8 sm:pt-28">
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
              className="pointer-events-none absolute inset-x-0 top-3 hidden text-center font-head text-xs font-semibold uppercase tracking-[0.24em] text-vv-gold-text motion-safe:block sm:top-5 sm:text-sm"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
            >
              {caption}
            </p>
          ) : null}
        </div>
      </div>
      {/* Pure scroll-distance spacer, not a visible element — HOLD(~30vh)
          + COVER(~100vh) + a safety margin, see the comment above. Applies
          at every width now, not just sm+. */}
      <div aria-hidden className="hidden motion-safe:block motion-safe:h-[140vh]" />
      {/* motion-safe:invisible, not hidden: this paragraph must keep
          occupying its original box (the overlay caption above is
          position:absolute and contributes no height of its own) so the
          sticky pin's hold duration — calibrated against this section's
          total document height — stays exactly what the spacer above
          intends. visibility:hidden also removes it from the
          accessibility tree, same as display:none would, so there's no
          duplicate-caption announcement under motion-safe either. */}
      {caption ? (
        <p className="mt-10 pb-20 text-center font-display text-xl font-semibold uppercase tracking-[0.08em] text-vv-ink sm:pb-28 sm:text-3xl motion-safe:invisible">
          {caption}
        </p>
      ) : null}
    </section>
  );
}
