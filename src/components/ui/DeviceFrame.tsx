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
        className={`w-[220px] rounded-[28px] border border-vv-line bg-vv-bg-2 p-2.5 shadow-vv sm:w-[248px] ${className}`}
      >
        <PlaceholderMedia
          label={label}
          alt={alt}
          src={src}
          fit="contain"
          priority={priority}
          sizes="(min-width: 640px) 248px, 220px"
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
