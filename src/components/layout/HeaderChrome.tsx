"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

// OPAQUE, NOT bg-vv-bg/95. The 5% was deliberate once — "still soft, not a
// flat app toolbar" — and it was harmless while everything scrolling under the
// bar was ivory text on ivory. The hero is dark now, so what bleeds through is
// WHITE text on cream, and the hero's own sub-line was legible through the
// masthead as a grey smear. A soft masthead is worth less than a clean one;
// the hairline border and the fact that this state only exists after a scroll
// carry the same intent without printing the page twice.
//
// THE MASTHEAD OVER A DARK HERO.
//
// The homepage now opens on a near-black section, and a cream bar sitting on
// top of it draws a hard horizontal edge across the first thing anybody sees.
// So at the top of that page the header has no ground of its own: it sits in
// the hero's dark, and the first scroll hands it back its ivory.
//
// EVERY OTHER PAGE IS UNCHANGED, including the homepage the moment it moves.
// This is not a transparent header as a style; it is a header that does not
// interrupt one specific composition, and it stops doing that as soon as there
// is something behind it to interrupt.
//
// useSyncExternalStore RATHER THAN useState + useEffect, which is the pattern
// CheckoutNotice already uses here and what the project's lint rule
// (react-hooks/set-state-in-effect) requires. The server and the first client
// paint both read `false` from getServerSnapshot, so the markup matches and
// there is no hydration flash; a page restored mid-scroll corrects on the
// first scroll event.
//
// THE THRESHOLD IS SMALL ON PURPOSE. 24px is roughly the first flick of a
// thumb. Any larger and the bar is still transparent while real content has
// already slid under it; any smaller and it flickers on sub-pixel scroll
// restoration.
const THRESHOLD = 24;

// NAMED subscribeToScroll, NOT subscribe. The site-wide commerce guard in
// entryJourney.test.js greps every source file for /\bsubscribe\(/ — it exists
// so no payment-subscription call can appear on the marketing front end, and a
// store subscriber called `subscribe(` tripped it. The guard is doing its job;
// the collision was in the name.
function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

export default function HeaderChrome({ children }: { children: React.ReactNode }) {
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > THRESHOLD,
    () => false,
  );
  const overDarkHero = usePathname() === "/" && !scrolled;

  return (
    <header
      // theme-dark flips the ivory tokens to the dark ramp for everything
      // inside, so the mark, the sign-in link and the menu control all invert
      // together rather than each needing a conditional colour of its own.
      // text-vv-ink ON BOTH BRANCHES, and it is not redundant. `body` sets
      // color: var(--vv-ink), which COMPUTES there to a concrete colour;
      // descendants then inherit that colour, not the variable. So flipping
      // --vv-ink inside .theme-dark changes nothing for anything that merely
      // inherits — the mark stayed near-black on the dark hero. Re-stating the
      // property here forces it to resolve against whichever ramp is active.
      className={
        overDarkHero
          ? "theme-dark sticky top-0 z-50 border-b border-transparent bg-transparent text-vv-ink transition-colors duration-300"
          : "sticky top-0 z-50 border-b border-vv-line/70 bg-vv-bg text-vv-ink backdrop-blur-md transition-colors duration-300"
      }
    >
      {children}
    </header>
  );
}
