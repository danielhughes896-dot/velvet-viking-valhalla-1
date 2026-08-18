import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";

type ProvenanceProps = {
  eyebrow: string;
  heading: string | readonly string[];
  body: string;
  src: string;
  alt: string;
};

// REAL-IMAGERY PASS: deliberately smaller and quieter than EditorialSplit's
// full-bleed breakout treatment — that's reserved for the brand's own
// statements (Philosophy, Earn Your Place). This section is evidence in
// support of those statements, not another one competing at the same
// visual weight, so the photo is contained rather than full-bleed and the
// copy is short rather than a biography.
export default function Provenance({ eyebrow, heading, body, src, alt }: ProvenanceProps) {
  return (
    <section className="bg-vv-bg">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 py-24 text-center sm:flex-row sm:items-center sm:gap-14 sm:px-8 sm:py-32 sm:text-left">
        <div className="relative aspect-3/4 w-40 shrink-0 overflow-hidden rounded-vv border border-vv-line shadow-vv sm:w-56">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 640px) 224px, 160px"
            className="object-cover"
          />
        </div>
        <div>
          <SectionHeading eyebrow={eyebrow} heading={heading} />
          <p className="mt-5 max-w-md text-base leading-relaxed text-vv-ink-dim">{body}</p>
        </div>
      </div>
    </section>
  );
}
