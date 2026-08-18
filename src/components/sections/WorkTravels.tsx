type WorkTravelsProps = {
  desktopSrc: string;
  mobileHeadlineSrc: string;
  mobileMapSrc: string;
  alt: string;
};

// REAL-IMAGERY PASS: a finished creative, not raw photography — it already
// carries its own headline and copy, so nothing here restates that message
// in HTML.
//
// Desktop shows the composite whole, exactly as supplied. At a phone width
// the same wide (1536x896) composite would shrink its headline text to
// roughly a dozen pixels tall — illegible, not just "smaller" — so mobile
// gets a genuinely different crop of the SAME source image: a taller,
// text-forward headline crop plus one supporting photo (the running route
// map) beneath. No pixels invented, no photograph altered — crop windows
// of one file, chosen per breakpoint.
//
// FINAL POLISH: the temple selfie crop that originally sat alongside the
// map was dropped — it read as personal-holiday content next to the map's
// clean "a real route, somewhere else" message. The map now carries the
// supporting role alone, as a single wide card rather than a two-up grid.
//
// Plain <picture>/<img> rather than next/image here on purpose: the
// desktop file is the largest asset on the page (~270KB), and a
// display:none swap between two next/image elements would still let the
// browser fetch both. <picture><source media=...> is the one construct
// that guarantees only the matching crop is ever downloaded.
export default function WorkTravels({
  desktopSrc,
  mobileHeadlineSrc,
  mobileMapSrc,
  alt,
}: WorkTravelsProps) {
  return (
    <section className="theme-dark bg-vv-bg">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:px-8 sm:py-28">
        <div className="relative aspect-[1000/515] w-full overflow-hidden rounded-vv shadow-vv sm:aspect-[1536/896]">
          <picture>
            <source media="(min-width: 640px)" srcSet={desktopSrc} />
            <img src={mobileHeadlineSrc} alt={alt} className="h-full w-full object-cover" />
          </picture>
        </div>

        {/* Mobile-only supporting beat — part of the same finished piece,
            a smaller second card rather than squeezed into one illegible
            wide strip alongside the headline. Single card, not a grid:
            the map crop carries the "different place" idea alone. */}
        <div className="relative mt-3 aspect-[508/379] w-full overflow-hidden rounded-vv shadow-vv sm:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element -- companion crop to the <picture> above, same rationale */}
          <img
            src={mobileMapSrc}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
