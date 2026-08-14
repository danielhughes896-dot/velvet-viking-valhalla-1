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

// Deliberately unequal (not a 50/50 grid): the image column carries more
// visual weight than the text column, overflows the row's own vertical
// bounds on desktop, and bleeds toward its outer edge — all the way to the
// viewport edge at md+, and past the section's own inset on mobile. The
// bleed is done with `translate`, not margin: this is a grid item, and
// grid items stretch to fill their track by default, which makes the
// browser's box model silently discard a horizontal *margin* that would
// push the item wider than its track (an "over-constrained" box resolves
// by dropping margin-right/left, not width). `translate` is a paint-time
// offset, so it isn't subject to that — and the section's own
// overflow-hidden clips it safely, so it never introduces page-level
// horizontal scroll. `reverse` flips which side carries the image, but
// also swaps the vertical alignment/overflow amount, so Philosophy and
// Earn Your Place read as related compositions rather than a mirrored
// template.
export default function EditorialSplit({
  eyebrow,
  heading,
  body,
  mediaLabel,
  reverse = false,
  theme = "dark",
}: EditorialSplitProps) {
  const mediaClassName = reverse
    ? "-translate-x-6 sm:-translate-x-8 md:-translate-x-[calc((100vw-min(100vw,72rem))/2)] md:-my-20 md:self-end"
    : "translate-x-6 sm:translate-x-8 md:translate-x-[calc((100vw-min(100vw,72rem))/2)] md:-my-14 md:self-start";

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
          <PlaceholderMedia label={mediaLabel} aspect="portrait" className={mediaClassName} />
        </div>
      </div>
    </section>
  );
}
