import PlaceholderMedia from "@/components/ui/PlaceholderMedia";

type FullWidthPhotoProps = {
  mediaLabel: string;
  mediaAlt: string;
  caption?: string;
};

// Full-bleed by design (see PlaceholderMedia's `bleed`) so a real photograph
// can later fade into the sections above/below it here without restructuring
// — that fade isn't built yet (no real image to art-direct it against), but
// nothing here blocks adding it later. The min-height keeps this a genuine
// full-bleed interruption on narrow viewports too, where a plain 16:9 box
// would otherwise be too short to read as a moment rather than a rectangle.
//
// The section immediately below this one (Earn Your Place) is a light
// chapter. A flat color-to-color seam reads as "two sections stacked"; a
// fade at the base of the photo — ending in that section's own `--vv-bg`,
// picked up via the `theme-light` class rather than a hardcoded hex — reads
// as the photo itself dissolving into what comes next. This is scoped to
// this one transition, not a page-wide gradient treatment: a real
// photograph slotted in later can keep the same fade, crop tighter to skip
// it, or use its own edge instead — nothing here forces the choice.
export default function FullWidthPhoto({ mediaLabel, caption }: FullWidthPhotoProps) {
  return (
    <section className="relative bg-vv-bg">
      <PlaceholderMedia label={mediaLabel} aspect="wide" bleed className="w-full min-h-[60vh]" />
      {caption ? (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-24 sm:pb-28">
          <p className="font-display text-xl font-semibold uppercase tracking-[0.08em] text-vv-ink sm:text-3xl">
            {caption}
          </p>
        </div>
      ) : null}
      {/* Sits below the caption, not behind it — the fade would otherwise
          wash out light caption text as the background lightens under it. */}
      <div
        aria-hidden
        className="theme-light pointer-events-none absolute inset-x-0 bottom-0 h-16 sm:h-20"
        style={{ background: "linear-gradient(to bottom, transparent, var(--vv-bg))" }}
      />
    </section>
  );
}
