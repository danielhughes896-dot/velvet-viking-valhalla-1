import SectionHeading from "@/components/ui/SectionHeading";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";

type EditorialSplitProps = {
  eyebrow?: string;
  heading: string | readonly string[];
  body: string;
  mediaLabel: string;
  mediaAlt: string;
  reverse?: boolean;
  theme?: "dark" | "light";
};

// Photography breaks out of the content grid; the text column stays put in
// its normal padding. Below md, `reverse` decides how much of the container
// the image escapes:
//   - Philosophy (reverse=false): breaks out on BOTH sides, edge to edge —
//     `margin-left/right: calc(50% - 50vw)` is the standard "full-bleed
//     from a nested, padded container" formula. On a plain block, 50% here
//     resolves against the parent's width; combined with the viewport-
//     relative 50vw, the two cancel out any nesting/padding and the result
//     is flush with the true viewport edges, whatever they are — no image
//     ever has to know how wide its ancestors' padding is.
//   - Earn Your Place (reverse=true): breaks out on ONE side only (right),
//     keeping its left edge aligned with the text above it — a related but
//     visibly different composition, not a mirror of Philosophy.
// At md+ the two columns sit side by side, so a full-bleed-both-sides
// breakout isn't structurally sensible (it would run under the text
// column) — the mobile breakout margins are reset there, and a `translate`
// carries the image to the viewport edge on its one outer side instead.
// `translate` is used (not margin) at md+ because the image is a grid item
// stretched to its own track by default, and a grid item's containing
// block for margin percentages is that (narrower) track, not the padded
// page container — the calc(50%-50vw) formula only reaches the viewport
// edge when "50%" is the full container width, which is only true at the
// single-column mobile layout.
export default function EditorialSplit({
  eyebrow,
  heading,
  body,
  mediaLabel,
  reverse = false,
  theme = "dark",
}: EditorialSplitProps) {
  const mediaClassName = reverse
    ? "mr-[calc(50%-50vw)] md:mr-0 md:-translate-x-[calc((100vw-min(100vw,72rem))/2)] md:self-end md:-my-20"
    : "ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] md:ml-0 md:mr-0 md:translate-x-[calc((100vw-min(100vw,72rem))/2)] md:self-start md:-my-14";

  return (
    <section
      className={`overflow-hidden ${theme === "light" ? "theme-light bg-vv-bg" : "bg-vv-bg"}`}
    >
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32">
        <div
          className={`grid items-center gap-12 md:gap-20 ${
            reverse
              ? "md:grid-cols-[7fr_5fr] md:[&>*:first-child]:order-2"
              : "md:grid-cols-[5fr_7fr]"
          }`}
        >
          <div>
            <SectionHeading eyebrow={eyebrow} heading={heading} />
            <p className="mt-6 max-w-md text-base leading-relaxed text-vv-ink-dim">{body}</p>
          </div>
          <PlaceholderMedia label={mediaLabel} aspect="portrait" bleed className={mediaClassName} />
        </div>
      </div>
    </section>
  );
}
