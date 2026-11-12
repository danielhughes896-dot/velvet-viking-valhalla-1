"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// THE REEL PLAYS ITSELF, SILENTLY, AND STOPS WHEN NOBODY IS LOOKING.
//
// Founder: "I want the video to be on constant play back but without the
// music."
//
// WHAT IT WAS. A clip with `controls` and nothing else — it sat on its poster
// until somebody pressed play. The reasoning was the soundtrack: the track is
// real, mean -22.3 dB with peaks at -7.7, so it was not ambient B-roll that
// could be muted and looped without losing half of it, and a clip with
// something to say should not say it uninvited. The founder has decided the
// other way: it loops, and it loops silent. The audio is gone from the file
// as well as the element — see the note in DocumentaryReel.
//
// MUTED IS NOT OPTIONAL ANYWAY. No browser will autoplay a clip with sound
// without a user gesture; `muted` is what makes `autoPlay` mean anything at
// all. So the founder's two requirements are the same requirement, and the
// element states it explicitly rather than relying on a stripped audio track
// to be silent by luck.
//
// IT PLAYS ON SCREEN, NOT ON LOAD, and that is this file's main reason to
// exist. The slot it replaced deliberately carried preload="metadata" so the
// poster and the duration arrived "without pulling 1.7MB at every page load".
// Plain `autoPlay` throws that away: the clip sits below the hero, so every
// visitor would fetch and decode a 20-second video they have not scrolled to.
// An IntersectionObserver gets both — it is playing whenever it is in front
// of somebody, which is what "constant playback" means from the only seat
// that matters, and it is not burning a phone's battery decoding frames
// nobody can see.
//
// AND THE SOURCE IS ATTACHED IN VIEW, NOT DECLARED IN THE MARKUP, because
// preload="metadata" turned out not to hold. Measured: with the <source> in
// the markup, Chromium issued `Range: bytes=0-` on page load and had taken
// roughly a megabyte of a 1.4MB file before the clip was anywhere near the
// viewport — the preload attribute is a hint, and for same-origin muted
// media it is one the browser feels free to ignore. Setting `video.src` on
// the first intersection is the version that actually does what the comment
// it inherited always claimed. Re-measured afterwards: nothing at all before
// the scroll.
//
// The element therefore ships without a src, which is why there is a
// <noscript> twin below it: a reader with JavaScript off used to get a
// playable clip from the plain markup, and should not lose it to an
// optimisation.
//
// THERE IS A PAUSE CONTROL BECAUSE THE LAW ASKS FOR ONE. WCAG 2.2.2 is
// explicit: anything that moves automatically for more than five seconds
// needs a mechanism to stop it. This runs for twenty and then starts again.
// `controls` would have satisfied that in one attribute and put a video
// player's chrome across a composition that is meant to read as a phone on a
// table, so the control is one small button instead — always present, never
// hidden behind a hover a touchscreen cannot perform.
//
// AND IT DOES NOT AUTOPLAY FOR SOMEBODY WHO HAS ASKED FOR STILLNESS.
// prefers-reduced-motion is a real request from real people — vestibular
// disorders, migraine — and a looping video is exactly what it is about. They
// get the poster and a play button, which is the page as it was before this
// change.

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

type ReelVideoProps = {
  src: string;
  poster: string;
  /** Describes the footage; used as the element's accessible name. */
  alt: string;
  className?: string;
};

export default function ReelVideo({ src, poster, alt, className = "" }: ReelVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // THE SERVER AND THE FIRST PAINT BOTH READ `false`, so the markup matches
  // and there is no hydration mismatch; a reader who has asked for reduced
  // motion is corrected on the first client render, before the effect below
  // has told the element to play.
  const reduceMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  // MIRRORS THE ELEMENT, IT DOES NOT DRIVE IT. The button's label has to tell
  // the truth about what the video is doing, and the video can stop for
  // reasons this component never hears about — a browser refusing autoplay
  // under a data-saver policy, the tab going to the background. So the state
  // is written only by the element's own play/pause events, and every command
  // goes to the element directly. The project's lint rule forbids setting
  // state inside an effect, which is the same discipline arrived at from the
  // other direction.
  const [playing, setPlaying] = useState(false);

  // The athlete's own choice, remembered across scrolls. Without it, pausing
  // the clip and scrolling away would start it again on the way back, which
  // reads as the page overruling them.
  const pausedByReader = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reduceMotion) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // FIRST SIGHT IS WHERE THE DOWNLOAD STARTS. Assigning src rather
          // than rendering it keeps React out of the way — it never declares
          // the attribute, so there is nothing for it to fight — and means
          // the fetch cannot begin before this line runs.
          if (!video.src) video.src = src;
          if (!pausedByReader.current) {
            // A rejected play() is normal, not an error: autoplay policies
            // and data savers both refuse, and the poster plus the play
            // button are the correct outcome when they do.
            void video.play().catch(() => {});
          }
        } else {
          video.pause();
        }
      },
      // A quarter of the frame is enough to count as on screen — the clip is
      // tall and portrait, so waiting for half of it would leave it still on
      // a phone held in the obvious way.
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [reduceMotion, src]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      pausedByReader.current = false;
      void video.play().catch(() => {});
    } else {
      pausedByReader.current = true;
      video.pause();
    }
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className={className}
        // No `controls`: the button below is the pause mechanism, and a
        // player's chrome would sit across the composition.
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={alt}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* THE NO-JAVASCRIPT TWIN. Everything that makes the player above
          acceptable — the observer, the pause control, the reduced-motion
          check — needs a browser running scripts, and the source is attached
          by one of them. Without this, a reader with scripts off would get a
          poster and nothing else, which is strictly worse than what the page
          offered before. This one is the old element exactly: controls,
          because there is no button to press, and no autoplay, because
          nothing here can offer a way to stop it. */}
      <noscript>
        <video className={className} controls playsInline preload="metadata" poster={poster} aria-label={alt}>
          <source src={src} type="video/mp4" />
        </video>
      </noscript>

      {/* BOTTOM RIGHT, SMALL, AND ALWAYS THERE. Over the darkest corner of a
          dark clip, with its own translucent ground so it survives a bright
          frame. The label changes with the state rather than reading "play/
          pause", so a screen reader announces the action available now. */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause the film" : "Play the film"}
        // 44px, NOT THE 36px THIS FIRST SHIPPED AT. The app enforces a 44px
        // touch floor on every tap target and visualReconciliation holds
        // CtaButton to it; a control that is not a CtaButton does not get to
        // be the exception, least of all one sitting in a corner where a
        // thumb has least room to be accurate.
        //
        // AND NO FOCUS RING OF ITS OWN. globals.css defines exactly one, in
        // gold, and launchReadiness fails any component that redefines it —
        // which it did for this button, correctly. The ring it was given was
        // white, which would have been a second focus style on the site and
        // a different one on this single element.
        className="absolute right-3 bottom-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/65"
      >
        {playing ? (
          <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5 fill-current">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5 fill-current">
            <path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
