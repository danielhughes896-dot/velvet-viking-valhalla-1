import { documentaryReel } from "@/content/site";

// Prototype-only "opening media" slot, directly under the hero. A neutral
// poster/placeholder at a realistic final aspect for a short documentary
// piece — NOT fabricated footage or a stock clip. The play affordance is
// purely a compositional cue for what this slot is for; it isn't wired to
// anything, and this component takes no autoplay/video dependency.
export default function DocumentaryReel() {
  return (
    <section className="bg-vv-bg">
      <div className="mx-auto max-w-6xl px-6 pb-20 sm:px-8 sm:pb-28">
        <div
          className="relative aspect-video w-full overflow-hidden rounded-vv"
          style={{ backgroundColor: "var(--vv-placeholder-bg)" }}
        >
          <div
            className="absolute inset-4 border border-dashed sm:inset-8"
            style={{ borderColor: "var(--vv-placeholder-border)" }}
            aria-hidden
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center">
            <span
              aria-hidden
              className="flex h-14 w-14 items-center justify-center rounded-full border border-vv-line bg-vv-bg/70 backdrop-blur-sm sm:h-16 sm:w-16"
            >
              <svg viewBox="0 0 24 24" className="ml-1 h-5 w-5 fill-vv-ink sm:h-6 sm:w-6" aria-hidden>
                <path d="M6 4.5v15l14-7.5z" />
              </svg>
            </span>
            <span className="font-head text-[11px] font-medium uppercase tracking-[0.2em] text-vv-ink-faint">
              {documentaryReel.media.placeholder}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
