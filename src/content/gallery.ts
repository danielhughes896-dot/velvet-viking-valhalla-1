// Central content for /gallery — a curated, editorial sequence of genuine
// Velvet Viking photography, not a generic photo dump. Every image here is
// real and already exists in public/photography; several already appear
// elsewhere on the site (RaceBreak, Provenance, WorkTravels, the Earn Your
// Place strip) but are recomposed here into their own sequence — a
// different pairing, a different aspect ratio, a different (or absent)
// caption — rather than duplicated wholesale. See GalleryTile for how each
// item renders.
//
// Each item carries its OWN aspect ratio, at or very near the source
// photograph's true dimensions, rather than a shared bucket — cropping
// only where a homepage slot already required it, and only as much as that
// slot required. `aspect` is a CSS aspect-ratio value ("W / H"), applied
// via inline style rather than a Tailwind aspect-[] utility: these values
// are data, not literal class names, and Tailwind's build-time class
// scanner can't discover a class name assembled from a runtime string.
//
// A future video entry would carry this same src/alt/aspect/caption shape,
// plus whatever playback field it needs — nothing about this list or the
// components that read it assumes every item is permanently a static
// photograph.
export type GalleryImageItem = {
  src: string;
  alt: string;
  aspect: string;
  caption?: string;
  priority?: boolean;
};

// NOT USED: work-travels-with-you.jpg (the Athens stadium hero on the
// homepage) turns out not to be reusable here at all — it isn't a plain
// photograph. It's a single flat composite with the "The Work Travels
// With You" marketing headline AND the temple/map imagery physically
// baked into the same file (confirmed by opening it directly); WorkTravels
// on the homepage only ever shows a thin top sliver of it for exactly that
// reason. Any taller or differently-positioned crop surfaces that baked
// homepage copy and duplicates content already shown properly via
// workTravelsTemple/workTravelsMap below — wrong for a photography-only
// page either way. A genuine, standalone, text-free Athens/stadium
// photograph would be a real addition to this gallery later; this
// specific file isn't it.
export const raceFinish: GalleryImageItem = {
  src: "/photography/race-finish.jpg",
  alt: "Dan running a marathon, arms out, cheered on by the crowd",
  aspect: "668 / 864",
  caption: "Racing",
  priority: true,
};

export const founderMedal: GalleryImageItem = {
  src: "/photography/founder-medal.jpg",
  alt: "Dan holding his marathon finisher’s medal, smiling",
  aspect: "629 / 864",
  caption: "The Work",
};

export const mountainTrail: GalleryImageItem = {
  src: "/photography/earn-your-place-training-moment.jpg",
  alt: "Dan on a mountain trail, pack on, overlooking a wide valley",
  aspect: "3 / 5",
  caption: "Training",
};

export const athleteDetail: GalleryImageItem = {
  src: "/photography/earn-your-place-athlete-detail.jpg",
  alt: "Dan mid-stride at a road race, bib 2268",
  aspect: "5 / 8",
  caption: "Racing",
};

// The tallest, least-cropped image in the set — its native ratio is
// 660/1643 (~0.4), far taller than the 3:4 box the homepage strip crops
// it into. Showing more of that real vertical extent here (rather than
// repeating the same tight crop) is the point of recomposing it in this
// page rather than duplicating the homepage slot outright.
export const athleteEnvironment: GalleryImageItem = {
  src: "/photography/earn-your-place-environment.jpg",
  alt: "Dan mid-stride finishing a road race, bib 2345",
  aspect: "2 / 5",
};

// Real, unaltered sub-crop of the Work Travels composite — already at its
// own true aspect ratio on the homepage (no further crop possible or
// needed here).
export const workTravelsTemple: GalleryImageItem = {
  src: "/photography/work-travels-temple.jpg",
  alt: "A gilded Buddha shrine at a temple in Koh Samui, Thailand, with Dan smiling in front of it",
  aspect: "284 / 377",
  caption: "Koh Samui, Thailand",
};

export const workTravelsMap: GalleryImageItem = {
  src: "/photography/work-travels-map.jpg",
  alt: "A GPS running route traced along the coastline of Koh Tao, Thailand",
  aspect: "504 / 377",
  caption: "Koh Tao, Thailand",
};
