import Link from "next/link";
import SocialIcon from "@/components/ui/SocialIcon";
import { footer } from "@/content/site";

const PLATFORMS = [
  { key: "instagram", label: "Instagram" },
  { key: "strava", label: "Strava" },
  { key: "youtube", label: "YouTube" },
  { key: "tiktok", label: "TikTok" },
] as const;

// ONLY PLATFORMS WITH A REAL DESTINATION.
//
// WAS: all four rendered unconditionally, and a null URL in content/site.ts
// produced a greyed-out, unclickable mark labelled "— coming soon". That was
// the right call for a site nobody could buy from — the row's design could be
// finished ahead of the accounts existing. It is the wrong call for a
// commercial launch: four dead controls in the footer of a page asking for a
// card read as an unfinished site, which is precisely the doubt a first
// customer cannot afford to have.
//
// So the row now renders what exists and nothing else. All four URLs are null
// today, so it renders nothing at all and the footer closes on the legal
// links. NO URL IS INVENTED HERE: add a genuine account to footer.social and
// that platform reappears as an ordinary external link with no change to this
// component.
export default function SocialLinks() {
  const live = PLATFORMS.filter((p) => footer.social[p.key]);
  if (live.length === 0) return null;

  return (
    <ul className="flex items-center justify-center gap-5">
      {live.map((p) => (
        <li key={p.key}>
          <Link
            href={footer.social[p.key] as string}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={p.label}
            className="block text-vv-ink transition-colors hover:text-vv-cherry-text"
          >
            <SocialIcon platform={p.key} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
