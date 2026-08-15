import Crest from "@/components/ui/Crest";
import CtaButton from "@/components/ui/CtaButton";
import { hero } from "@/content/site";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-vv-bg">
      {/* Full-bleed hero photography position — sits behind the identity
          composition so the section still works before final photography
          exists (a soft radial wash, not an empty void). */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 15%, var(--vv-bg-3) 0%, var(--vv-bg) 60%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[86vh] max-w-4xl flex-col items-center justify-center px-6 py-16 text-center sm:px-8 sm:py-24 md:py-28">
        <div className="relative">
          {/* The crest's own canvas is pure black, and the radial wash above
              is lightest exactly where the crest sits — so without this, the
              crest reads as a flat rectangle dropped on top of the section.
              This soft, edge-less patch darkens the immediate area back
              toward black first, so the crest settles into the composition
              rather than sitting on it. Not a frame/card — no border, no
              hard edge, invisible at rest. */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              transform: "scale(2.1)",
              background: "radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 68%)",
            }}
            aria-hidden
          />
          <Crest size={136} />
        </div>

        <p className="mt-8 font-head text-xs font-semibold uppercase tracking-[0.32em] text-vv-bronze-text">
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

        <CtaButton href={hero.cta.href} className="mt-10">
          {hero.cta.label}
        </CtaButton>
      </div>
    </section>
  );
}
