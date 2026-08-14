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
export default function FullWidthPhoto({ mediaLabel, caption }: FullWidthPhotoProps) {
  return (
    <section className="relative bg-vv-bg">
      <PlaceholderMedia label={mediaLabel} aspect="wide" bleed className="w-full min-h-[60vh]" />
      {caption ? (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-14">
          <p className="font-display text-xl font-semibold uppercase tracking-[0.08em] text-vv-ink sm:text-3xl">
            {caption}
          </p>
        </div>
      ) : null}
    </section>
  );
}
