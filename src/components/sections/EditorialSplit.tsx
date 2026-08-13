import SectionHeading from "@/components/ui/SectionHeading";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";

type EditorialSplitProps = {
  eyebrow?: string;
  heading: string;
  body: string;
  mediaLabel: string;
  mediaAlt: string;
  reverse?: boolean;
  theme?: "dark" | "light";
};

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
          className={`grid items-center gap-12 md:grid-cols-2 md:gap-20 ${
            reverse ? "md:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div>
            <SectionHeading eyebrow={eyebrow} heading={heading} />
            <p className="mt-6 max-w-md text-base leading-relaxed text-vv-ink-dim">{body}</p>
          </div>
          <PlaceholderMedia label={mediaLabel} aspect="portrait" />
        </div>
      </div>
    </section>
  );
}
