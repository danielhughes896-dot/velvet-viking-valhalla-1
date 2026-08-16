import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";
import DeviceFrame from "@/components/ui/DeviceFrame";
import CtaButton from "@/components/ui/CtaButton";
import { pages, valhallaProduct } from "@/content/site";

export const metadata: Metadata = {
  title: pages.valhalla.heading,
  description: pages.valhalla.sub,
};

export default function ValhallaPage() {
  return (
    <>
      <PageIntro {...pages.valhalla} />

      <section className="border-t border-vv-line-soft bg-vv-bg">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-6 pt-20 text-center sm:px-8">
          {pages.valhalla.expanded.map((paragraph) => (
            <p key={paragraph} className="max-w-md text-base leading-relaxed text-vv-ink-dim">
              {paragraph}
            </p>
          ))}
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
              className="sm:-mr-10"
            />
            <div className="scale-[0.86]">
              <DeviceFrame kind="mobile" label={valhallaProduct.screenshots.secondary.placeholder} />
            </div>
          </div>
        </div>

        <div className="flex justify-center pb-24 sm:pb-32">
          <CtaButton href={pages.valhalla.closingCta.href}>
            {pages.valhalla.closingCta.label}
          </CtaButton>
        </div>
      </section>
    </>
  );
}
