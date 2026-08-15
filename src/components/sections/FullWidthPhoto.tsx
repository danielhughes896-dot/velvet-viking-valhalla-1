type FullWidthPhotoProps = {
  mediaLabel: string;
  mediaAlt: string;
  caption?: string;
};

// PROTOTYPE: signature scroll transition, tested once at this exact
// boundary (Campaign -> Earn Your Place). Pure CSS `position: sticky`, no
// scroll-jacking, native scroll fully intact:
//   - This section is a tall (200vh) wrapper; its media layer is
//     `sticky top-0 h-screen`, so it pins full-bleed while the wrapper
//     scrolls underneath it.
//   - The section immediately after this one (Earn Your Place, in
//     page.tsx) is pulled up by `-mt-[100vh]` and given a higher z-index,
//     an opaque background, and a `min-h-screen` floor (so a short amount
//     of body copy can never fall short of fully covering the handoff —
//     verified empirically after an early version of this let a sliver of
//     the old pinned media peek through below a too-short section). Its
//     document position is fixed the whole time, so — with the media
//     genuinely pinned throughout — it rises into view from the bottom
//     edge progressively, more of it exposed with every pixel scrolled,
//     fully covering the media by the exact moment the media's own pin
//     range ends. One continuous wipe across the full scroll distance, not
//     a static pin phase followed by a separate cover phase.
//   - Superseded here: the previous fade-to-bg gradient at the base of the
//     photo. That technique doesn't compose with a pinned/covered layer
//     (there's no "base" to fade from once the next section is doing the
//     covering) — this is a deliberate substitution for evaluation, not a
//     silent removal; see the report for the direct comparison.
//   - `prefers-reduced-motion` isn't relevant here (sticky positioning is
//     driven by scroll offset, not an animation/transition timeline), so
//     this degrades identically either way; the fallback for JS/older
//     browsers without `sticky` support is a plain full-bleed static
//     image, which is the same failure mode the original section had.
export default function FullWidthPhoto({ mediaLabel, caption }: FullWidthPhotoProps) {
  return (
    <section className="theme-dark relative bg-vv-bg" style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundColor: "var(--vv-placeholder-bg)" }}>
          <div
            className="absolute inset-4 border border-dashed sm:inset-8"
            style={{ borderColor: "var(--vv-placeholder-border)" }}
            aria-hidden
          />
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <span className="font-head text-[11px] font-medium uppercase tracking-[0.2em] text-vv-ink-faint">
              {mediaLabel}
            </span>
          </div>
        </div>
        {caption ? (
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-24 sm:pb-28">
            <p className="font-display text-xl font-semibold uppercase tracking-[0.08em] text-vv-ink sm:text-3xl">
              {caption}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
