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

// Comment-stripped, exactly as the other suites treat source: this file's
// header legitimately QUOTES the prototype block it supersedes, and the old
// gold it replaced, which is what stops either being reintroduced by someone
// who never saw them.
const css = () => code(read('src/app/globals.css'));

// VISUAL RECONCILIATION with the Sacoro app (repo velvet-viking-valhalla-2).
//
// The values below are the app's own, copied from its :root and
// [data-theme="light"] blocks at main 7831de0. They are asserted as literals
// rather than read from the app, because the app is a separate repository that
// this test suite cannot see — so the guarantee this file gives is narrower and
// more honest than "they match": it is "these did not drift again without
// somebody deciding to". If the app moves a token, this file is where the
// decision to follow it gets recorded.

// ---------------------------------------------------------------------------
// 1. THE SHARED TOKEN LAYER
// ---------------------------------------------------------------------------
test('the light ground carries the app’s own values', () => {
  const c = css();
  for (const [token, value] of [
    ['--vv-bg', '#f4f1ea'],
    ['--vv-bg-2', '#fcfbfb'],
    ['--vv-bg-3', '#ebe5d8'],
    ['--vv-bg-4', '#e2dac9'],
    ['--vv-ink', '#171717'],
    ['--vv-ink-dim', '#514d45'],
    ['--vv-ink-faint', '#5d574c'],
    ['--vv-line', '#dad1bb'],
    ['--vv-line-soft', '#e5decd'],
    ['--vv-gold-text', '#7a5c1e'],
  ]) {
    assert.match(c, new RegExp(`${token}:\\s*${value};`), `${token} drifted from the app's ${value}`);
  }
});

test('bronze and gold are the app’s, not the old lighter prototype pair', () => {
  const c = css();
  assert.match(c, /--vv-bronze:\s*#c0923f;/);
  assert.match(c, /--vv-bronze-2:\s*#9c7433;/);
  assert.match(c, /--vv-gold:\s*#e3b15a;/);
  assert.match(c, /--vv-bronze-ink:\s*#1a1204;/);
  // The prototype ran one flat value for both jobs. A single hex doing both
  // is what made the website's gold read lighter than the product's.
  assert.ok(!/#c9a35a/i.test(c), 'the prototype gold must not survive anywhere in the palette');
});

test('the dark ramp matches the ground the product screenshots were taken on', () => {
  const c = css();
  const dark = c.slice(c.indexOf('.theme-dark {'), c.indexOf('@theme inline'));
  for (const [token, value] of [
    ['--vv-bg', '#151417'],
    ['--vv-bg-2', '#1b1a1e'],
    ['--vv-bg-3', '#201f23'],
    ['--vv-bg-4', '#26252a'],
    ['--vv-ink', '#f4f1ea'],
    ['--vv-ink-dim', '#bbb4a4'],
    ['--vv-ink-faint', '#9d9787'],
    ['--vv-line', '#302e36'],
    ['--vv-line-soft', '#232126'],
  ]) {
    assert.match(dark, new RegExp(`${token}:\\s*${value};`), `dark ${token} drifted from the app's ${value}`);
  }
});

test('shadows carry the warm tint the ivory ground needs', () => {
  const c = css();
  assert.match(c, /--vv-shadow-sm:\s*0 4px 12px rgba\(90, 70, 30, 0\.1\)/);
  assert.match(c, /--vv-shadow:\s*0 10px 30px rgba\(90, 70, 30, 0\.14\)/);
  assert.ok(!/rgba\(30, 26, 15/.test(c), 'the old grey-green shadow tint must not survive');
});

test('radii were already aligned and were left alone', () => {
  const c = css();
  assert.match(c, /--vv-radius-sm:\s*10px;/);
  assert.match(c, /--vv-radius:\s*16px;/);
  assert.match(c, /--vv-radius-lg:\s*22px;/);
});

test('the palette declares itself reconciled, not a prototype', () => {
  const raw = read('src/app/globals.css');
  assert.match(raw, /RECONCILED PALETTE/, 'the file header states what the palette now is');
  // The prototype header and its "not yet reconciled" sign-off may survive
  // only as the quoted history in that header — never as a live claim, and
  // never past the first comment block.
  const header = raw.slice(0, raw.indexOf('*/'));
  for (const phrase of ['PROTOTYPE PALETTE', 'not yet reconciled']) {
    const total = raw.split(phrase).length - 1;
    const inHeader = header.split(phrase).length - 1;
    assert.equal(total, inHeader, `"${phrase}" survives outside the header note that supersedes it`);
  }
});

// ---------------------------------------------------------------------------
// 2. CHERRY LACQUER — A CLOSED SET
// ---------------------------------------------------------------------------
test('the accent exists in both themes, at the app’s canonical values', () => {
  const c = css();
  const light = c.slice(0, c.indexOf('.theme-dark {'));
  const dark = c.slice(c.indexOf('.theme-dark {'), c.indexOf('@theme inline'));
  // Light uses the canonical value unmodified for both jobs.
  assert.match(light, /--vv-cherry:\s*#532d3a;/);
  assert.match(light, /--vv-cherry-fill:\s*#532d3a;/);
  // Dark splits by job: a dark fill that a white label identifies, and a
  // lifted rim that gives the control the 3:1 boundary a fill cannot.
  assert.match(dark, /--vv-cherry:\s*#9a546c;/);
  assert.match(dark, /--vv-cherry-fill:\s*#7a2e42;/);
});

test('cherry is a token everywhere — no component carries the hex', () => {
  for (const f of srcFiles()) {
    const src = read(f);
    for (const hex of [/#532d3a/i, /#7a2e42/i, /#9a546c/i]) {
      assert.ok(!hex.test(src), `${f} hard-codes the accent — a scattered hex is how an accent becomes a second brand`);
    }
  }
});

test('exactly one component knows how to paint the accent', () => {
  const painters = srcFiles().filter((f) => /bg-vv-cherry/.test(code(read(f))));
  assert.deepEqual(painters, ['src/components/ui/CtaButton.tsx'],
    'only CtaButton may fill with the accent; every other surface asks for the variant');
});

test('the accent is used for one job: the action that starts a plan', () => {
  const users = srcFiles().filter((f) => /variant="cherry"/.test(code(read(f))));
  assert.deepEqual(
    users.sort(),
    [
      // Reordered, not changed: the SET is identical. `users.sort()` is
      // alphabetical and the route moved from /valhalla to /sacoro, so this
      // entry now sorts before /start rather than after it.
      'src/app/sacoro/page.tsx',
      'src/app/start/page.tsx',
      'src/components/layout/Header.tsx',
      'src/components/layout/MobileNav.tsx',
      'src/components/sections/FinalCta.tsx',
      'src/components/sections/Hero.tsx',
      'src/components/sections/PricingCard.tsx',
      'src/components/sections/ProductShowcase.tsx',
    ],
    'the accent spread beyond the build action — re-decide the set, do not edit this list'
  );
  // Every one of them is the build button, not decoration.
  for (const f of users) {
    const src = code(read(f));
    assert.match(src, /buildUrl|appUrl/, `${f} paints the accent on something that is not the build action`);
  }
});

test('gold is still the brand: the accent took none of its jobs', () => {
  const c = css();
  // Eyebrows, rules, the crest and the metallic wordmark all still resolve
  // through the gold/bronze tokens.
  assert.match(c, /\.theme-dark \.text-metallic/);
  assert.match(c, /linear-gradient\(180deg, var\(--vv-gold-bright\) 0%, var\(--vv-gold-mid\) 100%\)/);
  assert.match(c, /::selection[\s\S]{0,80}var\(--vv-bronze\)/);
  // The exploratory CTA keeps the gold variant, so the two accents are
  // visibly doing different jobs on the same page.
  assert.match(code(read('src/components/ui/CtaButton.tsx')), /primary: "bg-vv-bronze text-vv-bronze-ink/);
  // And the eyebrow token is untouched across the site's section headings.
  assert.match(code(read('src/components/ui/SectionHeading.tsx')), /text-vv-bronze-text/);
});

// ---------------------------------------------------------------------------
// 3. INTERACTIVE FLOOR
// ---------------------------------------------------------------------------
test('every CTA clears the 44px touch floor the app enforces', () => {
  const btn = code(read('src/components/ui/CtaButton.tsx'));
  assert.match(btn, /min-h-11/, '44px, matching .btn:not(.btn-sm){min-height:44px} in the app');
  // The floor lives on the shared base, so no variant can opt out of it.
  const base = btn.slice(btn.indexOf('const base ='), btn.indexOf('const variants'));
  assert.match(base, /min-h-11/);
});

// ---------------------------------------------------------------------------
// 4. WHAT THE RECONCILIATION WAS NOT ALLOWED TO TOUCH
// ---------------------------------------------------------------------------
test('the editorial identity survived: ivory ground, Cinzel display, Oswald register', () => {
  const c = css();
  assert.match(c, /--font-display: var\(--font-cinzel\), serif;/);
  assert.match(c, /--font-head: var\(--font-oswald\), sans-serif;/);
  assert.match(c, /--font-sans: var\(--font-inter\), -apple-system, sans-serif;/);
  assert.match(c, /body \{\s*background: var\(--vv-bg\);/);
  // The CTA register is the website's own — uppercase, tracked, Oswald — and
  // is deliberately NOT the app's sentence-case Inter control label.
  const btn = code(read('src/components/ui/CtaButton.tsx'));
  assert.match(btn, /font-head text-\[13px\] font-semibold uppercase tracking-\[0\.14em\]/);
});

test('the website did not become an application interface', () => {
  // Card separation is kept where it helps scanning; the app's "collapse every
  // container fill to the page colour" rule was deliberately NOT applied
  // wholesale. Pricing is the obvious case: it is a single card an athlete
  // scans against a decision, and flattening it removed the thing that made it
  // scannable. If this ever becomes false, it should be a decision, not a
  // side effect of a token sweep.
  assert.match(code(read('src/components/sections/PricingCard.tsx')), /bg-vv-bg-2/,
    'the pricing card keeps its raised surface');
  // No app chrome crept in with the palette.
  for (const f of srcFiles()) {
    const src = code(read(f));
    assert.ok(!/\bbtn-primary\b|\bbtn-ghost\b|\bmodal-card\b/.test(src),
      `${f} imported an app class name — the token layer is shared, the interface is not`);
  }
});
