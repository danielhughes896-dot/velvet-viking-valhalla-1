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
// GEOMETRY, DERIVED RATHER THAN TUNED. Writing the whole derivation down
// because two earlier attempts failed by picking a pull-up number first
// and letting everything else fall out of it. Document-space terms:
//
//   P    sticky wrapper's natural top      T    sticky top offset (96px)
//   Hs   sticky wrapper height             VH   viewport height
//   Ctail  section content BELOW the wrapper (spacer + caption block)
//   SB   section bottom  = P + Hs + Ctail
//   M    WorkTravels' negative margin-top; its top W = SB + M
//
//   pin engages           Y_pin   = P - T
//   WorkTravels appears   Y_enter = W - VH          (its top hits the fold)
//   cover completes       Y_cover = W - T           (its top reaches the photo's)
//   sticky releases       Y_rel   = SB - Hs - T
//
//   HOLD  = Y_enter - Y_pin = Hs + Ctail + M - VH + T
//   SWEEP = Y_cover - Y_enter = VH - T        (inherent; not a free choice)
//
// Requiring cover to finish B px before release, and solving for M with
// HOLD as the CHOSEN input rather than the leftover:
//
//   Ctail = HOLD + (VH - T) + B     and then     |M| = Hs + B
//
// So the pull-up is just "the pinned photo's own height plus a safety
// margin" — it does not encode the hold at all. The hold lives entirely
// in Ctail, which is why it can now be set to a deliberate short beat
// (a PERCEIVED 150px mobile / 200px sm+ — see the spacer's own note for
// why perceived and geometric differ) instead of being whatever distance
// happened to remain after guaranteeing coverage. That inversion is the
// fix for the "page feels stuck" dead scroll: the previous build's
// geometric hold measured 401/543/458/512px at 390/820/1440/1920.
//
// Hs differs by breakpoint because the photo box is sized differently:
// width-authority below sm (pt-20 + a 3:4 box whose height follows its
// own width) and height-authority at sm+ (pt-28 + a flat 78vh). Hence the
// two pull-up values in page.tsx. The spacer carries Ctail minus the
// caption block's own height (measured: 147px mobile / 188px sm+).
//
// WHY THE PHOTO USED TO REAPPEAR, AND WHERE THAT IS FIXED: the pinned
// photo is `position: sticky`, i.e. a POSITIONED element with
// z-index:auto, while the sections below are `position: static`.
// Positioned elements paint above static ones, so wherever their boxes
// overlapped, the photo painted ON TOP OF Earn Your Place and reappeared
// long after it had been covered. The pull-up is what makes that overlap
// possible: after release the photo sits in [SB-Hs, SB] while WorkTravels
// sits in [SB+M, SB+M+WT_h], so WorkTravels alone only keeps it hidden
// while WT_h >= |M| — a coincidence that happened to hold at 390/1440 and
// failed at 820/1920.
//
// The fix is NOT here; it is the z-index passed to the Earn Your Place
// section in page.tsx, which is the same mechanism the original
// FullWidthPhoto transition used ("higher z-index, opaque background").
// Recorded here because this component is where the cause lives: making
// this section `isolation: isolate` was tried first, on the theory that a
// non-positioned stacking context paints atomically in flow order and so
// would fall below later siblings. Measured, it does not — browsers paint
// such a context at the z-index:0 level, still above static content — and
// 820px still reappeared with it applied. Do not re-add it expecting a
// fix; give any future section that overlaps this one a z-index instead.
//
// CAPTION: unchanged — a small overlay near the TOP of the photo (below).
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
      {/* Pure scroll-distance spacer, not a visible element. Carries
          Ctail minus the caption block below it, i.e.
          HOLD + (100vh - 96px) + 40px safety - captionHeight. HOLD is
          set from the PERCEIVED beat, not the geometric one: WorkTravels'
          own top padding (80px mobile / 112px sm+) is the same dark
          colour as this section's background, so a viewer registers
          nothing until its hero image crosses the fold. Targeting a
          perceived 150px (mobile) / 200px (sm+) means a geometric hold of
          70px / 88px, giving (100vh - 133px) and (100vh - 156px). See the
          derivation above — this is where the hold lives, which is why it
          can be short. */}
      <div
        aria-hidden
        className="hidden motion-safe:block motion-safe:h-[calc(100vh_-_133px)] motion-safe:sm:h-[calc(100vh_-_156px)]"
      />
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
