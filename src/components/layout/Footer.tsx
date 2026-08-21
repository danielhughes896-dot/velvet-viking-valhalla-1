import Link from "next/link";
import SocialLinks from "@/components/layout/SocialLinks";
import { footer } from "@/content/site";
import { tradingDisclosure, publicLegalLinks } from "@/content/legal";

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

        {/* PRIVATE BETA: only the documents actually approved for publication
            appear here — see publicLegalLinks in @/content/legal. Terms and
            Cookies stay off this list while LEGAL_APPROVALS.terms/.cookies
            are false, and reappear on their own the moment either flips,
            with no change required here. */}
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {/* SUPPORT IS NOT APPROVAL-GATED, and sits deliberately outside
              publicLegalLinks. That list is derived from LEGAL_APPROVALS
              because a legal document may only appear once HQ has approved
              its wording. A support address carries no such risk: it is
              always correct to tell someone how to reach us, and the app
              stores, Garmin and Stripe all require the route to be reachable
              from the site regardless of what legal copy is published. */}
          <li>
            <Link
              href="/support"
              className="font-head text-xs font-medium uppercase tracking-[0.15em] text-vv-ink-faint transition-colors hover:text-vv-ink"
            >
              Support
            </Link>
          </li>
          {publicLegalLinks.map((link) => (
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

        {/* STATUTORY TRADING DISCLOSURE.
            Required on a company's website by the Companies (Trading
            Disclosures) Regulations 2008, and it belongs here rather than
            anywhere louder: it is a legal obligation, not a marketing message,
            and the hero is not the place for a company number.

            Rendered from confirmed facts only. While the company number,
            place of registration and registered office are still placeholders
            in @/content/legal, this prints the registered name alone and adds
            each remaining line automatically once the fact is supplied — no
            code change, and no possibility of a "[TO BE CONFIRMED: ...]"
            string reaching a visitor. */}
        <address className="max-w-md text-[0.6875rem] not-italic leading-relaxed text-vv-ink-faint">
          {tradingDisclosure.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
      </div>
    </footer>
  );
}
