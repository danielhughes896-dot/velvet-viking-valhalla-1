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
// THE ONE WHITE SURFACE ON THE SITE, and it is white for the footage rather
// than for itself. The clip is a dark phone on a dark ground; run against the
// page's own black it loses its edges and becomes a glow in the middle of a
// column. The ivory is a mount, which is why it stops at this section.
//
// AND IT HAS A TOP NOW. The section carried bottom padding only, which was
// invisible while it followed an ivory hero and sat on the same ground. Under
// a dark page with a sticky masthead it meant the clip's first pixels arrived
// directly beneath the bar with nothing between them, and the top of the phone
// read as clipped. scroll-mt keeps the same clearance when the section is
// jumped to rather than scrolled past.
export default function DocumentaryReel() {
  return (
    <section className="theme-light scroll-mt-28 bg-vv-bg">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:px-8 sm:pt-20 sm:pb-28">
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
