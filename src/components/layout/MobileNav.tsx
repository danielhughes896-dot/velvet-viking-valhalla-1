"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Crest from "@/components/ui/Crest";
import { brand, nav } from "@/content/site";
import { commerceSeams } from "@/content/commerce";

const subscribeNoop = () => () => {};

// SSR-safe "has this hydrated on the client yet" check, without the extra
// render a useState+useEffect("mounted") pair would cost — the portal
// target (document.body) only exists client-side, so the overlay can't
// render during SSR regardless of `open`.
function useIsClient() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

// Display-only relabeling ("Valhalla" -> "Valhalla App") for navigation
// clarity — the product's real name (nav.links / site.ts) is untouched.
const menuLinks = [
  { label: "Home", href: "/" },
  ...nav.links.map((link) => (link.href === "/valhalla" ? { ...link, label: "Valhalla App" } : link)),
];

// Despite the filename (kept to avoid an unrelated rename), this is now the
// site's ONE navigation surface at every breakpoint — the header carries no
// inline links or CTA of its own. Full-screen on mobile, near-full-screen
// (generously proportioned, not a cramped dropdown) on desktop, so the same
// component reads as intentional rather than "the mobile pattern, stretched."
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  // Portaled to <body> so `fixed inset-0` sizes against the real viewport —
  // as a Header descendant it would instead size against the header bar,
  // because the header's backdrop-blur establishes a containing block for
  // fixed descendants.
  const isClient = useIsClient();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`block h-px w-6 bg-vv-ink transition-transform duration-200 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
        />
        <span
          className={`block h-px w-6 bg-vv-ink transition-transform duration-200 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
        />
      </button>

      {open && isClient
        ? createPortal(
            <div className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-vv-bg">
              {/* justify-center still centers this block within the padded
                  box, but pt < pb shifts that center upward — a controlled
                  nudge toward the masthead rather than a top-anchored
                  layout, so the space above HOME shrinks while generous
                  room remains below (before the footer block). */}
              <div className="flex flex-1 flex-col items-center justify-center gap-10 px-8 pt-16 pb-28">
                <nav
                  aria-label="Primary"
                  className="flex flex-col items-center gap-7 sm:gap-8 md:gap-9"
                >
                  {menuLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="font-display text-4xl font-semibold uppercase tracking-[0.03em] text-vv-ink transition-colors hover:text-vv-gold-text sm:text-5xl md:text-6xl"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex flex-col items-center gap-5 border-t border-vv-line-soft px-8 py-8">
                {/* Returning-athlete entry, deliberately quiet (small tracked
                    text, not a display link) so it reads as a secondary
                    utility action rather than a fifth brand destination.
                    Nullable seam: commerceSeams.signIn is null until the
                    account/entitlement system lands, so this renders
                    inactive rather than a fake sign-in link — same pattern
                    as SocialLinks. */}
                {commerceSeams.signIn ? (
                  <Link
                    href={commerceSeams.signIn}
                    onClick={() => setOpen(false)}
                    className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-vv-ink-dim transition-colors hover:text-vv-bronze-text"
                  >
                    {nav.signIn.label}
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    title="Coming soon"
                    className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-vv-ink-faint/50"
                  >
                    {nav.signIn.label}
                    <span className="sr-only"> — Coming soon</span>
                  </span>
                )}

                <Crest size={40} />
                <p className="font-head text-[11px] uppercase tracking-[0.24em] text-vv-ink-faint">
                  {brand.name}
                </p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
