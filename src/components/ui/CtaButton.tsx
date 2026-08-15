import Link from "next/link";
import type { ReactNode } from "react";

type CtaButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  onClick?: () => void;
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
}: CtaButtonProps) {
  return (
    <Link href={href} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
