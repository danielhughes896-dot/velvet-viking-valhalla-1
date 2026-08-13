import SectionHeading from "@/components/ui/SectionHeading";

type PageIntroProps = {
  eyebrow: string;
  heading: string;
  sub: string;
  body: string;
};

// Minimal structural foundation for a secondary page — enough to establish
// the page's identity and hierarchy now, without inventing content ahead of
// the real product/brand copy it will eventually hold.
export default function PageIntro({ eyebrow, heading, sub, body }: PageIntroProps) {
  return (
    <section className="bg-vv-bg">
      <div className="mx-auto max-w-3xl px-6 py-28 text-center sm:px-8 sm:py-36">
        <SectionHeading eyebrow={eyebrow} heading={heading} align="center" />
        <p className="mx-auto mt-6 max-w-lg text-lg text-vv-ink-dim">{sub}</p>
        <p className="mx-auto mt-8 max-w-lg text-sm leading-relaxed text-vv-ink-faint">{body}</p>
      </div>
    </section>
  );
}
