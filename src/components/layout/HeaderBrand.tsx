import Link from "next/link";

// Text-only wordmark, no crest — the crest's only appearance in the opening
// viewport is now the (much larger) hero mark. This link is also the site's
// universal "Home" control: the old dedicated back-arrow has been removed
// entirely in favor of this single, consistent affordance on every page.
export default function HeaderBrand() {
  return (
    <Link
      href="/"
      aria-label="Velvet Viking — home"
      // LAUNCH AUDIT: the wordmark rendered 274px wide at 30px, and a 360px
      // phone leaves 312px between the header's own 24px gutters — 274 plus the
      // 40px menu control is 314, so every page overflowed by 2px and could be
      // dragged sideways. 360px is a real Android width, not a theoretical one.
      // Dropped one step at the smallest sizes only; 390px and up are
      // untouched, and whitespace-nowrap still stops it wrapping.
      className="font-display text-metallic text-[26px] font-bold uppercase tracking-[0.08em] whitespace-nowrap min-[380px]:text-[30px] sm:text-[32px]"
    >
      Velvet Viking
    </Link>
  );
}
