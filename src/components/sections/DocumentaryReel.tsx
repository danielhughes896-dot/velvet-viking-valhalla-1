import { documentaryReel } from "@/content/site";

// THE OPENING MEDIA SLOT, NOW CARRYING REAL FOOTAGE.
//
// This was a placeholder: a 16:9 tinted rectangle with a dashed inner marker
// and a play glyph wired to nothing, holding the composition until there was
// something to put in it. The seam it was holding open — `documentaryReel` in
// content/site.ts, deliberately left exported while nothing read it — is now
// read again.
//
// PORTRAIT, BECAUSE THE FOOTAGE IS. The clip is 1080x1890 — exactly 4:7 — and
// the frame it replaced was aspect-video. A portrait clip in a 16:9 box either
// crops the phone's top and bottom off or sits in two black pillars, so the
// frame takes the footage's own ratio instead of the footage taking the
// frame's. Capped at a phone-ish width and centred: at max-w-6xl a 4:7 box
// would stand over 2000px tall on a laptop, which is not a section, it is a
// wall.
//
// CONTROLS RATHER THAN AUTOPLAY, and the audio is why. The track is real —
// mean -22.3 dB, peaks at -7.7 — so this is not ambient B-roll that can be
// muted and looped without losing half of it. A clip with something to say
// should not say it uninvited, and a visitor who wants it presses the control
// the slot has always shown. preload="metadata" so the poster and duration
// arrive without pulling 1.7MB at every page load.
export default function DocumentaryReel() {
  return (
    <section className="bg-vv-bg">
      <div className="mx-auto max-w-6xl px-6 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto w-full max-w-[340px] sm:max-w-[400px]">
          <video
            className="aspect-4/7 w-full rounded-vv bg-vv-bg-3 object-cover shadow-vv"
            controls
            playsInline
            preload="metadata"
            poster={documentaryReel.media.poster}
            aria-label={documentaryReel.media.alt}
          >
            <source src={documentaryReel.media.src} type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
