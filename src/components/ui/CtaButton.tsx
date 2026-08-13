import Link from "next/link";
import type { ReactNode } from "react";

type CtaButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-vv-sm px-7 py-3.5 font-head text-[13px] font-semibold uppercase tracking-[0.14em] transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2";

const variants = {
  primary:
    "bg-linear-to-br from-vv-bronze to-vv-bronze-2 text-vv-bronze-ink hover:brightness-110",
  ghost:
    "border border-vv-line text-vv-ink hover:border-vv-bronze",
};

export default function CtaButton({
  href,
  children,
  variant = "primary",
  className = "",
}: CtaButtonProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
