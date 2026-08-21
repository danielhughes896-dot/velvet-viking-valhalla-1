import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";
import YearRound from "@/components/sections/YearRound";
import SectionHeading from "@/components/ui/SectionHeading";
import DeviceFrame from "@/components/ui/DeviceFrame";
import CtaButton from "@/components/ui/CtaButton";
import { pages, valhallaProduct } from "@/content/site";

export const metadata: Metadata = {
  title: pages.valhalla.heading,
  description: pages.valhalla.sub,
  alternates: { canonical: "/valhalla" },
};

// NARRATIVE ORDER: promise -> the year the product lives in -> how it works.
//
// The page used to go straight from the <h1> into the mechanics, and the
// year-round lifecycle sat on the homepage, where it was the fifth thing a
// visitor met and had nothing to do with the sections either side of it. It
// belongs here, early: it is the shape of the product, and it is the reason
// the mechanics below matter at all. Moved, not copied — the homepage no
// longer mounts it, so the timeline exists in exactly one place on the site.
export default function ValhallaPage() {
  return (
    <>
      <PageIntro {...pages.valhalla} />

      {/* THE PRODUCT IDEA, BEFORE THE PRODUCT DETAIL. Still gates itself on
          PRODUCT_CLAIMS.yearRoundCoaching — mounting it here publishes
          nothing that the app does not already do. */}
      <YearRound />

      <section className="border-t border-vv-line-soft bg-vv-bg">
        <div className="mx-auto max-w-2xl px-6 pt-20 sm:px-8 sm:pt-24">
          <SectionHeading
            eyebrow={pages.valhalla.explanation.eyebrow}
            heading={pages.valhalla.explanation.heading}
            align="center"
          />
          <div className="mt-10 flex flex-col items-center gap-5 text-center sm:mt-12">
            {pages.valhalla.expanded.map((paragraph) => (
              <p key={paragraph} className="max-w-md text-base leading-relaxed text-vv-ink-dim">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* CTA 1 OF 2 — same label, same destination as the closing one
            below. A visitor who is convinced by the explanation should not
            have to scroll past the screenshots to act on it, and a second
            pricing section would turn one decision into two. */}
        <div className="flex justify-center pt-14 sm:pt-16">
          <CtaButton href={pages.valhalla.closingCta.href}>
            {pages.valhalla.closingCta.label}
          </CtaButton>
        </div>

        <div className="theme-dark mx-auto max-w-6xl px-6 py-24 sm:px-8">
          {/* PROTOTYPE: two portrait frames, no desktop mockup — see
              ProductShowcase.tsx for the same primary/secondary rationale.
              theme-dark here too, matching the homepage's ProductShowcase:
              Valhalla's own product surface stays visually distinct from
              the ivory editorial page around it. */}
          <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:items-end">
            <DeviceFrame
              kind="mobile"
              label={valhallaProduct.screenshots.primary.placeholder}
              src={valhallaProduct.screenshots.primary.src}
              alt={valhallaProduct.screenshots.primary.alt}
              className="sm:-mr-10"
            />
            <div className="scale-[0.86]">
              <DeviceFrame
                kind="mobile"
                label={valhallaProduct.screenshots.secondary.placeholder}
                src={valhallaProduct.screenshots.secondary.src}
                alt={valhallaProduct.screenshots.secondary.alt}
              />
            </div>
          </div>
        </div>

        {/* CTA 2 OF 2 — the existing closing position, unchanged. */}
        <div className="flex justify-center pb-24 sm:pb-32">
          <CtaButton href={pages.valhalla.closingCta.href}>
            {pages.valhalla.closingCta.label}
          </CtaButton>
        </div>
      </section>
    </>
  );
}
