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
      className="font-display text-metallic text-[30px] font-bold uppercase tracking-[0.08em] whitespace-nowrap sm:text-[32px]"
    >
      Velvet Viking
    </Link>
  );
}
