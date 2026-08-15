import HeaderBrand from "@/components/layout/HeaderBrand";
import MobileNav from "@/components/layout/MobileNav";

// Prototype header: wordmark + a single universal menu control, at every
// breakpoint. No inline nav links, no permanent CTA — both now live inside
// the full-screen menu (see MobileNav, active on desktop too despite the
// filename).
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
        <MobileNav />
      </div>
    </header>
  );
}
