import ReelVideo from "@/components/ui/ReelVideo";
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
// IT PLAYS ITSELF NOW, AND IT PLAYS SILENT.
//
// Founder: "I want the video to be on constant play back but without the
// music."
//
// WHAT THIS REPLACES, and the reasoning is worth keeping rather than
// deleting. The slot carried `controls` and no autoplay, because the audio
// was real — mean -22.3 dB, peaks at -7.7 — so it was not ambient B-roll that
// could be muted and looped without losing half of it, and a clip with
// something to say should not say it uninvited. That argument was sound and
// the founder has decided the other way: it loops, and it loops silent.
//
// SO THE AUDIO LEFT THE FILE, NOT JUST THE ELEMENT. `muted` would have
// silenced it, but the track would still have been fetched — 96 kbps across
// twenty seconds, about 253KB, on every visit, for something no visitor can
// ever hear. The mp4 is re-muxed with -an and the video stream copied
// untouched, so the picture is bit-identical and the file is 14% smaller.
// The master with its soundtrack is in this repository's history, one
// `git show` away, if the decision ever goes back the other way.
//
// THE PLAYER MOVED TO ReelVideo, which is a client component because
// everything that makes this acceptable needs the browser: an
// IntersectionObserver so a clip below the fold is not fetched and decoded
// before anybody scrolls to it, a pause control because WCAG 2.2.2 requires
// one for anything moving longer than five seconds, and prefers-reduced-
// motion so a reader who has asked for stillness still gets the poster.
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
          <ReelVideo
            src={documentaryReel.media.src}
            poster={documentaryReel.media.poster}
            alt={documentaryReel.media.alt}
            className="aspect-4/7 w-full rounded-vv bg-vv-bg-3 object-cover shadow-vv"
          />
        </div>
      </div>
    </section>
  );
}
