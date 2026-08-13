import PlaceholderMedia from "@/components/ui/PlaceholderMedia";

type FullWidthPhotoProps = {
  mediaLabel: string;
  mediaAlt: string;
  caption?: string;
};

export default function FullWidthPhoto({ mediaLabel, caption }: FullWidthPhotoProps) {
  return (
    <section className="relative bg-vv-bg">
      <PlaceholderMedia label={mediaLabel} aspect="wide" bleed />
      {caption ? (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-14">
          <p className="font-display text-xl font-semibold uppercase tracking-[0.08em] text-vv-ink sm:text-2xl">
            {caption}
          </p>
        </div>
      ) : null}
    </section>
  );
}
