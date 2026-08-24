import Mark from "@/components/ui/Mark";
import SectionHeading from "@/components/ui/SectionHeading";
import { theMark } from "@/content/site";

// THE MARK, EXPLAINED ONCE, WHERE IT BELONGS.
//
// /philosophy already argues that "Earn Your Place" is a standard rather than
// a slogan. The mark makes the same argument as a shape, so this is the one
// place on the site where saying what it means is an explanation rather than
// brand copy for its own sake — and it is the only place the meaning appears.
//
// theme-dark, and for a reason rather than for variety: the artwork is gold
// with a transparent field, and gold on near-black is where it was drawn to
// live. On the ivory ground above it the same file reads washed out. This is
// also the only dark moment on an otherwise light page, which is what makes
// the section register as a held beat rather than another block of prose.
export default function TheMark() {
  return (
    <section className="theme-dark bg-vv-bg">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center sm:px-8 sm:py-32">
        <Mark size="clamp(96px, 22vw, 148px)" alt="" />

        <SectionHeading
          eyebrow={theMark.eyebrow}
          heading={theMark.heading}
          align="center"
          className="mt-12"
        />

        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-vv-ink-dim">
          {theMark.body}
        </p>

        {/* The three lines are the point of the section. Set on their own,
            larger than body copy and tighter than a paragraph, so they read
            as a statement rather than a list. */}
        <div className="mt-10 flex flex-col gap-2">
          {theMark.lines.map((line, i) => (
            <p
              key={line}
              className={
                i === theMark.lines.length - 1
                  ? "font-head text-base font-medium uppercase tracking-[0.14em] text-vv-bronze-text sm:text-lg"
                  : "font-head text-base font-medium uppercase tracking-[0.14em] text-vv-ink-faint sm:text-lg"
              }
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
