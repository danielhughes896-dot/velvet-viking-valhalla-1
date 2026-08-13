import Link from "next/link";
import Crest from "@/components/ui/Crest";
import CtaButton from "@/components/ui/CtaButton";
import MobileNav from "@/components/layout/MobileNav";
import { nav } from "@/content/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-vv-line-soft bg-vv-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Velvet Viking home">
          <Crest size={36} />
          <span className="font-display text-metallic text-sm font-bold uppercase tracking-[0.2em] whitespace-nowrap sm:text-base">
            Velvet Viking
          </span>
        </Link>

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
