import Crest from "@/components/ui/Crest";
import CtaButton from "@/components/ui/CtaButton";
import { hero } from "@/content/site";

// Two-tier composition:
//   1. MASTER-BRAND MOMENT — crest, a thin gold rule, and the category
//      line "Endurance Performance, Built Differently." REFINEMENT ROUND
//      2: the standalone "Velvet Viking" wordmark that previously sat
//      between the crest and the rule was removed — the crest already
//      states the brand name (it's baked into the artwork), and the
//      header wordmark is a click away; repeating it a third time here,
//      right before the H1 restates "Valhalla Awaits. Earn Your Place."
//      again, was the one honest weak point flagged in the prototype
//      report. The rule + descriptor now carry this tier alone.
//   2. PRODUCT MOMENT — hero.eyebrow/heading/sub/cta, unchanged in every
//      character except eyebrow (see site.ts note); this is Valhalla
//      announcing itself, not Velvet Viking repeating itself.
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-vv-bg">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 15%, var(--vv-bg-3) 0%, var(--vv-bg) 60%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto flex min-h-[85vh] max-w-4xl flex-col items-center justify-center px-6 py-14 text-center sm:px-8 sm:py-20 md:py-24">
        <div className="relative">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              transform: "scale(1.7)",
              background: "radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 68%)",
            }}
            aria-hidden
          />
          <Crest size="clamp(200px, 24vw, 300px)" />
        </div>

        <div className="mt-7 flex flex-col items-center sm:mt-8">
          <span
            aria-hidden
            className="h-px w-24 sm:w-28"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--vv-gold), transparent)",
            }}
          />
          <p className="mt-4 font-head text-[11px] font-semibold uppercase tracking-[0.32em] text-vv-ink-faint sm:text-xs">
            Endurance Performance, Built Differently.
          </p>
        </div>

        <div className="mt-11 flex flex-col items-center sm:mt-[52px] md:mt-16">
          <p className="font-head text-xs font-semibold uppercase tracking-[0.32em] text-vv-bronze-text">
            {hero.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.08] font-semibold uppercase tracking-[0.01em] text-vv-ink sm:text-5xl md:text-6xl">
            {hero.heading[0]}
            <br />
            {hero.heading[1]}
          </h1>
          <p className="mt-6 max-w-lg text-balance text-base leading-relaxed text-vv-ink-dim sm:text-lg">
            {hero.sub}
          </p>
          <CtaButton href={hero.cta.href} className="mt-8">
            {hero.cta.label}
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
