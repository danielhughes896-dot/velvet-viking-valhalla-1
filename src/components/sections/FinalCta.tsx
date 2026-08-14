import CtaButton from "@/components/ui/CtaButton";
import { finalCta } from "@/content/site";

// No crest here by design — the full crest appears once, ceremonially, in
// the hero (plus the small wayfinding mark in the header). This closing
// moment is carried by typography and spacing instead, per the brand's
// "treat the crest as a high-value asset, not a repeated stamp" rule.
//
// Deliberately does NOT repeat the hero's fused "Valhalla Awaits. Earn Your
// Place." — this is Valhalla's own closing statement ("Valhalla Awaits"),
// not a hero echo, per the brand/product ownership split.
export default function FinalCta() {
  return (
    <section className="bg-vv-bg">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-28 text-center sm:px-8 sm:py-36">
        <h2 className="font-display text-3xl leading-[1.15] font-semibold uppercase tracking-[0.01em] text-vv-ink sm:text-4xl md:text-5xl">
          {finalCta.heading}
        </h2>
        <p className="mt-5 max-w-md text-base leading-relaxed text-vv-ink-dim">{finalCta.sub}</p>
        <CtaButton href={finalCta.cta.href} className="mt-10">
          {finalCta.cta.label}
        </CtaButton>
      </div>
    </section>
  );
}
