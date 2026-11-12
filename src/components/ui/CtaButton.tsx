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
// min-h-11 is 44px, the floor the Valhalla app enforces on every control it
// ships (".btn:not(.btn-sm){min-height:44px}"). This button's own padding came
// to 43.5px, which cleared nothing and matched nothing; the padding is left
// alone because it sets the optical weight, and a floor is added instead, so
// nothing that already passed moves.
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-vv-sm px-6 py-3 font-head text-[13px] font-semibold uppercase tracking-[0.14em] transition duration-200";

// CHERRY IS THE HIERARCHY NOW, NOT A CLOSED SET OF ONE.
//
// Founder's rule, from the app's review pass: "Gold = brand/destination/
// milestone. Cherry = active/training/interaction. White = information.
// Green = complete/good."
//
// This file used to encode the opposite. `cherry` was "THE ACTION THAT STARTS
// A PLAN, and only that" and `primary` was gold — so the site painted most of
// its buttons in the brand colour and reserved the interaction colour for one.
// Under the rule above a button is interaction by definition, whatever it
// links to, so gold comes off all three variants and cherry goes on.
//
// WHAT GOLD KEEPS, and it is not a consolation prize: the mark's two dots, the
// hero rule, every eyebrow and section label, the timeline's milestone
// markers. Brand, destination and milestone — exactly the list. The app did
// the same thing in the same pass: gold kept the wordmark, the carousel dots
// and the phase slides, and came off the builder and Settings.
//
//   cherry   THE ACTION THAT MOVES SOMEBODY FORWARD. Solid, not a gradient —
//            that was the violet this replaced in the app, and a flat fill
//            reads as one deliberate colour rather than a surface with a
//            sheen. The 1px rim gives a dark fill an edge in the dark sections
//            without lightening its face back into rose.
//   primary  EVERY OTHER REAL ACTION. Was flat bronze; now the same cherry
//            face at a lighter weight than the solid fill, so the two read as
//            one family with a clear order rather than two different offers.
//   ghost    QUIET SECONDARY ACTIONS. The hover was the one place gold still
//            touched an interaction, and it is now cherry.
const variants = {
  cherry:
    "bg-vv-cherry-fill text-vv-cherry-ink shadow-[inset_0_0_0_1px_var(--vv-cherry)] hover:brightness-110",
  primary:
    "border border-vv-cherry-line bg-vv-cherry-soft/0 text-vv-cherry-text hover:border-vv-cherry hover:bg-vv-cherry-fill hover:text-vv-cherry-ink",
  ghost: "border border-vv-line text-vv-ink hover:border-vv-cherry",
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
