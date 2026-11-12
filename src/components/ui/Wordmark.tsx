// THE MARK IS THE NAME BETWEEN TWO DOTS.
//
// Founder, on the splash: "It's simply the name with the dots. That's it.
// Clean & sleek." Shown four lockups: "Pic c for the splash screen." And on
// the dots themselves: "Just 1 gold dot either side."
//
// REPRODUCED FROM THE APP, NOT REINTERPRETED. Every number here is the app's
// own (.bm-name / .bm-word / .bm-dot in the Valhalla runtime), because the
// whole point of a mark is that it is the same object in both places. The
// website had drifted into its own wordmark once already — a metallic gold
// "Velvet Viking" in Cinzel — and that treatment has been deleted on the app
// side, so copying the app is the only way this does not drift again.
//
// WHY CINZEL AND NOT THE HEADING SANS. The app set the bar in Oswald and the
// splash in Cinzel, which made one mark in two typefaces, which is two marks.
// Founder, shown the name five ways: "Type face. Option 2." Cinzel, everywhere
// the name is the mark. The website already loads Cinzel as --font-display, so
// this is the same face and not a near match.
//
// THE NEGATIVE MARGIN IS NOT A NUDGE. letter-spacing adds its track AFTER the
// final letter too, so the gap from the last O to the right dot renders one
// full track wider than the gap from the left dot to the S. The box really is
// that wide, so centring cannot fix it; -0.17em takes the trailing track back.
//
// NO ARTWORK, DELIBERATELY. This is type and two circles. There is no raster
// master to keep in sync, nothing to re-export at 2x, and it stays sharp at
// any size — which is most of why the crest it replaces was retired.

type WordmarkProps = {
  /** The mark's cap height driver. Any CSS length, including a clamp(). */
  size?: string;
  /** Gap between each dot and the word. Scales with the mark by default. */
  gap?: string;
  /** Dot diameter. The app pins 7px at bar size. */
  dot?: string;
  /**
   * A pinned line box for the word. The app does this on .bm-word
   * (line-height:36px) for a reason worth copying: the font-size is a clamp(),
   * so without it the mark's height — and anything measuring the bar it sits
   * in — slides continuously with viewport width. Leave it unset where the
   * mark is free to be whatever height it wants, as in the hero.
   */
  lineHeight?: string;
  className?: string;
  /**
   * The soft white lift the app's hero titles carry, so the mark belongs to
   * the screen rather than sitting on it. Dark surfaces only — on ivory it
   * would be a smudge, which is why it is opt-in rather than always on.
   */
  lift?: boolean;
};

export default function Wordmark({
  size = "clamp(1.22rem, 6.2vw, 1.62rem)",
  gap = "0.68em",
  dot = "7px",
  lineHeight,
  className = "",
  lift = false,
}: WordmarkProps) {
  return (
    <span
      className={`inline-flex min-w-0 items-center justify-center ${className}`}
      style={{ gap }}
    >
      <Dot size={dot} />
      <span
        className="font-display font-semibold whitespace-nowrap uppercase"
        style={{
          fontSize: size,
          letterSpacing: "0.17em",
          marginRight: "-0.17em",
          ...(lineHeight ? { lineHeight } : null),
          ...(lift
            ? {
                textShadow:
                  "0 0 1px rgba(255,255,255,.42), 0 0 13px rgba(255,255,255,.26), 0 0 34px rgba(255,255,255,.10)",
              }
            : null),
        }}
      >
        Sacoro
      </span>
      <Dot size={dot} />
    </span>
  );
}

// flex-none so a narrow phone shrinks the tracking rather than the dots — the
// app's rule, and the reason the mark survives 360px without a breakpoint.
function Dot({ size }: { size: string }) {
  return (
    <span
      aria-hidden
      className="block flex-none rounded-full bg-vv-gold-bright"
      style={{
        width: size,
        height: size,
        boxShadow: "0 0 8px color-mix(in srgb, var(--vv-gold-bright) 45%, transparent)",
      }}
    />
  );
}
