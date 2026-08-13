import SectionHeading from "@/components/ui/SectionHeading";
import { futureWorld } from "@/content/site";

// Deliberately restrained: one editorial statement and an inline list of
// architecture placeholders — not a card grid. Cards here would read as a
// SaaS "coming soon" roadmap; none of these categories are real products yet.
export default function FutureWorld() {
  return (
    <section className="bg-vv-bg">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center sm:px-8 sm:py-32">
        <SectionHeading eyebrow={futureWorld.eyebrow} heading={futureWorld.heading} align="center" />
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-vv-ink-dim">
          {futureWorld.body}
        </p>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
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
