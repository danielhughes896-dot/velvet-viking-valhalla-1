'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

// GALLERY PAGE regression tests.
//
// Guards: the nav link's position, the route's metadata/sitemap presence,
// that every gallery image carries real alt text, that no image is reused
// more than once as literally the same crop, and that the homepage itself
// was not touched by this task. Source-level, matching this repo's
// existing test style — no build or server required.
const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const code = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

// ---------------------------------------------------------------------------
// 1. NAVIGATION
// ---------------------------------------------------------------------------
test('Gallery sits in nav.links between Valhalla and Pricing', () => {
  const site = code(read('src/content/site.ts'));
  const at = site.indexOf('export const nav');
  const block = site.slice(at, site.indexOf('} as const;', at));
  const labels = [...block.matchAll(/label:\s*"([^"]+)"/g)].map((m) => m[1]);
  const order = labels.filter((l) => ['Valhalla', 'Gallery', 'Pricing', 'Philosophy', 'About'].includes(l));
  assert.deepEqual(order, ['Valhalla', 'Gallery', 'Pricing', 'Philosophy', 'About']);
});

test('Gallery links to /gallery', () => {
  const site = code(read('src/content/site.ts'));
  assert.match(site, /\{\s*label:\s*"Gallery",\s*href:\s*"\/gallery"\s*\}/);
});

test('MobileNav and Header both derive their nav list from nav.links, so Gallery reaches both surfaces automatically', () => {
  const mobileNav = read('src/components/layout/MobileNav.tsx');
  assert.match(mobileNav, /\.\.\.nav\.links\.map/, 'MobileNav must still spread nav.links rather than hard-coding its own list');
  const header = read('src/components/layout/Header.tsx');
  assert.match(header, /nav\.links\.map/, 'Header noscript fallback must still map nav.links');
});

// ---------------------------------------------------------------------------
// 2. ROUTE / METADATA / SITEMAP
// ---------------------------------------------------------------------------
test('/gallery is a real route with its own metadata', () => {
  const src = read('src/app/gallery/page.tsx');
  assert.match(src, /title:\s*pages\.gallery\.heading/);
  assert.match(src, /description:\s*pages\.gallery\.sub/);
  assert.match(src, /canonical:\s*"\/gallery"/);
});

test('pages.gallery exists in site.ts with short, non-empty copy', () => {
  const site = read('src/content/site.ts');
  const at = site.indexOf('gallery: {');
  assert.ok(at !== -1, 'pages.gallery must exist');
  const end = site.indexOf('\n  },', at);
  const block = site.slice(at, end);
  assert.match(block, /heading:\s*"[^"]+"/);
  assert.match(block, /sub:\s*"[^"]+"/);
});

test('/gallery is listed in the sitemap, and /beta-terms is still excluded', () => {
  const sitemap = code(read('src/app/sitemap.ts'));
  assert.match(sitemap, /"\/gallery"/);
  assert.ok(!/beta-terms/.test(sitemap), '/beta-terms must stay out of the public sitemap');
  assert.match(sitemap, /"\/privacy"/, 'the Privacy Policy must stay in the sitemap');
});

test('the gallery route has no robots noindex override — it is meant to be indexable', () => {
  const src = read('src/app/gallery/page.tsx');
  assert.ok(!/robots:\s*\{\s*index:\s*false/.test(src));
});

// ---------------------------------------------------------------------------
// 3. IMAGE CONTENT
// ---------------------------------------------------------------------------
test('every gallery image has real, non-empty alt text and a real source file', () => {
  const galleryContent = read('src/content/gallery.ts');
  const items = [...galleryContent.matchAll(/src:\s*"(\/photography\/[^"]+)"/g)].map((m) => m[1]);
  assert.ok(items.length >= 6, 'the gallery must ship with a genuinely populated set of images');
  for (const src of items) {
    const filePath = path.join(ROOT, 'public', src);
    assert.ok(fs.existsSync(filePath), `${src} must be a real file in public/photography`);
  }
  const alts = [...galleryContent.matchAll(/alt:\s*"([^"]+)"/g)].map((m) => m[1]);
  for (const alt of alts) {
    assert.ok(alt.trim().length > 10, `alt text "${alt}" must be a real, descriptive sentence, not a stub`);
  }
});

test('no gallery image src is used with an identical aspect ratio in more than one entry (a real recomposition, not a straight duplicate)', () => {
  const galleryContent = code(read('src/content/gallery.ts'));
  const items = [...galleryContent.matchAll(/src:\s*"([^"]+)"[^}]*?aspect:\s*"([^"]+)"/gs)].map((m) => `${m[1]}::${m[2]}`);
  const seen = new Set();
  for (const key of items) {
    assert.ok(!seen.has(key), `duplicate src+aspect pairing found: ${key}`);
    seen.add(key);
  }
});

test('the gallery does not use the Valhalla app screenshots (product UI, not photography)', () => {
  const galleryContent = read('src/content/gallery.ts');
  assert.ok(!/app-today\.jpg|app-full-plan\.jpg/.test(galleryContent));
});

test('the gallery never uses the Work Travels composite file, which has homepage marketing copy baked into its pixels', () => {
  const galleryContent = code(read('src/content/gallery.ts'));
  const galleryComponent = code(read('src/components/sections/Gallery.tsx'));
  assert.ok(
    !/work-travels-with-you\.jpg|work-travels-mobile-headline\.jpg/.test(galleryContent + galleryComponent),
    'this file bakes in the "The Work Travels With You" headline and duplicates the temple/map imagery — any crop of it is wrong for a photography-only page'
  );
});

// ---------------------------------------------------------------------------
// 4. COPY DISCIPLINE — no re-explaining Valhalla/Philosophy/About
// ---------------------------------------------------------------------------
test('gallery intro copy does not restate Valhalla/Philosophy/About\'s own claims', () => {
  const site = read('src/content/site.ts');
  const at = site.indexOf('gallery: {');
  const end = site.indexOf('\n  },', at);
  const block = site.slice(at, end);
  for (const phrase of [
    'pays attention',
    'Earn Your Place is not a slogan',
    'first product',
    'reads your training',
  ]) {
    assert.ok(!block.includes(phrase), `gallery copy must not restate "${phrase}" from another page`);
  }
});

// ---------------------------------------------------------------------------
// 5. HOMEPAGE PROTECTION
// ---------------------------------------------------------------------------
test('the homepage does not import or render the Gallery section', () => {
  const homepage = read('src/app/page.tsx');
  assert.ok(!/Gallery/.test(homepage), 'Gallery must not appear on the homepage — /gallery is a standalone destination only');
});

test('the homepage section order is unchanged (Gallery task must not touch it)', () => {
  const homepage = read('src/app/page.tsx');
  const order = [...homepage.matchAll(/<(Hero|DocumentaryReel|EditorialSplit|ProductShowcase|Provenance|RaceBreak|WorkTravels|FutureWorld|FinalCta)\b/g)].map(
    (m) => m[1]
  );
  assert.deepEqual(order, [
    'Hero',
    'DocumentaryReel',
    'EditorialSplit',
    'ProductShowcase',
    'Provenance',
    'RaceBreak',
    'WorkTravels',
    'EditorialSplit',
    'FutureWorld',
    'FinalCta',
  ]);
});
