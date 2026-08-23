import Link from "next/link";
import HeaderBrand from "@/components/layout/HeaderBrand";
import MobileNav from "@/components/layout/MobileNav";
import CtaButton from "@/components/ui/CtaButton";
import { nav, appSignInUrl } from "@/content/site";
import { buildUrl } from "@/content/journey";

// Wordmark, the two public actions, and one universal menu control.
//
// THE ACTIONS WERE MISSING ENTIRELY. Until this pass the masthead carried no
// CTA and no sign-in at any breakpoint, so every acquisition action on the
// site required opening the menu first and every returning athlete found a
// "Sign In — Coming soon" label when they got there. The nav links themselves
// stay in the menu: they are five editorial destinations and putting them
// inline would turn this into an ordinary product toolbar.
//
// DESKTOP ONLY, and deliberately. At 390px the wordmark, two buttons and the
// menu control do not fit without shrinking the wordmark to a logo-ish chip,
// which is a worse trade than one extra tap. On mobile the same two actions
// are the first things inside the menu, and the hero's own primary button is
// visible without scrolling.
//
// bg-vv-bg here always resolves to the ivory :root tokens — Header isn't a
// descendant of any .theme-dark section, so the custom property itself
// never changes. What DID visibly shift was the dark section behind it
// showing through the translucency (bg-vv-bg/90 + blur) as it scrolled
// underneath. Raised to /95 (still soft, not a flat app toolbar) and given
// a hairline bottom border — using the header's own (always-ivory) line
// token — so the masthead reads as one stable object over every section.
export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-vv-line/70 bg-vv-bg/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5 sm:px-8">
        <HeaderBrand />
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <CtaButton
              href={buildUrl}
              variant="cherry"
              className="px-4 py-2 text-[11px] tracking-[0.12em]"
            >
              {nav.cta.label}
            </CtaButton>
            <Link
              href={appSignInUrl}
              className="font-head text-[11px] font-semibold uppercase tracking-[0.14em] text-vv-ink-dim transition-colors hover:text-vv-bronze-text"
            >
              {nav.signIn.label}
            </Link>
          </div>
          <MobileNav />
        </div>
      </div>
      {/* PHASE 4: MobileNav's link list only ever exists in the DOM via a
          client portal gated on hydration (useIsClient) — without JS, the
          hamburger button is inert AND the nav links themselves are never
          rendered at all, leaving only the "/" wordmark reachable. This
          <noscript> fallback is the browser's own JS-off/JS-on switch, not
          React state, so it is inert and invisible whenever scripting is
          enabled — the approved MobileNav experience is byte-for-byte
          unchanged for every real visitor. Reuses Footer's existing
          legal-link styling rather than inventing a new visual treatment. */}
      <noscript>
        <nav
          aria-label="Primary"
          className="border-t border-vv-line-soft bg-vv-bg px-6 py-3 sm:px-8"
        >
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {nav.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-head text-xs font-medium uppercase tracking-[0.15em] text-vv-ink-faint hover:text-vv-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </noscript>
    </header>
  );
}
