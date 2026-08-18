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
      {/* DESKTOP POLISH: xl:max-w-5xl gives "Built by a runner" enough
          room alongside the now-larger photo — at the previous lg:max-w-4xl
          cap, the wider photo left too little width for the heading and it
          wrapped mid-line ("Built by a" / "runner" instead of one line),
          which breaks the two-line structure the copy is authored for. */}
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 py-24 text-center sm:flex-row sm:items-center sm:gap-14 sm:px-8 sm:py-32 sm:text-left lg:max-w-4xl lg:gap-16 xl:max-w-5xl">
        {/* DESKTOP POLISH: the photo capped at 224px from sm all the way
            to any viewport width — on a wide monitor this whole section
            (already deliberately quieter than the full-bleed sections)
            read as a small island. lg/xl grow it further; below lg,
            nothing changes. */}
        <div className="relative aspect-3/4 w-40 shrink-0 overflow-hidden rounded-vv border border-vv-line shadow-vv sm:w-56 lg:w-64 xl:w-72">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1280px) 288px, (min-width: 1024px) 256px, (min-width: 640px) 224px, 160px"
            className="object-cover"
          />
        </div>
        <div>
          <SectionHeading eyebrow={eyebrow} heading={heading} />
          <p className="mt-5 max-w-md text-base leading-relaxed text-vv-ink-dim lg:max-w-lg">{body}</p>
        </div>
      </div>
    </section>
  );
}
