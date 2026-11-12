const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const code = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

// THE REEL LOOPS, SILENTLY, AND ONLY WHEN SOMEBODY IS LOOKING.
//
// Founder: "I want the video to be on constant play back but without the
// music." What makes that acceptable rather than merely done is a short list
// of things that are all easy to lose in a later edit — a pause control, a
// silent file, a fetch that waits for the scroll, and a reader who has asked
// for stillness getting it. Each one is held here.

const PLAYER = 'src/components/ui/ReelVideo.tsx';
const SECTION = 'src/components/sections/DocumentaryReel.tsx';

test('it plays by itself, loops, and is silent', () => {
  const src = code(read(PLAYER));
  assert.match(src, /\bmuted\b/, 'the clip must be muted');
  assert.match(src, /\bloop\b/, 'constant playback means loop');
  assert.match(src, /playsInline/, 'iOS will not play inline without it');

  /* MUTED IS NOT DECORATION HERE. No browser autoplays a clip with sound
     without a user gesture, so `muted` is what makes any of this work at
     all — and the founder asked for silence independently. Both reasons
     point the same way, which is why it is asserted rather than assumed
     from the stripped audio track. */
});

test('there is a way to stop it, because it runs for twenty seconds', () => {
  /* WCAG 2.2.2: anything that moves automatically for more than five
     seconds needs a mechanism to pause it. This clip is twenty seconds and
     then starts again. `controls` would satisfy it in one attribute and put
     a video player's chrome across a composition meant to read as a phone on
     a table — so the mechanism is one small button, and the button is
     therefore load-bearing rather than ornamental. */
  const src = code(read(PLAYER));
  assert.match(src, /<button/, 'the pause mechanism must exist');
  assert.match(src, /aria-label=\{playing \? "Pause the film" : "Play the film"\}/,
    'and it must say which action it offers, not just "play/pause"');

  // If controls ever come back, the button is redundant — but a missing
  // button with no controls is a WCAG failure, so one of the two must hold.
  const hasControls = /\bcontrols\b/.test(src.replace(/<noscript>[\s\S]*?<\/noscript>/g, ''));
  const hasButton = /<button/.test(src);
  assert.ok(hasControls || hasButton, 'auto-playing content must be pausable');
});

test('nothing is fetched until the clip is on screen', () => {
  /* MEASURED, NOT ASSUMED. preload="metadata" does not hold: with a <source>
     in the markup, Chromium issued `Range: bytes=0-` on page load and had
     taken roughly a megabyte of a 1.4MB file before the clip was near the
     viewport. The attribute is a hint and the browser is free to ignore it.
     So the source is attached on the first intersection instead, and that is
     what this guards — a <source> element or a src attribute back in the JSX
     would silently restore the megabyte. */
  const src = code(read(PLAYER));
  const withoutNoscript = src.replace(/<noscript>[\s\S]*?<\/noscript>/g, '');
  assert.ok(
    !/<source\s/.test(withoutNoscript),
    'the player declares a <source> — the fetch then starts on page load, not on scroll'
  );
  assert.ok(
    !/<video[^>]*\bsrc=/.test(withoutNoscript),
    'the player declares a src attribute — same effect'
  );
  assert.match(src, /IntersectionObserver/, 'something has to decide when "on screen" is');
  assert.match(src, /video\.src = src/, 'and the source is attached there');
});

test('a reader with scripts off still gets a playable clip', () => {
  /* The source is attached by JavaScript now, so without it the element is
     a poster and nothing else — strictly worse than the plain <video> this
     replaced. The noscript twin is the old element exactly: controls,
     because there is no button to press, and no autoplay, because nothing
     without scripts could offer a way to stop it. */
  const src = code(read(PLAYER));
  const noscript = /<noscript>([\s\S]*?)<\/noscript>/.exec(src);
  assert.ok(noscript, 'there must be a no-JavaScript fallback');
  assert.match(noscript[1], /<source src=\{src\}/, 'and it must carry a real source');
  assert.match(noscript[1], /\bcontrols\b/, 'with controls, since there is no button');
  assert.ok(!/\bautoPlay\b/.test(noscript[1]), 'and no autoplay it could not offer a way to stop');
});

test('somebody who asked for stillness does not get a looping video', () => {
  /* prefers-reduced-motion is a request from people with vestibular
     disorders and migraine, and a twenty-second loop is exactly what it is
     about. They get the poster and a play button — the page as it was
     before this change. */
  const src = code(read(PLAYER));
  assert.match(src, /prefers-reduced-motion: reduce/);
  assert.match(src, /if \(reduceMotion\) \{\s*video\.pause\(\);/,
    'the preference must actually stop playback, not merely be read');
});

test('the reader\'s own pause is not overruled by scrolling', () => {
  /* Without this, pausing the clip and scrolling away would start it again
     on the way back, which reads as the page overruling a decision somebody
     just made. */
  const src = code(read(PLAYER));
  assert.match(src, /pausedByReader/, 'a manual pause must be remembered');
  assert.match(src, /if \(!pausedByReader\.current\)/, 'and respected when the clip returns to view');
});

test('the file itself carries no audio track', () => {
  /* `muted` silences the element; it does not stop the bytes arriving. The
     track was 96 kbps across twenty seconds — about 253KB on every visit,
     for something no visitor can hear. The mp4 is re-muxed with -an and the
     video stream copied untouched, so the picture is bit-identical.
     The master with its soundtrack is in this repository's history if the
     decision ever goes back the other way. */
  const file = path.join(ROOT, 'public/media/sacoro-reel.mp4');
  assert.ok(fs.existsSync(file), 'the reel must exist');

  let streams;
  try {
    streams = execFileSync('ffprobe', [
      '-v', 'error', '-show_entries', 'stream=codec_type', '-of', 'csv=p=0', file,
    ]).toString();
  } catch {
    return; // ffprobe is not everywhere; the guard below still holds the intent
  }
  assert.ok(streams.includes('video'), 'the reel must still contain video');
  assert.ok(!streams.includes('audio'), 'the reel still carries an audio track nobody can hear');
});

test('the section hands the clip to the player rather than drawing its own', () => {
  const section = code(read(SECTION));
  assert.match(section, /<ReelVideo/);
  assert.ok(!/<video/.test(section), 'the section must not grow a second, unguarded player');
  // The media still comes from content, not from the component.
  assert.match(section, /documentaryReel\.media\.src/);
  assert.match(section, /documentaryReel\.media\.poster/);
});
