import Link from "next/link";
import { footer } from "@/content/site";

const PLATFORMS = [
  { key: "instagram", label: "Instagram" },
  { key: "strava", label: "Strava" },
  { key: "youtube", label: "YouTube" },
  { key: "tiktok", label: "TikTok" },
] as const;

// Renders only platforms with a real URL set in content/site.ts
// (footer.social) -- with every value null today, this renders nothing.
// That's intentional: a row of disabled icons would still imply accounts
// exist. Add a URL later and that single platform activates automatically
// — no component change required, and no fake/placeholder links are ever
// rendered in the meantime.
export default function SocialLinks() {
  const active = PLATFORMS.filter((p) => footer.social[p.key]);
  if (active.length === 0) return null;

  return (
    <ul className="flex items-center justify-center gap-6">
      {active.map((p) => (
        <li key={p.key}>
          <Link
            href={footer.social[p.key] as string}
            target="_blank"
            rel="noopener noreferrer"
            className="font-head text-xs font-medium uppercase tracking-[0.2em] text-vv-ink-faint transition-colors hover:text-vv-ink"
          >
            {p.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
