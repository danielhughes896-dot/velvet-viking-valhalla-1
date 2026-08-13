import Link from "next/link";
import Crest from "@/components/ui/Crest";
import { footer } from "@/content/site";

export default function Footer() {
  return (
    <footer className="border-t border-vv-line-soft bg-vv-bg">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Crest size={32} />
              <span className="font-display text-metallic text-sm font-bold uppercase tracking-[0.2em]">
                Velvet Viking
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-vv-ink-faint">
              Valhalla Awaits. Earn Your Place.
            </p>
          </div>

          {footer.columns.map((col) => (
            <div key={col.heading}>
              <h3 className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-vv-ink-faint">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-vv-ink-dim transition-colors hover:text-vv-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-vv-line-soft pt-8">
          <p className="text-xs text-vv-ink-faint">{footer.legalLine}</p>
        </div>
      </div>
    </footer>
  );
}
