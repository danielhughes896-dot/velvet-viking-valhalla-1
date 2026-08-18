import Image from "next/image";

type GalleryTileProps = {
  src: string;
  alt: string;
  /** CSS aspect-ratio value, e.g. "668 / 864" — see gallery.ts for why this
   * is per-image data rather than a shared Tailwind aspect-* utility. */
  aspect: string;
  caption?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

// One photograph, its own real shape preserved. Reuses the same frame
// (rounded-vv, shadow-vv, border-vv-line) and caption typography already
// established elsewhere on the site (EditorialSplit's gallery strip,
// WorkTravels' location labels) rather than inventing a new treatment — a
// plain border-vv-line rather than WorkTravels' gold hairline, so the page
// reads as its own destination without a literal reuse of that section's
// signature frame.
//
// A future video tile would take the same src/alt/aspect/caption/className
// contract and swap the <Image> below for its own player — nothing here
// assumes every gallery item is permanently a static photograph.
export default function GalleryTile({
  src,
  alt,
  aspect,
  caption,
  priority = false,
  sizes = "(min-width: 1024px) 45vw, 90vw",
  className = "",
}: GalleryTileProps) {
  return (
    <figure className={className}>
      <div
        className="relative w-full overflow-hidden rounded-vv border border-vv-line shadow-vv"
        style={{ aspectRatio: aspect }}
      >
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-center font-head text-[11px] font-semibold uppercase tracking-[0.22em] text-vv-bronze-text">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
