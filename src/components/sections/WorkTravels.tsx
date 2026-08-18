type LocationTile = {
  src: string;
  alt: string;
  location: string;
};

type WorkTravelsProps = {
  desktopSrc: string;
  mobileHeadlineSrc: string;
  heroLocation: string;
  temple: LocationTile;
  map: LocationTile;
  alt: string;
  /** Appended to the outer <section> className. Used exactly once, on this
   * component's own homepage instance, to pull this section up over
   * RaceBreak's pinned sticky media — see RaceBreak.tsx for the transition
   * mechanics. Optional and additive: omitting it changes nothing about
   * this component's own layout, background or composition. */
  className?: string;
};

// A thin, muted gold line — restrained enough to read as a premium
// editorial frame rather than a decorative border. Shared across all
// three tiles so the hero and the two location photographs read as one
// composition rather than three unrelated boxes.
const GOLD_HAIRLINE = "border border-vv-gold/35";

// Small, uppercase, tracked, muted-gold — the same "editorial location
// marker" language for all three captions, deliberately subordinate to
// the photographs themselves.
const LOCATION_LABEL = "font-head text-[11px] font-semibold uppercase tracking-[0.22em] text-vv-gold-text";

// EDITORIAL TRAVEL GRID: the supplied composite is one flat file with the
// headline band, the temple photo and the map photo all baked into a
// single image. This section decomposes it into three independent,
// tightly-fitted tiles rather than showing that one file whole (which
// would otherwise duplicate the temple/map content that's now shown
// separately below).
//
// HERO: same source file as before, but the container is now sized to
// just the top (headline) band's own aspect ratio, with object-top
// anchoring — a pure CSS crop of the existing asset, not a new file.
// Mobile keeps its own dedicated headline crop for legibility (see
// site.ts) rather than sharing the desktop crop at a much narrower width.
//
// TEMPLE / MAP: real, unaltered sub-crops of the same composite, saved as
// their own files — deliberately different proportions (temple compact
// and portrait-ish, map wider and landscape) rather than forced into
// equal halves, with genuine gap between them rather than an oversized
// shared container.
export default function WorkTravels({
  desktopSrc,
  mobileHeadlineSrc,
  heroLocation,
  temple,
  map,
  alt,
  className = "",
}: WorkTravelsProps) {
  return (
    <section className={`theme-dark bg-vv-bg ${className}`}>
      {/* DESKTOP POLISH: widened to match the rest of the page's max-w-6xl
          rhythm — this section's own container was a step narrower than
          its neighbours, which read as an unintended dip in scale between
          sections rather than a deliberate choice. */}
      <div className="mx-auto max-w-5xl px-6 py-20 sm:px-8 sm:py-28 lg:max-w-6xl">
        <div
          className={`relative aspect-[1000/515] w-full overflow-hidden rounded-vv shadow-vv sm:aspect-[1536/513] ${GOLD_HAIRLINE}`}
        >
          <picture>
            <source media="(min-width: 640px)" srcSet={desktopSrc} />
            <img
              src={mobileHeadlineSrc}
              alt={alt}
              className="h-full w-full object-cover object-center sm:object-top"
            />
          </picture>
          <span
            className={`absolute right-3 bottom-3 sm:right-5 sm:bottom-5 ${LOCATION_LABEL}`}
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
          >
            {heroLocation}
          </span>
        </div>

        {/* Two independent location tiles — deliberately different
            proportions (temple compact/portrait, map wider/landscape),
            a shared height so they still read as one balanced row rather
            than a rigid 50/50 grid, and real gap/margin around them
            rather than stretching to fill the section width. */}
        <div className="mt-10 flex flex-wrap items-start justify-center gap-x-8 gap-y-10 sm:mt-14 sm:gap-x-10">
          <figure className="flex flex-col items-center">
            <div
              className={`relative h-56 w-auto overflow-hidden rounded-vv shadow-vv sm:h-64 md:h-72 lg:h-80 xl:h-96 aspect-[284/377] ${GOLD_HAIRLINE}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- real sub-crop of the supplied composite, same rationale as the hero <picture> above */}
              <img src={temple.src} alt={temple.alt} className="h-full w-full object-cover" />
            </div>
            <figcaption className={`mt-3 ${LOCATION_LABEL}`}>{temple.location}</figcaption>
          </figure>

          <figure className="flex flex-col items-center">
            <div
              className={`relative h-56 w-auto overflow-hidden rounded-vv shadow-vv sm:h-64 md:h-72 lg:h-80 xl:h-96 aspect-[504/377] ${GOLD_HAIRLINE}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- real sub-crop of the supplied composite, same rationale as the hero <picture> above */}
              <img src={map.src} alt={map.alt} className="h-full w-full object-cover" />
            </div>
            <figcaption className={`mt-3 ${LOCATION_LABEL}`}>{map.location}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
