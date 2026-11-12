"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

// THE MASTHEAD IS DARK IN BOTH STATES.
//
// Founder: "The [top] bar is white when you scroll. Make it black."
//
// It was ivory once scrolled, which made the bar a different object depending
// on where you were — dark and seamless inside the hero, then a cream band
// over the rest of the page. The product's own chrome is dark everywhere, and
// a masthead is chrome rather than content, so it stops changing allegiance:
// transparent while it is sitting inside the hero's own dark, solid dark the
// moment there is something else behind it.
//
// .theme-dark IS ON BOTH BRANCHES NOW, so nothing inside has to know which
// state it is in — the mark, the byline, the sign-in link and the menu all
// resolve against the dark ramp either way, and only the background and the
// border change.
//
// THE OPACITY WENT WITH THE IVORY. bg-vv-bg/95 was "still soft, not a flat app
// toolbar", which was harmless while everything scrolling under it was ivory
// on ivory; against a dark bar it would show the ivory page as a bright haze.
// AND NO HAIRLINE. On cream a bottom border was a darker line, which read as
// an edge. On black it is a LIGHTER line — rgb(37,36,41) against rgb(21,20,23)
// — so the thing meant to tidy the boundary was the brightest object in it.
// The bar is opaque and the page behind it is the same black, so there is no
// boundary left to draw.
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
          : "theme-dark sticky top-0 z-50 bg-vv-bg text-vv-ink transition-colors duration-300"
      }
    >
      {children}
    </header>
  );
}
