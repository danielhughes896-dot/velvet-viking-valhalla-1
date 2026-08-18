import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import type { StaticImageData } from "next/image";

type DeviceFrameProps = {
  kind: "mobile" | "desktop";
  label: string;
  className?: string;
  /** REAL-IMAGERY PASS: a real screenshot for this frame. object-contain by
   * default (see PlaceholderMedia) so a genuine app screen is never cropped
   * to fit a fashionable bezel ratio — the bezel adapts to the screenshot,
   * not the other way round. */
  src?: StaticImageData | string;
  alt?: string;
  priority?: boolean;
};

// Bezel is intentionally minimal — a hairline frame, not a glossy 3D mockup —
// so a real screenshot can be dropped in later without fighting the chrome.
export default function DeviceFrame({
  kind,
  label,
  className = "",
  src,
  alt,
  priority = false,
}: DeviceFrameProps) {
  if (kind === "mobile") {
    return (
      <div
        // DESKTOP POLISH: a fixed 248px cap never grew past the sm
        // breakpoint, so on a genuinely wide monitor two small phone
        // mockups sat in the middle of a much larger section with no
        // proportional relationship to the viewport. The lg/xl steps are
        // modest — still a phone-sized frame, not "enormous" — and mobile/
        // tablet are untouched below lg.
        className={`w-[220px] rounded-[28px] border border-vv-line bg-vv-bg-2 p-2.5 shadow-vv sm:w-[248px] lg:w-[276px] xl:w-[300px] ${className}`}
      >
        <PlaceholderMedia
          label={label}
          alt={alt}
          src={src}
          fit="contain"
          priority={priority}
          sizes="(min-width: 1280px) 300px, (min-width: 1024px) 276px, (min-width: 640px) 248px, 220px"
          aspect="portrait"
          className="rounded-[20px]"
        />
      </div>
    );
  }

  return (
    <div className={`w-full max-w-2xl rounded-vv border border-vv-line bg-vv-bg-2 p-2.5 shadow-vv ${className}`}>
      <PlaceholderMedia
        label={label}
        alt={alt}
        src={src}
        fit="contain"
        priority={priority}
        aspect="wide"
        className="rounded-vv-sm"
      />
    </div>
  );
}
