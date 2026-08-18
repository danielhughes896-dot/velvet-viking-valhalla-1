"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Crest from "@/components/ui/Crest";
import { brand, nav } from "@/content/site";
import { commerceSeams } from "@/content/commerce";

const subscribeNoop = () => () => {};

// Used both to focus the first link on open and to keep Tab/Shift+Tab
// cycling within the panel while it's open — a full-screen overlay is a
// modal, and a modal with underlying page content still in the DOM needs
// its own focus trap or a keyboard user tabs straight through it.
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Tracks a genuine open->close transition so focus is only ever handed
  // back to the button after the menu was actually open — not on first
  // mount, when open starts false and nothing should steal focus.
  const wasOpenRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // FINAL QA FIX PASS: move focus into the panel on open (first link, not
  // the panel itself, so a keyboard/AT user lands somewhere meaningful) and
  // back to the button that opened it on close.
  useEffect(() => {
    if (open) {
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();
      wasOpenRef.current = true;
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      buttonRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      // Focus trap: while the panel is open, Tab/Shift+Tab cycle only
      // within its own focusable elements instead of escaping into the
      // page content sitting behind the overlay.
      const focusable = panelRef.current
        ? Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        : [];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
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
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-vv-bg"
            >
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
                    // FINAL QA FIX PASS: was text-vv-ink-faint/50 — stacking
                    // 50% opacity on an already-muted token dropped this
                    // below AA contrast for small text. The unmodified
                    // token alone still reads as visually quieter than the
                    // active links above (it's a full color-token step
                    // down), so dropping the opacity modifier keeps the
                    // "disabled" feel while meeting a real contrast floor.
                    className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-vv-ink-faint"
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
