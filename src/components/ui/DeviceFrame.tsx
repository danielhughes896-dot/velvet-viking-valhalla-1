import PlaceholderMedia from "@/components/ui/PlaceholderMedia";

type DeviceFrameProps = {
  kind: "mobile" | "desktop";
  label: string;
  className?: string;
};

// Bezel is intentionally minimal — a hairline frame, not a glossy 3D mockup —
// so a real screenshot can be dropped in later without fighting the chrome.
export default function DeviceFrame({ kind, label, className = "" }: DeviceFrameProps) {
  if (kind === "mobile") {
    return (
      <div
        className={`w-[220px] rounded-[28px] border border-vv-line bg-vv-bg-2 p-2.5 shadow-vv sm:w-[248px] ${className}`}
      >
        <PlaceholderMedia label={label} aspect="portrait" className="rounded-[20px]" />
      </div>
    );
  }

  return (
    <div className={`w-full max-w-2xl rounded-vv border border-vv-line bg-vv-bg-2 p-2.5 shadow-vv ${className}`}>
      <PlaceholderMedia label={label} aspect="wide" className="rounded-vv-sm" />
    </div>
  );
}
