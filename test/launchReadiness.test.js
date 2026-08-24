'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const code = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

const srcFiles = () => {
  const out = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = path.join(dir, e.name);
      if (e.isDirectory()) walk(rel);
      else if (/\.(ts|tsx)$/.test(e.name)) out.push(rel);
    }
  })('src');
  return out;
};

// COMMERCIAL LAUNCH READINESS.
//
// What this suite protects is the difference between a site that looks ready
// and a site somebody can hand a card to: the mark is the supplied artwork
// rather than an approximation, the prices agree with the app's own catalogue,
// the one piece of the Stripe journey this site owns is handled, and the
// defects the launch audit found at real phone widths do not come back.

// ---------------------------------------------------------------------------
// 1. THE MARK
// ---------------------------------------------------------------------------
test('the supplied mark is installed as a real asset, at its own proportions', () => {
  const file = path.join(ROOT, 'public/brand/velvet-viking-mark.png');
  assert.ok(fs.existsSync(file), 'the mark artwork must exist in the repo');
  const buf = fs.readFileSync(file);
  // PNG header: width/height at bytes 16-24, colour type at 25.
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const colourType = buf[25];
  assert.equal(width, 1295, 'the artwork must be the supplied file, unresized');
  assert.equal(height, 1214);
  assert.equal(colourType, 6, 'RGBA — the mark needs its transparent field');
  assert.ok(buf.length > 900000, 'sanity: the full-resolution artwork, not a thumbnail');
});

test('one component owns the mark, and it never forces a square or a height', () => {
  const users = srcFiles().filter((f) => /velvet-viking-mark\.png/.test(read(f)));
  assert.deepEqual(users, ['src/components/ui/Mark.tsx'],
    'the artwork must be referenced through Mark, so a future SVG master is a one-line swap');
  const m = code(read('src/components/ui/Mark.tsx'));
  // Width is set; height comes from the file. A height/aspect declaration here
  // would be the thing that quietly re-proportions the supplied artwork.
  assert.match(m, /style=\{\{ width \}\}/);
  assert.match(m, /className="h-auto w-full"/);
  assert.ok(!/aspect-|height:/.test(m), 'nothing may impose a height on the mark');
});

test('the mark is not a recreation: no hand-drawn chevron shipped alongside it', () => {
  for (const f of srcFiles()) {
    const src = read(f);
    if (!/<svg/i.test(src)) continue;
    assert.ok(
      !/velvet.?viking.?mark|\bVV\b.*polygon|chevron/i.test(src),
      `${f} appears to redraw the mark — the supplied artwork is the authority`
    );
  }
});

test('the crest still exists and still owns the ceremonial slot', () => {
  // The mark did not replace the crest; they are different objects. The crest
  // is the full emblem (wordmark, "Valhalla Awaits", "Earn Your Place" baked
  // into the artwork) and keeps the hero, which is the size it was drawn for.
  assert.ok(fs.existsSync(path.join(ROOT, 'public/brand/velvet-viking-crest.png')));
  assert.match(code(read('src/components/sections/Hero.tsx')), /<Crest /);
});

// ---------------------------------------------------------------------------
// 2. THE MARK'S MEANING — SAID ONCE
// ---------------------------------------------------------------------------
test('the meaning is stated on /philosophy, and only there', () => {
  const pages = srcFiles().filter((f) => /src\/app\/.*page\.tsx$/.test(f));
  const mounts = pages.filter((f) => /<TheMark \/>/.test(code(read(f))));
  assert.deepEqual(mounts, ['src/app/philosophy/page.tsx'],
    'one brand moment, not a guidelines page bolted onto every route');
});

test('the meaning HQ supplied survives: triangle, ascent, progress, earning it', () => {
  const site = code(read('src/content/site.ts'));
  const block = site.slice(site.indexOf('export const theMark'), site.indexOf('export const brandStory'));
  assert.match(block, /built around ascent/i);
  assert.match(block, /triangle is progress/i);
  assert.match(block, /climb toward something stronger/i);
  for (const line of [
    'Not where you started.',
    'Not where you think you belong.',
    'Where you earn your place.',
  ]) {
    assert.ok(block.includes(line), `the mark's closing lines lost: "${line}"`);
  }
});

test('"Earn Your Place" stays a standard, not a slogan on every surface', () => {
  // WHERE IT LEGITIMATELY LIVES, and why this is a ceiling rather than a cut:
  // the brand motto, the hero headline, the homepage section that argues it,
  // the footer, and /philosophy — which is the page about it, and where the
  // mark's meaning now lands too. Every one of those was approved copy before
  // this pass and none of it is being rewritten to shrink a number.
  //
  // What this guards is GROWTH. Comments are stripped first: several notes in
  // site.ts quote the phrase while explaining an earlier edit, and prose about
  // the copy is not the copy.
  const site = code(read('src/content/site.ts'));
  const occurrences = (site.match(/Earn Your Place/g) || []).length;
  assert.ok(
    occurrences <= 9,
    `"Earn Your Place" appears ${occurrences} times in shipped copy — it is spreading into surfaces that should carry their own words`
  );
  // And it must not leak into the things a visitor is asked to press. A belief
  // on a button is an advertising slogan.
  const site2 = code(read('src/content/site.ts'));
  const ctas = site2.slice(site2.indexOf('export const buildCta'), site2.indexOf('export const brand'));
  assert.ok(!/Earn Your Place/.test(ctas), 'the standard must never become a call to action');
});

// ---------------------------------------------------------------------------
// 3. THE COMMERCIAL JOURNEY
// ---------------------------------------------------------------------------
test('the prices match the app’s canonical catalogue exactly', () => {
  // The app is the billing authority: api/_products.js carries priceMinor 1199
  // and 8999 in GBP. These are the same numbers, written for humans.
  const commerce = code(read('src/content/commerce.ts'));
  assert.match(commerce, /amount:\s*11\.99,\s*currency:\s*"GBP",\s*period:\s*"month"/);
  assert.match(commerce, /amount:\s*89\.99,\s*currency:\s*"GBP",\s*period:\s*"year"/);
  assert.match(commerce, /days:\s*14/, 'the trial length must match the app’s TRIAL_DAYS');
});

test('the website still implements no billing of its own', () => {
  // The app owns POST /api/checkout, and it requires a bearer token this site
  // does not have and must never hold. Handing off is the whole architecture.
  for (const f of srcFiles()) {
    const src = code(read(f));
    assert.ok(!/api\/checkout|Bearer |price_[A-Za-z0-9]/.test(src),
      `${f} reaches for the billing authority — that lives in the app`);
  }
});

test('the cancelled-checkout return is handled, because that address is ours', () => {
  // api/_stripe.js sets cancel_url to <marketing origin>/pricing?checkout=cancelled.
  const notice = code(read('src/components/sections/CheckoutNotice.tsx'));
  assert.match(notice, /get\("checkout"\) === "cancelled"/);
  assert.match(notice, /You haven’t been charged/, 'the one fact a cancelling customer needs');
  assert.match(code(read('src/app/pricing/page.tsx')), /<CheckoutNotice \/>/);
  // It must stay a read: no grant, no call, no record.
  assert.ok(!/fetch\(|localStorage|entitle/i.test(notice));
});

test('the success return is left to the app, which owns the account', () => {
  for (const f of srcFiles()) {
    assert.ok(!/checkout=complete|session_id/.test(code(read(f))),
      `${f} tries to interpret a completed checkout — that return goes to the app`);
  }
});

// ---------------------------------------------------------------------------
// 4. DEFECTS THE LAUNCH AUDIT FOUND — THEY DO NOT COME BACK
// ---------------------------------------------------------------------------
test('the wordmark fits a 360px phone', () => {
  // At 30px the wordmark measured 274px; a 360px screen leaves 312px between
  // the header gutters and the menu control needs 40 of them.
  const brandMark = code(read('src/components/layout/HeaderBrand.tsx'));
  assert.match(brandMark, /text-\[26px\]/, 'the smallest step must be smaller than 30px');
  assert.match(brandMark, /min-\[380px\]:text-\[30px\]/, 'and must return to 30px on ordinary phones');
  assert.match(brandMark, /whitespace-nowrap/, 'the wordmark must still never wrap');
});

test('the support address cannot push the page sideways', () => {
  const support = code(read('src/app/support/page.tsx'));
  assert.match(support, /break-all/, 'the address needs a wrap of last resort');
  assert.match(support, /text-base[^"]*min-\[380px\]:text-xl/, 'and a smaller first step at 360px');
});

test('there is exactly one focus ring on the site, defined once', () => {
  // WAS an assertion that this button carried its own outline-colour utility,
  // added to fix a "white focus ring" that a screenshot later proved never
  // existed — getComputedStyle reports outline-color's initial currentColor,
  // not what :focus-visible paints. What is worth holding is the invariant the
  // false fix accidentally arrived at: the ring lives in globals.css and no
  // component redefines it.
  const css = code(read('src/app/globals.css'));
  assert.match(css, /:focus-visible \{\s*outline: 2px solid var\(--vv-gold\);/);
  for (const f of srcFiles()) {
    assert.ok(!/focus-visible:outline-/.test(code(read(f))),
      `${f} defines its own focus ring — there should be one, in globals.css`);
  }
});

test('every secondary text CTA clears a 44px hit area', () => {
  for (const f of [
    'src/components/sections/Hero.tsx',
    'src/components/sections/ProductShowcase.tsx',
    'src/app/valhalla/page.tsx',
  ]) {
    const src = code(read(f));
    const links = [...src.matchAll(/text-vv-bronze-text transition-opacity/g)];
    assert.ok(links.length > 0, `${f} lost its secondary link`);
    assert.match(src, /inline-flex min-h-11 items-center font-head/,
      `${f} has a secondary CTA smaller than a thumb`);
  }
});

// ---------------------------------------------------------------------------
// 5. NOTHING COMMERCIAL SWITCHED ON BY THIS PASS
// ---------------------------------------------------------------------------
test('the launch flags are exactly the two HQ approved, and no others moved', () => {
  // OPENED, with its prerequisite verified rather than assumed:
  //   valueFirstLive    app main 58b5fb0 runs builder -> preview -> Save My
  //                     Plan -> auth, and pane-build mounts the nine-stage
  //                     BLD_STAGES builder, not a second questionnaire.
  assert.match(code(read('src/content/journey.ts')), /valueFirstLive:\s*true/);

  // CLOSED AGAIN, and this one was opened for the wrong reason rather than in
  // error. The backend prerequisite it named is real and still true —
  // TRIAL_DAYS = 14 in api/_products.js, applied by api/_stripe.js with
  // payment_method_collection 'always'. What it did not check is whether a
  // visitor can reach any of it, and they cannot: public signup is closed by a
  // trigger on auth.users. A trial the site offers and the product refuses is
  // the one launch flag that costs trust rather than time.
  assert.match(code(read('src/content/commerce.ts')), /live:\s*false/);

  // STILL CLOSED. Legal publication is not this repository's to grant, and
  // each of these three still carries an unresolved decision inside its own
  // draft — the effective dates, the liability-cap question and, for the
  // commercial privacy policy, the Article 9 condition. A flag flipped here
  // would assert an approval nobody has given.
  const legal = code(read('src/content/legal.ts'));
  assert.match(legal, /terms:\s*false/);
  assert.match(legal, /cookies:\s*false/);
  assert.match(legal, /privacyCommercial:\s*false/);
  // Public commercial claims nobody has approved.
  assert.match(legal, /foundingPriceLock:\s*false/);
  assert.match(legal, /subscriptionPause:\s*false/);
  // Still gated in the app itself.
  assert.match(code(read('src/content/productClaims.ts')), /garminIntegration:\s*false/);
  // And the seams the app owns stay null on this side.
  const commerce = code(read('src/content/commerce.ts'));
  assert.match(commerce, /createAccount:\s*null/);
  assert.match(commerce, /signIn:\s*null/);
});

test('the legal drafts that stay unpublished still carry their open decisions', () => {
  // The reason terms/cookies/privacyCommercial are false is not that the
  // documents are missing — they are written. It is that each still contains
  // an unresolved [TO BE CONFIRMED] that a person, not this repository, must
  // settle. If those disappear, the flags become a real decision to make.
  const legal = read('src/content/legal.ts');
  const between = (a, b) => legal.slice(legal.indexOf(a), legal.indexOf(b));
  assert.match(between('const termsDraft', 'const cookiesDraft'), /TBC\(/,
    'Terms still has an open item; publishing it would assert an approval nobody gave');
  assert.match(between('const cookiesDraft', 'const privacyCommercialDraft'), /TBC\(/);
  assert.match(between('const privacyCommercialDraft', 'const betaTermsDraft'), /Article 9/,
    'the Article 9 condition is the one substantive legal decision left');
  // The two that ARE published contain none.
  assert.ok(!/TBC\(/.test(between('const privacyDraft', 'const termsDraft')),
    'the published privacy policy must contain no placeholders');
});

// ---------------------------------------------------------------------------
// 6. LAUNCH POLISH
// ---------------------------------------------------------------------------
test('no dead social control ships: only platforms with a real URL render', () => {
  const social = code(read('src/components/layout/SocialLinks.tsx'));
  assert.match(social, /PLATFORMS\.filter\(\(p\) => footer\.social\[p\.key\]\)/);
  assert.match(social, /if \(live\.length === 0\) return null;/);
  assert.ok(!/coming soon/i.test(social), 'a greyed-out placeholder is still a dead control');
  assert.ok(!/href="#"/.test(social), 'and a "#" href is worse');
  // No URL may be invented: every destination comes from content.
  assert.ok(!/https?:\/\//.test(social), 'SocialLinks must hard-code no destination');
});

test('the favicon is served by the App Router convention, from the VV mark', () => {
  for (const f of ['src/app/favicon.ico', 'src/app/icon.png', 'src/app/apple-icon.png']) {
    assert.ok(fs.existsSync(path.join(ROOT, f)), `${f} must exist for /favicon.ico to resolve`);
  }
  // A metadata `icons` block would override the convention and reopen the 404.
  const layout = code(read('src/app/layout.tsx'));
  assert.ok(!/icons:\s*\{/.test(layout), 'layout must not re-declare icons');
  assert.ok(!/velvet-viking-icon-19[0-9]|velvet-viking-icon-180/.test(layout),
    'the old crest-derived tab icons must not be referenced');
  // Square canvases, so no browser letterboxes or stretches the mark.
  for (const [f, px] of [['src/app/icon.png', 512], ['src/app/apple-icon.png', 180]]) {
    const buf = fs.readFileSync(path.join(ROOT, f));
    assert.equal(buf.readUInt32BE(16), px, `${f} width`);
    assert.equal(buf.readUInt32BE(20), px, `${f} height`);
  }
});

test('the crest assets are optimised, at unchanged dimensions', () => {
  const crest = fs.readFileSync(path.join(ROOT, 'public/brand/velvet-viking-crest.png'));
  const og = fs.readFileSync(path.join(ROOT, 'public/brand/velvet-viking-crest-og.png'));
  // Dimensions are the artwork's and must not have moved.
  assert.equal(crest.readUInt32BE(16), 1223);
  assert.equal(crest.readUInt32BE(20), 1286);
  assert.equal(og.readUInt32BE(16), 1141);
  assert.equal(og.readUInt32BE(20), 1200);
  // Weight: both were over 1.8MB. The OG image is the one served raw to every
  // social crawler, so its size is a real cost rather than a repo tidy-up.
  assert.ok(crest.length < 700000, `crest is ${(crest.length/1e6).toFixed(2)}MB — the optimisation was lost`);
  assert.ok(og.length < 700000, `og image is ${(og.length/1e6).toFixed(2)}MB — the optimisation was lost`);
});
