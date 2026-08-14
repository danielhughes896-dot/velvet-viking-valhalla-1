import Link from "next/link";
import SocialLinks from "@/components/layout/SocialLinks";
import { footer } from "@/content/site";

// A quiet close, not a site directory: no repeat of the primary nav
// (Philosophy/About/Valhalla are one click away in the header already), and
// no fused "Valhalla Awaits. Earn Your Place." — that pairing is the hero's
// alone. "Earn Your Place." here is Velvet Viking's own line. No top border
// either: the final CTA above should settle into this rather than hit a
// hard edge — the footer's much quieter type/density already reads as a
// distinct, calmer close without needing a line to announce it.
export default function Footer() {
  return (
    <footer className="bg-vv-bg">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-16 text-center sm:px-8">
        <div>
          <span className="font-display text-metallic text-sm font-bold uppercase tracking-[0.2em]">
            Velvet Viking
          </span>
          <p className="mt-3 text-sm text-vv-ink-faint">{footer.tagline}</p>
        </div>

        <SocialLinks />

        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {footer.legalLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-head text-xs font-medium uppercase tracking-[0.15em] text-vv-ink-faint transition-colors hover:text-vv-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-xs text-vv-ink-faint">{footer.legalLine}</p>
      </div>
    </footer>
  );
}
