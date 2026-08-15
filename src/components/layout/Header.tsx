import Link from "next/link";
import CtaButton from "@/components/ui/CtaButton";
import MobileNav from "@/components/layout/MobileNav";
import HeaderBrand from "@/components/layout/HeaderBrand";
import { nav } from "@/content/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-vv-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 sm:px-8">
        <HeaderBrand />

        <nav className="hidden items-center gap-9 md:flex">
          {nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-head text-[13px] font-medium uppercase tracking-[0.16em] text-vv-ink-dim transition-colors hover:text-vv-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <CtaButton href={nav.cta.href}>{nav.cta.label}</CtaButton>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
