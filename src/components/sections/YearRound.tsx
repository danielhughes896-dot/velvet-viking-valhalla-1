import SectionHeading from "@/components/ui/SectionHeading";
import { yearRound } from "@/content/site";
import { PRODUCT_CLAIMS } from "@/content/productClaims";

// THE TRAINING YEAR AS A LOOP, NOT A LIST.
//
// The argument this section has to make is that the cycle returns to its own
// beginning, so the stages are laid out along a single connecting rule with the
// last one marked as the return. A grid of five cards would have said "five
// features"; a line says "this continues", which is the actual claim.
//
// RENDERS NOTHING UNTIL THE PRODUCT DOES IT. The gate is checked here, once, at
// the top — not by the caller — so there is no way to mount this section from a
// new page and accidentally publish the claim. The copy, the layout and the
// tests are all finished and waiting behind one boolean; see productClaims.ts
// for what has to be true before it flips.
//
// Existing type scale, existing bronze rule, existing spacing rhythm. This
// introduces no new design language, because the brief for it was a story the
// site was missing rather than a look it was missing.
export default function YearRound() {
  if (!PRODUCT_CLAIMS.yearRoundCoaching) return null;

  return (
    <section className="bg-vv-bg">
      <div className="mx-auto max-w-4xl px-6 py-24 sm:px-8 sm:py-32">
        <SectionHeading
          eyebrow={yearRound.eyebrow}
          heading={yearRound.heading}
          align="center"
        />
        <p className="mx-auto mt-6 max-w-xl text-center text-base leading-relaxed text-vv-ink-dim">
          {yearRound.body}
        </p>

        {/* One vertical rule on mobile, one horizontal on desktop, with a node
            per stage sitting on it. The rule is drawn behind the nodes rather
            than between them so it reads as continuous at any stage count —
            five today, and however many the app ends up with. */}
        <ol className="relative mt-14 flex flex-col gap-8 sm:mt-16 sm:flex-row sm:gap-4">
          <span
            aria-hidden
            className="absolute left-[7px] top-2 bottom-2 w-px bg-vv-line sm:left-0 sm:right-0 sm:top-[7px] sm:bottom-auto sm:h-px sm:w-auto"
          />
          {yearRound.stages.map((stage, i) => (
            <li key={stage.label} className="relative flex gap-4 sm:flex-1 sm:flex-col sm:gap-3">
              <span
                aria-hidden
                className={`mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border bg-vv-bg sm:mt-0 ${
                  i === yearRound.stages.length - 1
                    ? "border-vv-bronze bg-vv-bronze"
                    : "border-vv-line"
                }`}
              />
              <div className="sm:pr-4">
                <h3 className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-vv-bronze-text">
                  {stage.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-vv-ink-dim">{stage.body}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* THE ATHLETE CHOOSES, SAID EXPLICITLY. The stages above could be read
            as an automatic conveyor if nothing contradicted it, and app main is
            clear that they are not: the athlete decides, and choosing nothing
            is a legitimate answer. Stating it once, plainly, under the
            sequence is cheaper than hedging every stage. */}
        <p className="mx-auto mt-12 max-w-xl text-center text-sm leading-relaxed text-vv-ink-faint">
          {yearRound.footnote}
        </p>
      </div>
    </section>
  );
}
