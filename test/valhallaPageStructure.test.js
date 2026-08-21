'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

// /valhalla STRUCTURE — the narrative order, and the two CTAs.
//
// The order this guards is promise -> the year the product lives in -> how the
// system actually works -> what it looks like. It is checked by source
// position rather than by eye, because the failure mode is somebody inserting
// a section in the wrong place months from now and nothing complaining.
const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const code = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

const page = () => code(read('src/app/valhalla/page.tsx'));

// ---------------------------------------------------------------------------
// 1. SECTION ORDER
// ---------------------------------------------------------------------------
test('the page runs hero -> year-round -> explanation -> visuals, in that order', () => {
  const src = page();
  const at = (rx, what) => {
    const i = src.search(rx);
    assert.ok(i > -1, `the ${what} section is missing from /valhalla`);
    return i;
  };

  const hero = at(/<PageIntro /, 'hero');
  const yearRound = at(/<YearRound \/>/, 'year-round');
  const explanation = at(/pages\.valhalla\.explanation\.eyebrow/, 'explanation heading');
  const paragraphs = at(/pages\.valhalla\.expanded\.map/, 'explanation body');
  const visuals = at(/<DeviceFrame/, 'product visuals');

  assert.ok(hero < yearRound, 'the timeline must follow the opening hero, not precede it');
  assert.ok(yearRound < explanation, 'the year-round idea comes before the mechanics');
  assert.ok(explanation < paragraphs, 'the explanation heading introduces its own paragraphs');
  assert.ok(paragraphs < visuals, 'the screenshots illustrate an explanation already given');
});

test('the timeline is mounted once, on this page and nowhere else', () => {
  const mounts = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = path.join(dir, e.name);
      if (e.isDirectory()) walk(rel);
      else if (/\.tsx$/.test(e.name) && /<YearRound \/>/.test(code(read(rel)))) mounts.push(rel);
    }
  })('src');
  assert.deepEqual(mounts, ['src/app/valhalla/page.tsx'], 'exactly one mount, on /valhalla');
});

// ---------------------------------------------------------------------------
// 2. TWO OCCURRENCES OF ONE CTA — NOT TWO OFFERS
// ---------------------------------------------------------------------------
test('the same primary CTA appears exactly twice, from one source of truth', () => {
  const src = page();
  const ctas = (src.match(/<CtaButton/g) || []).length;
  assert.equal(ctas, 2, 'two occurrences of one CTA: one after the explanation, one at the close');

  // Both read their label and href from the same object, so they can never
  // drift into two different offers.
  assert.equal((src.match(/pages\.valhalla\.closingCta\.href/g) || []).length, 2);
  assert.equal((src.match(/pages\.valhalla\.closingCta\.label/g) || []).length, 2);
  assert.ok(
    !/href="\/pricing"|See Standard Pricing/.test(src),
    'neither CTA may hard-code its label or destination'
  );
});

test('the CTA still points at pricing, with its approved label', () => {
  const site = code(read('src/content/site.ts'));
  assert.match(site, /closingCta: \{ label: "See Standard Pricing", href: "\/pricing" \}/);
});

test('the second CTA follows the visuals and no second pricing block was added', () => {
  const src = page();
  const visuals = src.search(/<DeviceFrame/);
  const ctaPositions = [...src.matchAll(/<CtaButton/g)].map((m) => m.index);
  assert.ok(ctaPositions[0] < visuals, 'CTA #1 sits between the explanation and the screenshots');
  assert.ok(ctaPositions[1] > visuals, 'CTA #2 keeps the existing closing position');
  // A price, a plan name or a feature list here would be a second pricing
  // section rather than a second CTA.
  assert.ok(!/11\.99|89\.99|plans\.|PricingCard/.test(src), 'the page links to pricing, it does not restate it');
});

// ---------------------------------------------------------------------------
// 3. WHAT THE REORDER WAS NOT ALLOWED TO CHANGE
// ---------------------------------------------------------------------------
test('the protected lines survive the move verbatim', () => {
  const site = code(read('src/content/site.ts'));
  for (const line of [
    'A programme that learns you, not a plan that forgets you.',
    'You choose when to move on. Valhalla does not decide it for you.',
  ]) {
    assert.ok(site.includes(line), `protected copy lost: "${line}"`);
  }
  // Stored as two display lines; this is the heading the page shows.
  assert.match(site, /heading: \["A race is a milestone", "Not the finish"\]/);
});

test('the move introduced no new colour, type or spacing language', () => {
  const src = page();
  const yr = code(read('src/components/sections/YearRound.tsx'));
  // Every colour on both surfaces is a vv- token; no raw hex, rgb or
  // arbitrary Tailwind colour values crept in with the restructure.
  for (const [name, s] of [['valhalla/page.tsx', src], ['YearRound.tsx', yr]]) {
    assert.ok(!/#[0-9a-fA-F]{3,8}\b/.test(s), `${name} introduces a raw hex colour`);
    assert.ok(!/(bg|text|border)-\[/.test(s), `${name} introduces an arbitrary colour value`);
  }
  // The CTA keeps the shared gold button, unstyled by the page.
  assert.ok(!/<CtaButton[^>]*variant=/.test(src), 'both CTAs use the primary gold variant');
  assert.match(src, /border-t border-vv-line-soft bg-vv-bg/, 'the existing section divider stays');
});

test('the timeline carries its own divider, so the gate takes the rule with it', () => {
  const yr = code(read('src/components/sections/YearRound.tsx'));
  const gate = yr.search(/if \(!PRODUCT_CLAIMS\.yearRoundCoaching\) return null;/);
  const rule = yr.search(/border-t border-vv-line-soft/);
  assert.ok(gate > -1 && rule > gate, 'the divider must sit inside the gated return, not outside it');
  assert.ok(
    !/border-t/.test(page().slice(0, page().search(/<YearRound \/>/))),
    'the page must not draw a rule of its own above the timeline — it would survive the gate'
  );
});

test('the new explanation heading is real copy in the content file, not inline text', () => {
  const site = code(read('src/content/site.ts'));
  assert.match(site, /explanation: \{\s*eyebrow: "Inside Valhalla",/);
  assert.match(site, /heading: \["Your first plan", "Your next session"\]/);
  // The site's own vocabulary: no coach claim, no generic SaaS heading.
  const src = page();
  assert.ok(!/coach/i.test(src));
  assert.ok(!/How It Works|Get Started|Unlock|Supercharge|Take your .* to the next level/i.test(site.slice(
    site.indexOf('explanation: {'),
    site.indexOf('explanation: {') + 400
  )));
});
