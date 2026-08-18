type WorkTravelsProps = {
  desktopSrc: string;
  mobileHeadlineSrc: string;
  mobileTempleSrc: string;
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
// text-forward headline crop plus the two supporting photos (temple, map)
// as a smaller row beneath. No pixels invented, no photograph altered —
// three crop windows of one file, chosen per breakpoint.
//
// Plain <picture>/<img> rather than next/image here on purpose: the
// desktop file is the largest asset on the page (~270KB), and a
// display:none swap between two next/image elements would still let the
// browser fetch both. <picture><source media=...> is the one construct
// that guarantees only the matching crop is ever downloaded.
export default function WorkTravels({
  desktopSrc,
  mobileHeadlineSrc,
  mobileTempleSrc,
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

        {/* Mobile-only supporting row — part of the same finished piece,
            shown as a smaller second beat rather than squeezed into one
            illegible wide strip alongside the headline. */}
        <div className="mt-3 grid grid-cols-2 gap-3 sm:hidden">
          <div className="relative aspect-square overflow-hidden rounded-vv shadow-vv">
            {/* eslint-disable-next-line @next/next/no-img-element -- companion crop to the <picture> above, same rationale */}
            <img
              src={mobileTempleSrc}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-vv shadow-vv">
            {/* eslint-disable-next-line @next/next/no-img-element -- companion crop to the <picture> above, same rationale */}
            <img
              src={mobileMapSrc}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
