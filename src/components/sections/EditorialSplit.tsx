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
// visual weight than the text column, and overflows the row's own vertical
// bounds slightly on desktop — an image "inserted into a box" reads as a
// template; one that outweighs and slightly breaks its row reads as
// composed. `reverse` flips both which side text/image land on AND which
// track is the wide one, so the image stays the heavier element either way.
export default function EditorialSplit({
  eyebrow,
  heading,
  body,
  mediaLabel,
  reverse = false,
  theme = "dark",
}: EditorialSplitProps) {
  return (
    <section className={theme === "light" ? "theme-light bg-vv-bg" : "bg-vv-bg"}>
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
          <PlaceholderMedia label={mediaLabel} aspect="portrait" className="md:-my-10" />
        </div>
      </div>
    </section>
  );
}
