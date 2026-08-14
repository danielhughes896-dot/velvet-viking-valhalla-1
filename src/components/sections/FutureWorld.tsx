import SectionHeading from "@/components/ui/SectionHeading";
import { futureWorld } from "@/content/site";

// Deliberately restrained: one editorial statement and an inline list of
// architecture placeholders — not a card grid. Cards here would read as a
// SaaS "coming soon" roadmap; none of these categories are real products yet.
// Bottom padding is intentionally lighter than the top: this section and
// FinalCta below share one uninterrupted dark background, and together
// should read as a single closing chapter rather than two stacked centred
// sections — see FinalCta's matching reduced top padding.
export default function FutureWorld() {
  return (
    <section className="bg-vv-bg">
      <div className="mx-auto max-w-3xl px-6 pt-24 pb-10 text-center sm:px-8 sm:pt-32 sm:pb-14">
        <SectionHeading eyebrow={futureWorld.eyebrow} heading={futureWorld.heading} align="center" />
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-vv-ink-dim">
          {futureWorld.body}
        </p>

        <p className="mt-10 font-head text-[11px] font-medium uppercase tracking-[0.2em] text-vv-ink-faint/70">
          {futureWorld.categoriesKicker}
        </p>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {futureWorld.categories.map((category) => (
            <li
              key={category}
              className="font-head text-xs font-semibold uppercase tracking-[0.24em] text-vv-ink-faint"
            >
              {category}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
