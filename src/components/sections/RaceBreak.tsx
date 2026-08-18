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
// immersive scroll moment on the homepage, restoring the spirit of the
// original FullWidthPhoto sticky transition (see git history: commit
// 5afaf41 introduced it, replaced by this component without it in 9c7cd45)
// without either of that version's two problems for THIS photo — its
// fragile "-mt-[100vh] + z-index" cross-section cover mechanic (Work
// Travels, the section after this one, is untouched by this change), and
// its assumption of a full-bleed landscape source (this photo keeps its
// own portrait box above, never force-cropped). The photo box itself pins
// in place (pure CSS position: sticky, no scroll-jacking) at sm+ only; the
// spacer below gives it a real but restrained ~40vh of hold before it
// releases on its own and the caption, then Work Travels, follow exactly
// as they already did. Sits out entirely on mobile — no sticky, no
// spacer, identical to the previous static rendering — and under
// prefers-reduced-motion, where a held-in-place element while the rest of
// the page keeps moving is itself a motion effect worth switching off.
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
        </div>
      </div>
      {/* Pure scroll-distance spacer, not a visible element — see comment
          above for why the sticky box needs this to hold for a moment
          rather than releasing the instant it's pinned. */}
      <div aria-hidden className="hidden motion-safe:sm:block motion-safe:sm:h-[40vh]" />
      {caption ? (
        <p className="mt-10 pb-20 text-center font-display text-xl font-semibold uppercase tracking-[0.08em] text-vv-ink sm:pb-28 sm:text-3xl">
          {caption}
        </p>
      ) : null}
    </section>
  );
}
