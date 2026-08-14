type SocialIconProps = {
  platform: "instagram" | "strava" | "youtube" | "tiktok";
  className?: string;
};

// Hand-drawn, not an icon-library import — four glyphs don't justify a new
// dependency. Deliberately monoline and simplified rather than a literal
// reproduction of each brand mark: these are editorial signals ("this is
// Instagram"), not brand-asset-accurate logos, sized to stay subordinate to
// the Velvet Viking wordmark above them.
export default function SocialIcon({ platform, className = "" }: SocialIconProps) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    className,
    "aria-hidden": true as const,
  };

  switch (platform) {
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.5}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "strava":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round">
          <path d="M9 3.5 15 14h-4.2l2.6 6-8.4-11.3H9z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.5}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="M10 9.3v5.4l5-2.7-5-2.7z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="9.5" cy="16.5" r="3" />
          <path d="M12.5 17V4.5a4.5 4.5 0 0 0 4.5 4.5" strokeLinecap="round" />
        </svg>
      );
  }
}
