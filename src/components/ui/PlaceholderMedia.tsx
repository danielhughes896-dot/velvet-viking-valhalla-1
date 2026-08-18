import Image from "next/image";
import type { StaticImageData } from "next/image";

type PlaceholderMediaProps = {
  label: string;
  aspect?: "landscape" | "portrait" | "square" | "wide";
  className?: string;
  /** Edge-to-edge, no frame/radius — for full-bleed photography moments. */
  bleed?: boolean;
  /** REAL-IMAGERY PASS: when provided, renders a real photograph/screenshot
   * in this exact slot instead of the placeholder box — the swap this
   * component's own comment always anticipated. `label` still doubles as
   * the accessible name backstop, but `alt` is used once `src` is set. */
  src?: StaticImageData | string;
  alt?: string;
  /** "cover" (default) fills the frame, cropping to fit — for photography,
   * where a crop is a normal presentation choice. "contain" never crops —
   * for app screenshots, where every pixel of real UI must stay visible. */
  fit?: "cover" | "contain";
  priority?: boolean;
  sizes?: string;
  /** CSS object-position, e.g. "center 20%" — for a "cover" crop where the
   * subject isn't centered in the source photograph (a running head near
   * the top of frame, a standing figure lower in a tall landscape shot).
   * Ignored for fit="contain", where nothing is cropped in the first place. */
  objectPosition?: string;
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
  src,
  alt,
  fit = "cover",
  priority = false,
  sizes = "100vw",
  objectPosition,
}: PlaceholderMediaProps) {
  return (
    <div
      className={`relative overflow-hidden ${bleed ? "" : "rounded-vv"} ${aspectClass[aspect]} ${className}`}
      style={{
        backgroundColor: "var(--vv-placeholder-bg)",
        ...(bleed || src
          ? {}
          : { borderWidth: 1, borderStyle: "solid", borderColor: "var(--vv-placeholder-border)" }),
      }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? label}
          fill
          priority={priority}
          sizes={sizes}
          className={fit === "contain" ? "object-contain" : "object-cover"}
          style={objectPosition && fit !== "contain" ? { objectPosition } : undefined}
        />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
