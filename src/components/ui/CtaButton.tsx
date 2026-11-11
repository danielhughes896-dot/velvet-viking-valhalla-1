import Link from "next/link";
import type { ReactNode } from "react";

type CtaButtonProps = {
  /** Nullable so a not-yet-live backend seam (commerceSeams.* in
   * content/commerce.ts) can render this exact CTA in its pending state,
   * rather than a component that only knows how to be a working link —
   * same convention as the nullable footer.social URLs. */
  href: string | null;
  children: ReactNode;
  /**
   * "cherry" is the action that moves a prospective athlete into plan
   * creation, and nothing else. See the variants table below.
   */
  variant?: "primary" | "ghost" | "cherry";
  className?: string;
  onClick?: () => void;
  /** Shown as a title/sr-only note when href is null. */
  pendingLabel?: string;
};

// NO FOCUS UTILITIES HERE. The focus ring is the one global rule in
// globals.css — `:focus-visible { outline: 2px solid var(--vv-gold) }` — and
// this button inherits it like every other control on the site. One ring, one
// definition, nothing to drift.
//
// CORRECTING AN EARLIER NOTE THAT STOOD HERE: it claimed the ring rendered
// WHITE on this button and was invisible to a keyboard user. That was wrong,
// and it is worth recording why so nobody re-fixes it. The reading came from
// getComputedStyle().outlineColor, which reports the element's own
// outline-color property — initial value `currentColor`, i.e. this button's
// white label — rather than the value the :focus-visible rule actually paints.
// Screenshotting the focused button settles it: the ring is gold, it always
// was, and it is gold with these utilities absent or present. Measure focus
// rings by looking at them.
//
// min-h-11 is 44px, the floor the Sacoro app enforces on every control it
// ships (".btn:not(.btn-sm){min-height:44px}"). This button's own padding came
// to 43.5px, which cleared nothing and matched nothing; the padding is left
// alone because it sets the optical weight, and a floor is added instead, so
// nothing that already passed moves.
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-vv-sm px-6 py-3 font-head text-[13px] font-semibold uppercase tracking-[0.14em] transition duration-200";

// THREE JOBS, THREE FILLS.
//
//   cherry   THE ACTION THAT STARTS A PLAN, and only that. Cherry Lacquer is
//            the app's accent for "the button that moves the athlete forward",
//            so the colour pressed to begin on this site is the colour met
//            again inside the builder. Solid, not a gradient — that was the
//            violet this replaced in the app, and a flat fill is what makes it
//            read as one deliberate colour rather than a surface with a sheen.
//            The 1px rim is what gives a dark fill an edge in the dark
//            sections without lightening its face back into rose.
//   primary  EXPLORATION AND BRAND ACTIONS — the gold the site has always
//            used, now on the app's own bronze. Flat, not a gradient: under a
//            near-black ground a two-stop bronze gradient's dark end measures
//            3.81:1 against bronze-ink text, failing AA for 13px semibold.
//            Flat vv-bronze on vv-bronze-ink measures 6.6:1. Gradient tokens
//            stay in globals.css for decorative, non-text uses (the wordmark).
//   ghost    QUIET SECONDARY ACTIONS, unchanged.
//
// Gold is still the brand. Cherry is a closed set of one job — see the test
// that fails if it spreads.
const variants = {
  cherry:
    "bg-vv-cherry-fill text-vv-cherry-ink shadow-[inset_0_0_0_1px_var(--vv-cherry)] hover:brightness-110",
  primary: "bg-vv-bronze text-vv-bronze-ink hover:brightness-110",
  ghost: "border border-vv-line text-vv-ink hover:border-vv-bronze",
};

export default function CtaButton({
  href,
  children,
  variant = "primary",
  className = "",
  onClick,
  pendingLabel = "Coming soon",
}: CtaButtonProps) {
  if (href === null) {
    // Not a link: unfocusable, no href, so it can never resolve as a fake
    // success path. Visually present at reduced opacity, same shape as the
    // live button, with the pending state exposed to assistive tech too.
    return (
      <span
        aria-disabled="true"
        title={pendingLabel}
        className={`${base} ${variants[variant]} cursor-not-allowed opacity-45 ${className}`}
      >
        {children}
        <span className="sr-only"> — {pendingLabel}</span>
      </span>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
