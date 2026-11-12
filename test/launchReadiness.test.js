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
// 1. THE MARK — THE NAME BETWEEN TWO DOTS
// ---------------------------------------------------------------------------
//
// WHAT THIS SECTION USED TO HOLD, and why none of it survived. It pinned a
// 1295x1214 RGBA PNG as "the supplied mark", required exactly one component to
// reference it, and separately required the crest to keep the hero. All three
// described artwork the product has retired: the crest's lettering reads
// VALHALLA AWAITS and is pixels, so it could not be renamed, only withdrawn —
// and the gold VV chevron went with it. The mark is now type and two circles.
test('the mark is type and two dots, with no artwork to keep in sync', () => {
  const w = code(read('src/components/ui/Wordmark.tsx'));
  assert.match(w, /Sacoro/, 'the mark is the product name');
  assert.ok(!/\.png|next\/image|<Image/.test(w),
    'the mark must not reacquire a raster master — that is what it replaced');
  // The app's own numbers, so the two marks cannot drift apart.
  assert.match(w, /letterSpacing: "0\.17em"/);
  assert.match(w, /marginRight: "-0\.17em"/,
    'the trailing track must be taken back or the mark renders off-centre');
  assert.match(w, /font-display/, 'Cinzel, the face the app sets the mark in');
  assert.match(w, /bg-vv-gold-bright/, 'founder: "Just 1 gold dot either side."');
  assert.match(w, /flex-none/, 'a narrow phone closes the tracking, never the dots');
});

test('the retired artwork is gone from the product, not merely unreferenced', () => {
  for (const dead of ['src/components/ui/Crest.tsx', 'src/components/ui/Mark.tsx']) {
    assert.ok(!fs.existsSync(path.join(ROOT, dead)), dead + ' must not survive as a component');
  }
  for (const f of srcFiles()) {
    const src = code(read(f));
    assert.ok(!/velvet-viking-crest|velvet-viking-mark\.png/.test(src),
      f + ' still reaches for retired brand artwork');
  }
});

test('one component owns the mark, so both surfaces carry the same object', () => {
  const users = srcFiles().filter((f) => /<Wordmark/.test(code(read(f))));
  assert.ok(users.includes('src/components/layout/HeaderBrand.tsx'), 'the header');
  assert.ok(users.includes('src/components/sections/Hero.tsx'), 'the hero');
  // Nothing may hand-set the name in display type and call it the mark.
  for (const f of srcFiles()) {
    if (f.endsWith('Wordmark.tsx')) continue;
    const src = code(read(f));
    assert.ok(!/font-display[^"]*>\s*Sacoro/.test(src),
      f + ' sets the name as type instead of using the mark');
  }
});

// ---------------------------------------------------------------------------
// 2. THE COMPANY AND THE PRODUCT ARE TWO NAMES
// ---------------------------------------------------------------------------
//
// Founder, asked which one customer-facing surfaces carry: "If it's customer
// facing SACORO." Velvet Viking Ltd is the registered company; it signs the
// work and is the data controller. The old brand-meaning section on
// /philosophy explained the VV chevron's symbolism -- "the triangle is
// progress" -- and went with the chevron, because a page explaining a mark
// nobody can see is worse than no page.
test('the product is Sacoro on customer-facing surfaces', () => {
  const site = code(read('src/content/site.ts'));
  assert.match(site, /product: "Sacoro"/);
  assert.match(site, /name: "Velvet Viking"/, 'the company keeps its own name');
  const brandBlock = site.slice(site.indexOf('export const brand = {'),
                               site.indexOf('} as const;', site.indexOf('export const brand = {')));
  assert.ok(!/tagline:|crestAlt:/.test(brandBlock),
    'both named retired artwork and must not return to the brand block');
});

test('the retired brand-meaning section is gone from /philosophy', () => {
  assert.ok(!fs.existsSync(path.join(ROOT, 'src/components/sections/TheMark.tsx')));
  assert.ok(!/TheMark/.test(read('src/app/philosophy/page.tsx')));
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
test('the mark fits a 360px phone without a breakpoint', () => {
  /* WAS: assert the header stepped down to 26px below 380px. That step existed
     because "VELVET VIKING" rendered 274px wide at 30px, against 312px of
     usable width once the 40px menu control was counted -- a 2px overflow on a
     real Android width. SACORO is six characters rather than thirteen and the
     mark caps itself with a clamp(), so there is no step to make and nothing
     to drop. The guarantee is unchanged and is now structural. */
  const w = code(read('src/components/ui/Wordmark.tsx'));
  assert.match(w, /clamp\(1\.22rem, 6\.2vw, 1\.62rem\)/, 'the mark caps its own size');
  assert.match(w, /whitespace-nowrap/, 'the name must never wrap');
  const brandMark = code(read('src/components/layout/HeaderBrand.tsx'));
  assert.ok(!/text-\[\d+px\]/.test(brandMark),
    'the header must not re-impose a fixed size on the mark');
  // And the real check is the rendered one: a 360px sweep runs in the
  // verification pass, which is what caught the original 2px.
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
    'src/app/sacoro/page.tsx',
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

  // OPEN, and this time both halves of the question are answered rather than
  // one. The backend prerequisite was never in doubt — TRIAL_DAYS = 14 in
  // api/_products.js, applied by api/_stripe.js with payment_method_collection
  // 'always'. What closed the flag last time was the OTHER half: a visitor
  // could not reach any of it, because public signup was refused by a trigger
  // on auth.users for every address outside the private-beta allowlist.
  //
  // The private beta is retired. The trigger is dropped, the allowlist is kept
  // as history rather than as an entitlement, and charging is switched on in
  // the app's environment. A trial the site offers is now a trial the product
  // honours, which is the only condition this flag has ever really had.
  assert.match(code(read('src/content/commerce.ts')), /live:\s*true/);

  // STILL CLOSED. Legal publication is not this repository's to grant, and
  // each of these three still carries an unresolved decision inside its own
  // draft — the effective dates, the liability-cap question and, for the
  // commercial privacy policy, the Article 9 condition. A flag flipped here
  // would assert an approval nobody has given.
  const legal = code(read('src/content/legal.ts'));
  // Terms and privacyCommercial opened on 24 August 2026, on the founder's
  // full-document approval after solicitor review of the complete documents —
  // not on the strength of the one clause that had been reviewed before.
  assert.match(legal, /terms:\s*true/);
  assert.match(legal, /privacyCommercial:\s*true/);
  assert.match(legal, /cookies:\s*false/);
  // Public commercial claims nobody has approved.
  assert.match(legal, /foundingPriceLock:\s*false/);
  assert.match(legal, /subscriptionPause:\s*false/);
  // Still gated in the app itself.
  assert.match(code(read('src/content/productClaims.ts')), /garminIntegration:\s*false/);
  // And the seams the app owns still resolve on the APP's origin, which is
  // what "the app owns them" has always meant. They were null while there was
  // nothing to point at; at launch they name real routes, and the assertion
  // moves from "unwired" to "not ours to serve" -- an account or a purchase
  // resolved on this side of the link is one resolved without the athlete's
  // token, their entitlement or their agreements.
  const commerce = code(read('src/content/commerce.ts'));
  assert.match(commerce, /createAccount:\s*appUrl/);
  assert.match(commerce, /signIn:\s*appSignInUrl/);
  for (const m of commerce.match(/(createAccount|signIn):[^,]+/g) || []) {
    assert.ok(!/["'`]\//.test(m), `a seam points at a website-local route: ${m}`);
  }
});

test('no published document carries a placeholder, and the unpublished one still does', () => {
  /* WAS "the legal drafts that stay unpublished still carry their open
     decisions", which held the flags shut by pointing at the [TO BE CONFIRMED]
     inside each. Two of those three are now resolved and published, so the
     test inverts: what matters is that resolution came BEFORE publication and
     that nothing shipped with a placeholder still in it.
     The cookie policy keeps its own, and keeps its gate with it. */
  const legal = read('src/content/legal.ts');
  const between = (a, b) => legal.slice(legal.indexOf(a), legal.indexOf(b));
  for (const [name, from, to] of [
    ['privacyDraft', 'const privacyDraft', 'const termsDraft'],
    ['termsDraft', 'const termsDraft', 'const cookiesDraft'],
    ['privacyCommercialDraft', 'const privacyCommercialDraft', 'const betaTermsDraft'],
  ]) {
    assert.ok(!/TBC\(/.test(between(from, to)), name + ' is published and must carry no placeholder');
  }
  assert.match(between('const cookiesDraft', 'const privacyCommercialDraft'), /TBC\(/,
    'the cookie policy is unpublished and still has no effective date');
  // The two resolved decisions are decided IN the documents, not merely removed.
  assert.match(between('const termsDraft', 'const cookiesDraft'), /the greater of two amounts/,
    'the liability cap must be stated, not deleted');
  assert.match(between('const privacyCommercialDraft', 'const betaTermsDraft'), /Article 9\(2\)\(a\)/,
    'the Article 9 condition must be named, not dropped');
  assert.match(between('const privacyCommercialDraft', 'const betaTermsDraft'), /Article 6\(1\)\(b\)/,
    'and the service basis stays contract, not consent');
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

test('the share card is the mark, at the size a crawler expects', () => {
  /* WAS the crest pair: a 1223x1286 canonical PNG and a 1141x1200 OG copy,
     both pinned at their artwork dimensions and under 700KB. Both are gone.
     The crest could not be renamed -- its lettering is baked in and reads
     VALHALLA AWAITS -- so it was withdrawn rather than edited, and the card
     is now composed from the same parts the site renders: the mark between
     its two gold dots, the motto, and the company byline.

     1200x630 IS THE REQUIREMENT, not a preference. It is the aspect every
     major crawler crops to, and a square crest was always being cut. */
  const og = fs.readFileSync(path.join(ROOT, 'public/brand/sacoro-og.png'));
  assert.equal(og.readUInt32BE(16), 1200, 'OG width');
  assert.equal(og.readUInt32BE(20), 630, 'OG height');
  assert.ok(og.length < 400000,
    `og image is ${(og.length/1e6).toFixed(2)}MB — it is fetched by every crawler`);
  assert.match(code(read('src/app/layout.tsx')), /\/brand\/sacoro-og\.png/);
});

test('the retired brand artwork is deleted, not just unreferenced', () => {
  for (const f of ['public/brand/velvet-viking-crest.png',
                   'public/brand/velvet-viking-crest-og.png',
                   'public/brand/velvet-viking-mark.png',
                   'public/brand/velvet-viking-icon-source.png']) {
    assert.ok(!fs.existsSync(path.join(ROOT, f)),
      f + ' still ships — a retired mark left in /public is a mark still being served');
  }
});
