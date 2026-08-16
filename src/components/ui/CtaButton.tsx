import Link from "next/link";
import type { ReactNode } from "react";

type CtaButtonProps = {
  /** Nullable so a not-yet-live backend seam (commerceSeams.* in
   * content/commerce.ts) can render this exact CTA in its pending state,
   * rather than a component that only knows how to be a working link —
   * same convention as the nullable footer.social URLs. */
  href: string | null;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  onClick?: () => void;
  /** Shown as a title/sr-only note when href is null. */
  pendingLabel?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-vv-sm px-6 py-3 font-head text-[13px] font-semibold uppercase tracking-[0.14em] transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2";

// Flat single-color fill, not a gradient: under the prototype's near-black
// palette a two-stop bronze gradient's dark end measures 3.81:1 against
// bronze-ink text, failing WCAG AA (needs 4.5:1 for 13px bold). Flat
// vv-bronze/vv-bronze-ink measures 7.85:1. Gradient tokens stay in
// globals.css for decorative, non-text uses (the wordmark rule).
const variants = {
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
