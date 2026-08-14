import Link from "next/link";
import SocialIcon from "@/components/ui/SocialIcon";
import { footer } from "@/content/site";

const PLATFORMS = [
  { key: "instagram", label: "Instagram" },
  { key: "strava", label: "Strava" },
  { key: "youtube", label: "YouTube" },
  { key: "tiktok", label: "TikTok" },
] as const;

// Always renders all four platforms — the row's design can be finished
// ahead of the real accounts existing, rather than disappearing until they
// do. A null URL in content/site.ts renders a visible but inactive mark:
// not a link, not focusable, never a fake "#" href. Add a real URL there
// later and that one platform becomes an ordinary external link with no
// component change — nothing here hard-codes a destination.
export default function SocialLinks() {
  return (
    <ul className="flex items-center justify-center gap-5">
      {PLATFORMS.map((p) => {
        const href = footer.social[p.key];
        return (
          <li key={p.key}>
            {href ? (
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={p.label}
                className="block text-vv-ink-faint transition-colors hover:text-vv-bronze-text"
              >
                <SocialIcon platform={p.key} />
              </Link>
            ) : (
              <span className="block text-vv-ink-faint/35" title={`${p.label} — coming soon`}>
                <SocialIcon platform={p.key} />
                <span className="sr-only">{p.label} — coming soon</span>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
