import CtaButton from "@/components/ui/CtaButton";
import { hero } from "@/content/site";
import { buildUrl } from "@/content/journey";

// THE HERO IS DARK, AND IT IS ONE TIER NOW.
//
// It used to be two: a master-brand moment (the crest, a gold rule, a category
// line) stacked on top of a product moment (an eyebrow, the headline, the sub,
// the CTA). That worked when the crest was the brand's only full statement and
// the two tiers were different objects. The crest is retired, the mark is the
// name, and the header already carries it — so the upper tier had nothing left
// to say that the lower tier was not about to say better.
//
// WHAT THE MOCK CHANGED, and why each one earns its place:
//
//   DARK. The product is dark. An athlete meets a near-black screen in the app
//   every morning, and opening the site on cream made the first impression and
//   the product two different things. It also gives the one bright object on
//   the page — the primary action — somewhere to glow.
//
//   NO MARK HERE. The header is forty pixels above and says the same six
//   letters. Two identical lockups in one viewport is the name said twice; the
//   previous pass papered over it with a "By Velvet Viking" byline to make them
//   different objects, which solved the symptom. Removing one solves it.
//
//   ONE EYEBROW, NOT TWO. "The Flagship" and the category line both sat here,
//   the first naming the product's rank and the second its argument. The
//   argument wins: it is the only line above the fold that says what Sacoro is
//   FOR. The category line also moved into content/site.ts on the way — it was
//   the one piece of public copy hard-coded in this component, which is why an
//   earlier copy sweep missed it entirely.
//
//   THE RULE IS CHERRY AND IT GLOWS. It was a flat gold hairline. Gold is
//   brand, destination and milestone; this rule sits directly above the thing
//   being asked of the reader, and it is the page's first sign of the colour
//   every action on the site is about to be painted in.
//
//   TWO BUTTONS, BOTH REAL. The secondary was a bare text link, which made
//   "read more about it before you commit" look like a footnote rather than
//   the reasonable second option it is. Full-width pills, stacked, with the
//   weight difference carrying the order instead of one of them being small.
export default function Hero() {
  return (
    <section
      className="theme-dark relative overflow-hidden bg-vv-bg"
      // RUNS BEHIND THE MASTHEAD. The header is sticky and therefore in the
      // flow, so without this the hero starts below it and the transparent bar
      // shows the ivory page behind it instead of this section's dark. Pulled
      // up by the header's height and padded back down by the same, so nothing
      // moves except what is behind the bar.
      style={{ marginTop: "calc(-1 * var(--vv-header-h))", paddingTop: "var(--vv-header-h)" }}
    >
      {/* TWO GRADIENTS, NOT ONE. The first lifts the ground away from flat
          black so the section has depth; the second is a wide, very low-opacity
          cherry wash behind the headline and button, which is what stops the
          primary action reading as a bright object dropped onto a dark
          rectangle. Both are aria-hidden decoration. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 12%, var(--vv-bg-3) 0%, var(--vv-bg) 62%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 45% at 50% 62%, color-mix(in srgb, var(--vv-cherry) 14%, transparent) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[88vh] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center sm:px-8 sm:py-24">
        <p className="font-head text-[10px] font-semibold tracking-[0.3em] text-vv-gold uppercase sm:text-xs sm:tracking-[0.34em]">
          {hero.eyebrow}
        </p>

        {/* The glow is on a second, blurred copy of the same rule rather than a
            box-shadow, so the light spreads along the line instead of ringing
            a 1px box. */}
        <span className="relative mt-5 block h-px w-40 sm:w-52" aria-hidden>
          <span
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--vv-cherry-soft), transparent)",
            }}
          />
          <span
            className="absolute inset-x-0 -top-1 h-[3px] blur-[3px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--vv-cherry), transparent)",
            }}
          />
        </span>

        <h1 className="mt-8 font-display text-[2.75rem] leading-[1.02] font-semibold tracking-[0.005em] text-vv-ink uppercase sm:mt-10 sm:text-6xl md:text-7xl">
          {hero.heading.map((line, i) => (
            <span key={line}>
              {i > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-balance text-vv-ink-dim sm:mt-7 sm:text-lg">
          {hero.sub}
        </p>

        {/* STACKED AND FULL WIDTH, capped so they do not stretch into a banner
            on a laptop. The primary carries a glow that only exists on dark —
            see the .cta-glow rule in globals.css, which is a no-op on ivory. */}
        <div className="mt-10 flex w-full max-w-sm flex-col gap-3 sm:mt-12">
          <CtaButton href={buildUrl} variant="cherry" className="cta-glow w-full">
            {hero.cta.label}
          </CtaButton>
          <CtaButton href={hero.secondaryCta.href} variant="ghost" className="w-full">
            {hero.secondaryCta.label}
          </CtaButton>
        </div>

        <p className="mt-5 max-w-xs text-xs leading-relaxed text-vv-ink-faint">
          {hero.ctaNote}
        </p>
      </div>
    </section>
  );
}
