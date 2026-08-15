import Image from "next/image";
import crest from "../../../public/brand/velvet-viking-crest.png";

type CrestProps = {
  /** A pixel number, or any valid CSS size string (e.g. a `clamp(...)`
   * expression) for true responsive scaling without breakpoint-specific
   * duplicate <Crest> instances. */
  size?: number | string;
  className?: string;
  /** Wrap in a dark card so the crest's own dark field doesn't clash when
   * placed on a light-theme section. Skip on dark sections — the crest's
   * background already matches. */
  framed?: boolean;
};

// The approved Velvet Viking crest, reproduced as-is (see brand guidance:
// wording, composition and gold/navy identity are not to be altered). Only
// a raster master exists today; this component is the single place the
// artwork is referenced, so swapping in a mastered SVG later is a one-line
// change rather than a page redesign.
export default function Crest({ size = 96, className = "", framed = false }: CrestProps) {
  const dimension = typeof size === "number" ? `${size}px` : size;
  const sizesHint = typeof size === "number" ? `${size}px` : "340px";
  const img = (
    <Image
      src={crest}
      alt="The Velvet Viking crest — Valhalla Awaits, Earn Your Place"
      className="h-full w-full object-contain"
      priority
      sizes={sizesHint}
    />
  );

  if (!framed) {
    return (
      <span
        className={`inline-block ${className}`}
        style={{ width: dimension, height: dimension }}
      >
        {img}
      </span>
    );
  }

  return (
    <span
      className={`inline-block rounded-full bg-vv-bg p-2 shadow-vv ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      {img}
    </span>
  );
}
