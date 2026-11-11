import CtaButton from "@/components/ui/CtaButton";
import { finalCta } from "@/content/site";
import { buildUrl } from "@/content/journey";

// No crest here by design — the full crest appears once, ceremonially, in
// the hero (plus the small wayfinding mark in the header). This closing
// moment is carried by typography and spacing instead, per the brand's
// "treat the crest as a high-value asset, not a repeated stamp" rule.
//
// Deliberately does NOT repeat the hero's fused "Built Around The Climb. Earn Your
// Place." — this is Sacoro's own closing statement ("Built Around The Climb"),
// not a hero echo, per the brand/product ownership split.
//
// Top padding is intentionally lighter than the bottom — see FutureWorld's
// matching note. Together the two sections share one dark background with
// a tight seam and a generous outer edge, so this reads as the conclusion
// of the preceding brand statement rather than a new, separate section.
export default function FinalCta() {
  return (
    <section className="bg-vv-bg">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-10 pb-28 text-center sm:px-8 sm:pt-14 sm:pb-36">
        <h2 className="font-display text-3xl leading-[1.15] font-semibold uppercase tracking-[0.01em] text-vv-ink sm:text-4xl md:text-5xl">
          {finalCta.heading}
        </h2>
        <p className="mt-5 max-w-md text-base leading-relaxed text-vv-ink-dim">{finalCta.sub}</p>
        {/* The page's closing action is the plan, not the price. */}
        <CtaButton href={buildUrl} variant="cherry" className="mt-10">
          {finalCta.cta.label}
        </CtaButton>
      </div>
    </section>
  );
}
