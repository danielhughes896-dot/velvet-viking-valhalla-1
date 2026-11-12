import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";
import YearRound from "@/components/sections/YearRound";
import SectionHeading from "@/components/ui/SectionHeading";
import DeviceFrame from "@/components/ui/DeviceFrame";
import Link from "next/link";
import CtaButton from "@/components/ui/CtaButton";
import { pages, sacoroProduct } from "@/content/site";
import { buildUrl } from "@/content/journey";

export const metadata: Metadata = {
  title: pages.sacoro.heading,
  description: pages.sacoro.sub,
  alternates: { canonical: "/sacoro" },
};

// NARRATIVE ORDER: promise -> the year the product lives in -> how it works.
//
// The page used to go straight from the <h1> into the mechanics, and the
// year-round lifecycle sat on the homepage, where it was the fifth thing a
// visitor met and had nothing to do with the sections either side of it. It
// belongs here, early: it is the shape of the product, and it is the reason
// the mechanics below matter at all. Moved, not copied — the homepage no
// longer mounts it, so the timeline exists in exactly one place on the site.
export default function SacoroPage() {
  return (
    <>
      <PageIntro {...pages.sacoro} />

      {/* THE PRODUCT IDEA, BEFORE THE PRODUCT DETAIL. Still gates itself on
          PRODUCT_CLAIMS.yearRoundCoaching — mounting it here publishes
          nothing that the app does not already do. */}
      <YearRound />

      <section className="border-t border-vv-line-soft bg-vv-bg">
        <div className="mx-auto max-w-2xl px-6 pt-20 sm:px-8 sm:pt-24">
          <SectionHeading
            eyebrow={pages.sacoro.explanation.eyebrow}
            heading={pages.sacoro.explanation.heading}
            align="center"
          />
          <div className="mt-10 flex flex-col items-center gap-5 text-center sm:mt-12">
            {pages.sacoro.expanded.map((paragraph) => (
              <p key={paragraph} className="max-w-md text-base leading-relaxed text-vv-ink-dim">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* CTA 1 OF 2 — same label, same destination as the closing one
            below. A visitor who is convinced by the explanation should not
            have to scroll past the screenshots to act on it, and a second
            pricing section would turn one decision into two.

            ENTRY-JOURNEY PASS: both occurrences were "See Standard Pricing".
            This page is the editorial deep dive, so its conversion route is
            now the build; the price stays one quiet link away below the
            closing button rather than being the headline action. */}
        {/* SPACING, ADOPTED FROM THE PARALLEL COMMERCIAL-ENTRY WORK and kept
            because it is right regardless of which label the button carries:
            with pt-14/16 above and the device block's py-24 below, this CTA
            floated in ~150px of nothing and read as belonging to neither the
            explanation it acts on nor the screenshots it precedes. Pulled up
            against the paragraphs, gap beneath halved. */}
        <div className="flex justify-center pt-10 sm:pt-12">
          <CtaButton href={buildUrl} variant="cherry">
            {pages.sacoro.closingCta.label}
          </CtaButton>
        </div>

        <div className="theme-dark mx-auto max-w-6xl px-6 pb-24 pt-12 sm:px-8 sm:pt-14">
          {/* PROTOTYPE: two portrait frames, no desktop mockup — see
              ProductShowcase.tsx for the same primary/secondary rationale.
              The theme note that stood here is gone with the thing it
              described: this section used to be theme-dark so the product
              surface stayed distinct from an ivory page. The page is dark now
              and so is everything around it, so the frames carry their own
              hairline and need no help. */}
          <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:items-end">
            <DeviceFrame
              kind="mobile"
              label={sacoroProduct.screenshots.primary.placeholder}
              src={sacoroProduct.screenshots.primary.src}
              alt={sacoroProduct.screenshots.primary.alt}
              className="sm:-mr-10"
            />
            <div className="scale-[0.86]">
              <DeviceFrame
                kind="mobile"
                label={sacoroProduct.screenshots.secondary.placeholder}
                src={sacoroProduct.screenshots.secondary.src}
                alt={sacoroProduct.screenshots.secondary.alt}
              />
            </div>
            {/* THE THIRD, AND ONLY HERE. The homepage shows two because that
                section is an introduction; this is the page a reader opens to
                understand the product, and the shape of the block — the phases
                ahead of them — is what they came for. Scaled like the second
                and hidden below sm, where a third phone would stack into a
                column rather than read as a set. */}
            <div className="hidden scale-[0.86] sm:block">
              <DeviceFrame
                kind="mobile"
                label={sacoroProduct.screenshots.tertiary.placeholder}
                src={sacoroProduct.screenshots.tertiary.src}
                alt={sacoroProduct.screenshots.tertiary.alt}
              />
            </div>
          </div>
        </div>

        {/* CTA 2 OF 2 — the existing closing position. The pricing link the
            page used to lead with now sits under it, so a visitor who came
            to compare cost still has the route without it being the thing
            the page pushes. */}
        <div className="flex flex-col items-center gap-5 pb-24 sm:pb-32">
          <CtaButton href={buildUrl} variant="cherry">
            {pages.sacoro.closingCta.label}
          </CtaButton>
          <Link
            href={pages.sacoro.secondaryCta.href}
            className="inline-flex min-h-11 items-center font-head text-xs font-semibold uppercase tracking-[0.2em] text-vv-cherry-text transition-opacity hover:opacity-70"
          >
            {pages.sacoro.secondaryCta.label}
          </Link>
        </div>
      </section>
    </>
  );
}
