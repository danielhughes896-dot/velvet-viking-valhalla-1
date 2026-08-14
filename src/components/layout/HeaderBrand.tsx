"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Crest from "@/components/ui/Crest";

// The header's brand mark always links home. On secondary pages it also
// carries a restrained "←" cue so a visitor who lands directly on
// /philosophy, /about, /valhalla, etc. (no browser-back history to rely on)
// has one clear, always-visible route back — without a second, competing
// nav element or an in-body back button.
export default function HeaderBrand() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <Link
      href="/"
      className="group flex items-center gap-3"
      aria-label={isHome ? "Velvet Viking home" : "Back to Velvet Viking home"}
    >
      {!isHome ? (
        <span
          aria-hidden="true"
          className="font-head text-sm text-vv-ink-faint transition-colors group-hover:text-vv-ink"
        >
          ←
        </span>
      ) : null}
      <Crest size={36} />
      <span className="font-display text-metallic text-sm font-bold uppercase tracking-[0.2em] whitespace-nowrap sm:text-base">
        Velvet Viking
      </span>
    </Link>
  );
}
