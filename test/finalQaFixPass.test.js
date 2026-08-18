'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

// FINAL QA FIX PASS regression tests.
//
// Guards the six defects fixed off the pre-launch QA audit: the mobile menu's
// focus management, the missing <h1> on live legal documents, the disabled
// Sign In label's contrast, the sitemap listing gated/noindex routes, and the
// two content deduplications (valhalla vs. homepage, about's same-page
// repeat). Source-level, matching this repo's existing test style — no build
// or server required.
const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

// Same convention as publicMetadata.test.js: explanatory "was X" comments in
// this codebase legitimately quote the old, wrong text — that's what stops
// it being reintroduced. Assertions about shipped content run with comments
// stripped, so prose about a fix doesn't get mistaken for the fix itself.
const code = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

// ---------------------------------------------------------------------------
// 1. MOBILE NAV — FOCUS / MODAL ACCESSIBILITY
// ---------------------------------------------------------------------------
test('the mobile menu panel carries dialog/modal semantics', () => {
  const src = read('src/components/layout/MobileNav.tsx');
  assert.match(src, /role="dialog"/);
  assert.match(src, /aria-modal="true"/);
});

test('the menu moves focus into the panel on open and back to the button on close', () => {
  const src = read('src/components/layout/MobileNav.tsx');
  assert.match(src, /buttonRef/, 'a ref to the opening button must exist to return focus to it');
  assert.match(src, /panelRef/, 'a ref to the panel must exist to focus into it');
  assert.match(
    src,
    /panelRef\.current\?\.querySelector.*FOCUSABLE_SELECTOR.*\?\.focus\(\)/,
    'opening the menu must focus its first focusable element'
  );
  assert.match(
    src,
    /buttonRef\.current\?\.focus\(\)/,
    'closing the menu must return focus to the button that opened it'
  );
});

test('the menu traps Tab/Shift+Tab within its own focusable elements while open', () => {
  const src = read('src/components/layout/MobileNav.tsx');
  assert.match(src, /event\.key !== "Tab"/);
  assert.match(src, /event\.shiftKey/);
  assert.match(src, /event\.preventDefault\(\)/);
});

test('Escape-to-close is preserved', () => {
  const src = read('src/components/layout/MobileNav.tsx');
  assert.match(src, /event\.key === "Escape"/);
});

// ---------------------------------------------------------------------------
// 2. LEGAL DOCUMENTS — H1 HIERARCHY
// ---------------------------------------------------------------------------
test('LegalDocument renders its document title as an h1', () => {
  const src = read('src/components/sections/LegalDocument.tsx');
  assert.match(
    src,
    /<SectionHeading eyebrow=\{doc\.eyebrow\} heading=\{doc\.heading\} align="center" level="h1" \/>/,
    'the document-title heading must pass level="h1", not fall through to the h2 default'
  );
});

test('LegalDocument section headings stay h2', () => {
  const src = read('src/components/sections/LegalDocument.tsx');
  assert.match(src, /<h2 className="font-head text-sm font-semibold/, 'per-section headings must remain h2');
});

// ---------------------------------------------------------------------------
// 3. MOBILE NAV — DISABLED "SIGN IN" CONTRAST
// ---------------------------------------------------------------------------
test('the disabled Sign In label no longer stacks opacity onto an already-muted token', () => {
  const src = code(read('src/components/layout/MobileNav.tsx'));
  assert.ok(
    !/text-vv-ink-faint\/50/.test(src),
    'the low-contrast opacity-50 variant must not be used for the disabled Sign In label'
  );
  assert.match(
    src,
    /className="font-head text-xs font-semibold uppercase tracking-\[0\.2em\] text-vv-ink-faint"\s*>\s*\{nav\.signIn\.label\}/,
    'the disabled Sign In label should use the plain (non-opacity-modified) ink-faint token'
  );
});

// ---------------------------------------------------------------------------
// 4. SITEMAP — UNPUBLISHED TERMS / COOKIES
// ---------------------------------------------------------------------------
test('the sitemap excludes gated, noindexed routes and keeps published ones', () => {
  const sitemap = code(read('src/app/sitemap.ts'));
  assert.ok(!/"\/terms"/.test(sitemap), '/terms is still gated and must not appear in the sitemap');
  assert.ok(!/"\/cookies"/.test(sitemap), '/cookies is still gated and must not appear in the sitemap');
  assert.ok(!/beta-terms/.test(sitemap), '/beta-terms stays out of the public sitemap');
  assert.match(sitemap, /"\/privacy"/, 'the Privacy Policy is public and must stay in the sitemap');
  assert.match(sitemap, /"\/valhalla"/);
  assert.match(sitemap, /"\/pricing"/);
  assert.match(sitemap, /"\/start"/);
  assert.match(sitemap, /"\/philosophy"/);
  assert.match(sitemap, /"\/about"/);
});

test('the gated routes still exist as real pages, only excluded from the sitemap', () => {
  assert.ok(fs.existsSync(path.join(ROOT, 'src/app/terms/page.tsx')), '/terms must still be a real route');
  assert.ok(fs.existsSync(path.join(ROOT, 'src/app/cookies/page.tsx')), '/cookies must still be a real route');
});

// ---------------------------------------------------------------------------
// 5. CROSS-PAGE REPETITION — HOMEPAGE VS /VALHALLA
// ---------------------------------------------------------------------------
test('the exact "you decide whether to take it" clause is not duplicated across homepage and /valhalla', () => {
  // The phrase is expected to survive exactly once — in valhallaProduct.body,
  // the homepage's own concise introduction, which this fix deliberately
  // left untouched. What must not happen is a SECOND, verbatim copy of it
  // living in the /valhalla deep-dive paragraph too.
  const site = code(read('src/content/site.ts'));
  const occurrences = (site.match(/you decide whether to take it/g) || []).length;
  assert.equal(
    occurrences,
    1,
    'the closing clause should appear exactly once (on the homepage) — a second, verbatim copy on /valhalla is the defect this fix removed'
  );
});

test('the valhalla deep-dive paragraph advances beyond the homepage summary with concrete specifics', () => {
  const site = read('src/content/site.ts');
  assert.match(
    site,
    /the pace or effort target set for your next session, not a plan rewritten from scratch/,
    'the deepened paragraph must state what an adjustment concretely changes'
  );
});

// ---------------------------------------------------------------------------
// 6. SAME-PAGE REPETITION — /ABOUT
// ---------------------------------------------------------------------------
test('/about states "first product" exactly once, not twice back-to-back', () => {
  const site = read('src/content/site.ts');
  const at = site.indexOf('about: {');
  const end = site.indexOf('\n  },', at);
  const aboutBlock = code(site.slice(at, end));
  const occurrences = (aboutBlock.match(/first product|first thing it has built/g) || []).length;
  assert.equal(occurrences, 1, 'the "first product" fact must be stated exactly once on the about page');
});

test('/about\'s expanded paragraph does not duplicate FutureWorld\'s forward-looking sentence', () => {
  const site = read('src/content/site.ts');
  assert.ok(
    !/will apply to whatever Velvet Viking builds next/.test(site),
    'the previously-removed FutureWorld-duplicate sentence must not return'
  );
});
