type PlaceholderMediaProps = {
  label: string;
  aspect?: "landscape" | "portrait" | "square" | "wide";
  className?: string;
  /** Edge-to-edge, no frame/radius — for full-bleed photography moments. */
  bleed?: boolean;
};

const aspectClass: Record<NonNullable<PlaceholderMediaProps["aspect"]>, string> = {
  landscape: "aspect-4/3",
  portrait: "aspect-3/4",
  square: "aspect-square",
  wide: "aspect-16/9",
};

// Deliberately quiet: a small tracked label on a faint tint, not a loud
// "IMAGE HERE" box. Swapping in a real <Image> later means dropping it into
// the same slot — no section redesign required. `bleed` drops every "card"
// signal (radius, outer border, dashed inner marker) for photography meant
// to read as part of the page canvas rather than a component; the plain
// (non-bleed) treatment keeps the hairline card frame for contexts that are
// deliberately framed, like device-mockup screens.
export default function PlaceholderMedia({
  label,
  aspect = "landscape",
  className = "",
  bleed = false,
}: PlaceholderMediaProps) {
  return (
    <div
      className={`relative overflow-hidden ${bleed ? "" : "rounded-vv"} ${aspectClass[aspect]} ${className}`}
      style={{
        backgroundColor: "var(--vv-placeholder-bg)",
        ...(bleed
          ? {}
          : { borderWidth: 1, borderStyle: "solid", borderColor: "var(--vv-placeholder-border)" }),
      }}
    >
      {!bleed ? (
        <div
          className="absolute inset-4 border border-dashed sm:inset-8"
          style={{ borderColor: "var(--vv-placeholder-border)" }}
          aria-hidden
        />
      ) : null}
      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <span className="font-head text-[11px] font-medium uppercase tracking-[0.2em] text-vv-ink-faint">
          {label}
        </span>
      </div>
    </div>
  );
}
