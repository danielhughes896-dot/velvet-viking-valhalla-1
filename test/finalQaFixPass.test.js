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
test('the Sign In label is a real link at a readable contrast, not a muted stub', () => {
  // WAS: an assertion that the DISABLED Sign In label used the plain
  // ink-faint token rather than ink-faint/50, because stacking 50% opacity on
  // an already-muted token dropped it below AA. The label is no longer
  // disabled — the entry-journey pass made it a live route to the app's
  // account page — so the original defect cannot recur in that form. What is
  // still worth holding is the contrast floor it was protecting: whatever
  // this label is, it must not be an opacity-thinned token.
  const src = code(read('src/components/layout/MobileNav.tsx'));
  assert.ok(
    !/text-vv-ink-faint\/50/.test(src),
    'the low-contrast opacity-50 variant must not be used for the Sign In label'
  );
  assert.match(src, /href=\{appSignInUrl\}/, 'Sign In must be a real link');
  /* WAS ink-dim, "a full token step above the muted ink-faint". It is full
     ink now, which is a further step in the same direction, not a retreat
     from it. Founder: "I want all text to be white!! Titles sub tex ect."
     The dim and faint tokens came off every reading surface on the site in
     that pass, so asserting ink-dim here would now require this one label to
     be the only muted text left. What the test is for — that an active link
     is never thinned below the full ink token — is asserted directly. */
  assert.match(
    src,
    /text-vv-ink[^-"][^"]*"\s*>\s*\{nav\.signIn\.label\}/,
    'an active link belongs on the full ink token'
  );
  assert.ok(
    !/text-vv-ink-(dim|faint)[^"]*"\s*>\s*\{nav\.signIn\.label\}/.test(src),
    'the Sign In label must not be muted below full ink'
  );
});

// ---------------------------------------------------------------------------
// 4. SITEMAP — LEGAL ROUTES FOLLOW THEIR GATES
// ---------------------------------------------------------------------------
test('the sitemap derives its legal routes from the approval gates', () => {
  const sitemap = code(read('src/app/sitemap.ts'));
  /* WAS a hand-maintained "/privacy" literal in the routes array, with a
     comment telling whoever flipped a LEGAL_APPROVALS gate to remember to come
     back and add the route. That instruction was missed the first time it
     mattered: the commercial Terms published and the sitemap still advertised
     only /privacy. The failure is silent in both directions — a live contract
     hidden from crawlers, or a gated placeholder offered to them — so the list
     is now derived from publicLegalLinks, which is the same gate-driven list
     the footer renders. A document is offered for indexing exactly when it is
     offered to a reader. */
  assert.match(sitemap, /import \{ publicLegalLinks \} from "@\/content\/legal"/);
  assert.match(sitemap, /publicLegalLinks\.map\(\(link\) => link\.href\)/);
  assert.ok(
    !/"\/(terms|cookies|privacy)"/.test(sitemap),
    'no legal route may be hard-coded alongside the derived list — that is how the two drift apart'
  );
  assert.ok(!/beta-terms/.test(sitemap), '/beta-terms stays out of the public sitemap');
  // The non-legal routes are still a plain list, because nothing gates them.
  for (const r of ['/sacoro', '/pricing', '/start', '/philosophy', '/about', '/support']) {
    assert.ok(sitemap.includes(`"${r}"`), `${r} must be listed`);
  }
});

test('the gates the sitemap follows are the published ones, and cookies is not', () => {
  // The other half of the chain above: derivation is only correct if what it
  // derives from is correct. publicLegalLinks filters on these three.
  const legal = code(read('src/content/legal.ts'));
  const at = legal.indexOf('export const LEGAL_APPROVALS');
  const block = legal.slice(at, legal.indexOf('} as const;', at));
  assert.match(block, /privacy: true/, 'the Privacy Policy is published and belongs in the sitemap');
  assert.match(block, /terms: true/, 'the commercial Terms published on 24 August 2026');
  assert.match(block, /cookies: false/, 'the cookie policy is approved by nobody and stays out');
});

test('the gated routes still exist as real pages, only excluded from the sitemap', () => {
  assert.ok(fs.existsSync(path.join(ROOT, 'src/app/terms/page.tsx')), '/terms must still be a real route');
  assert.ok(fs.existsSync(path.join(ROOT, 'src/app/cookies/page.tsx')), '/cookies must still be a real route');
});

// ---------------------------------------------------------------------------
// 5. CROSS-PAGE REPETITION — HOMEPAGE VS /VALHALLA
// ---------------------------------------------------------------------------
test('the exact "you decide whether to take it" clause is not duplicated across homepage and /valhalla', () => {
  // The phrase is expected to survive exactly once — in sacoroProduct.body,
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
