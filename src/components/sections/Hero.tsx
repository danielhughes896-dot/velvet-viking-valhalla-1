import Link from "next/link";
import Wordmark from "@/components/ui/Wordmark";
import CtaButton from "@/components/ui/CtaButton";
import { hero } from "@/content/site";
import { buildUrl } from "@/content/journey";

// Two-tier composition:
//   1. MASTER-BRAND MOMENT — the mark, a thin gold rule, and the category
//      line below. (copy audit: the earlier "Built Differently" line
//      asserted differentiation without demonstrating it — this version
//      points at the actual differentiator instead of a generic
//      superiority claim.)
//      POSITIONING PASS: that line read "Endurance Performance, Coached
//      With Intent". "Coached" implied a qualified human coach behind the
//      product, which is not what is being sold. Replaced with what the
//      product actually does — decide from training evidence — so the
//      line still names a differentiator rather than a credential. This
//      is the one piece of public copy hard-coded in a component rather
//      than read from content/site.ts, which is why an earlier
//      config-only copy sweep did not catch it.
//      REFINEMENT ROUND 2: the standalone "Velvet Viking" wordmark that
//      previously sat
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
        {/* THE CREST IS RETIRED, AND THIS IS WHAT STOOD IN ITS PLACE.
            A 200–300px disc carrying a wordmark, "Valhalla Awaits" and "Earn
            Your Place" baked into the artwork. Two of those three strings name
            a product that no longer exists, and they were pixels rather than
            text, so they could not be renamed — the artwork had to go, not be
            edited. The app retired it in the same pass.

            THE DROP SHADOW WENT WITH IT. It existed to seat a dark circular
            raster on a dark field. Type needs no seating; it carries the same
            soft white lift the hero headline does, via `lift`. */}
        <Wordmark size="clamp(2.2rem, 8vw, 4rem)" dot="clamp(10px, 1.6vw, 16px)" lift />

        {/* NO BYLINE HERE, AND THE REASON IS WHOSE SITE THIS IS. The app's
            public pages sign the mark "By Velvet Viking" because an athlete is
            inside the product and the company is standing behind it. This is
            the company's own site — signing it would be the host introducing
            himself at his own front door. The company speaks where it has a
            job to do instead: the footer, the statutory disclosure, /about and
            the legal pages, all of which name it.

            The header carries the same mark a few hundred pixels up. That is
            accepted rather than overlooked: it is chrome at a fifth of this
            size, and the alternative — dropping the mark here — would open the
            page on a floating rule with no brand moment at all. */}

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
            Endurance Performance, Built On Evidence
          </p>
        </div>

        <div className="mt-11 flex flex-col items-center sm:mt-[52px] md:mt-16">
          <p className="font-head text-xs font-semibold uppercase tracking-[0.32em] text-vv-bronze-text">
            {hero.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.08] font-semibold uppercase tracking-[0.01em] text-vv-ink sm:text-5xl md:text-6xl">
            {/* MAPPED, NOT INDEXED. This read heading[0] <br/> heading[1],
                which hard-coded the two-line composition into the markup —
                so dropping the dead "Valhalla Awaits" line left the h1 asking
                for an element that is not there. The headline is now whatever
                the content file says it is, one line or several. */}
            {hero.heading.map((line, i) => (
              <span key={line}>
                {i > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-lg text-balance text-base leading-relaxed text-vv-ink-dim sm:text-lg">
            {hero.sub}
          </p>
          {/* BUILD FIRST. The primary action starts a plan; the editorial
              deep dive stays reachable underneath it as a quiet link rather
              than competing for the same visual weight. */}
          <CtaButton href={buildUrl} variant="cherry" className="mt-8">
            {hero.cta.label}
          </CtaButton>
          <p className="mt-4 max-w-xs text-center text-xs leading-relaxed text-vv-ink-faint">
            {hero.ctaNote}
          </p>
          <Link
            href={hero.secondaryCta.href}
            className="mt-5 inline-flex min-h-11 items-center font-head text-xs font-semibold uppercase tracking-[0.2em] text-vv-cherry-text transition-opacity hover:opacity-70"
          >
            {hero.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
