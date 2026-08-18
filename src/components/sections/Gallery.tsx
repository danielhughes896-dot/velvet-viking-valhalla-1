import GalleryTile from "@/components/ui/GalleryTile";
import {
  raceFinish,
  founderMedal,
  mountainTrail,
  athleteDetail,
  athleteEnvironment,
  workTravelsTemple,
  workTravelsMap,
} from "@/content/gallery";

// A curated editorial sequence, not a rigid catalogue grid: one dominant
// opening portrait, then paired rows either side of a single full-width
// landscape breather — each pairing deliberately asymmetric (the two
// images keep their own real aspect ratios rather than being forced to
// match), so the page reads as a sequence of compositional moments rather
// than a wall of uniform tiles. See content/gallery.ts for why each
// photograph was chosen, how its aspect ratio was decided, and why one
// candidate image (the Work Travels composite) was deliberately left out.
export default function Gallery() {
  return (
    <section className="bg-vv-bg">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
        <div className="flex flex-col gap-16 sm:gap-20">
          {/* Opener: the largest single image on the page. */}
          <GalleryTile
            {...raceFinish}
            className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-xl"
            sizes="(min-width: 1024px) 576px, (min-width: 640px) 512px, 90vw"
          />

          {/* Paired: training and provenance, side by side. */}
          <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-center sm:gap-10">
            <GalleryTile {...mountainTrail} className="w-full max-w-sm sm:w-1/2" sizes="(min-width: 640px) 384px, 90vw" />
            <GalleryTile {...founderMedal} className="w-full max-w-sm sm:w-1/2" sizes="(min-width: 640px) 384px, 90vw" />
          </div>

          {/* Landscape breather: the one wide, full-width moment on the
              page — a genuine GPS running route, not a photograph of a
              person, so it reads differently from the portraits either
              side of it rather than just being a wider version of them. */}
          <GalleryTile {...workTravelsMap} className="w-full" sizes="(min-width: 1024px) 1152px, 90vw" />

          {/* Paired: two road-race moments, deliberately uneven — the
              second keeps far more of its true vertical extent than the
              tight crop the homepage strip uses for the same photograph. */}
          <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-center sm:gap-10">
            <GalleryTile {...athleteDetail} className="w-full max-w-sm sm:w-1/2" sizes="(min-width: 640px) 384px, 90vw" />
            <GalleryTile {...athleteEnvironment} className="w-full max-w-sm sm:w-1/2" sizes="(min-width: 640px) 384px, 90vw" />
          </div>

          {/* Closer: a single centred portrait, mirroring the opener's
              solo treatment rather than ending on another paired row. */}
          <GalleryTile {...workTravelsTemple} className="mx-auto w-full max-w-xs sm:max-w-sm" sizes="(min-width: 640px) 384px, 90vw" />
        </div>
      </div>
    </section>
  );
}
