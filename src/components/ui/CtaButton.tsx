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

// FOCUS RING, NAMED RATHER THAN INHERITED. Tailwind's outline-2 sets a width
// and leaves the colour at currentColor, so the cherry button — whose label is
// white — was drawing a WHITE focus ring on an ivory page. A keyboard user
// tabbing to the site's primary commercial action saw nothing at all. Pinned
// to the deep gold, which is the one accent that reads on every ground this
// button appears on: 4.9:1 on ivory, and on the dark sections it sits against
// the button's own near-black fill rather than the page.
//
// min-h-11 is 44px, the floor the Valhalla app enforces on every control it
// ships (".btn:not(.btn-sm){min-height:44px}"). This button's own padding came
// to 43.5px, which cleared nothing and matched nothing; the padding is left
// alone because it sets the optical weight, and a floor is added instead, so
// nothing that already passed moves.
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-vv-sm px-6 py-3 font-head text-[13px] font-semibold uppercase tracking-[0.14em] transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vv-gold-deep";

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
