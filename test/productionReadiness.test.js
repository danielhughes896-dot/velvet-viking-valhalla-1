const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const code = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

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

// ---------------------------------------------------------------------------
// 1. APP HANDOFF — ONE CANONICAL ENTRY, NO SECOND FRONT DOOR
// ---------------------------------------------------------------------------
test('the canonical app entry is declared once and is the .co.uk subdomain', () => {
  const site = code(read('src/content/site.ts'));
  assert.match(site, /export const appUrl = "https:\/\/app\.velvetviking\.co\.uk\/start"/);
  // One copy, for the same reason siteUrl is one copy.
  const declarations = (site.match(/= "https:\/\/app\.velvetviking\.co\.uk/g) || []).length;
  assert.equal(declarations, 1, 'a second copy of the app origin is how the first goes stale');
});

test('no customer-facing CTA renders as permanently disabled', () => {
  const start = code(read('src/app/start/page.tsx'));
  assert.ok(!/commerceSeams\.(createAccount|signIn)/.test(start),
    'the account CTAs must hand off to the app, not render as dead null-href buttons');
  assert.match(start, /href=\{appUrl\}/);
  assert.match(start, /Start Free Trial/);
});

test('the website does not duplicate account creation or the plan builder', () => {
  for (const f of srcFiles()) {
    const src = code(read(f));
    assert.ok(!/<input[^>]*type="(password|email)"/.test(src),
      `${f} collects credentials — the app owns the account, not the website`);
    assert.ok(!/signUp|createAccount\(|signInWithPassword/.test(src),
      `${f} implements auth — the app owns it`);
  }
});

// ---------------------------------------------------------------------------
// 2. CLAIMS ARE GATED ON WHAT THE APP ACTUALLY SHIPS
// ---------------------------------------------------------------------------
test('year-round coaching stays unpublished until the app ships it', () => {
  const claims = code(read('src/content/productClaims.ts'));
  assert.match(claims, /yearRoundCoaching:\s*false/,
    'the feature is on an unmerged app branch; claiming it would be unsubstantiated');
  assert.match(claims, /garminIntegration:\s*false/,
    'Garmin is behind VVV_GARMIN_ENABLED in the app and its application is incomplete');
  assert.match(claims, /adaptiveCoaching:\s*true/);
  assert.match(claims, /stravaIntegration:\s*true/);
});

test('the year-round section gates itself rather than trusting its caller', () => {
  const yr = code(read('src/components/sections/YearRound.tsx'));
  assert.match(yr, /if \(!PRODUCT_CLAIMS\.yearRoundCoaching\) return null;/,
    'mounting it from a new page must not be able to publish the claim');
  // Mounted, so switching the claim on is a one-line change.
  assert.match(code(read('src/app/page.tsx')), /<YearRound \/>/);
});

test('no unsubstantiated year-round or Garmin claim leaks into ungated copy', () => {
  // The gated strings live in site.ts's `yearRound` block and in the component.
  // Nothing else on the site may assert them.
  const site = read('src/content/site.ts');
  const gatedStart = site.indexOf('export const yearRound');
  const gatedEnd = site.indexOf('export const futureWorld');
  const ungated = code(site.slice(0, gatedStart) + site.slice(gatedEnd));
  for (const rx of [/year-round/i, /after race day/i, /off-season/i, /Maintain & Protect/i, /\bgarmin\b/i]) {
    assert.ok(!rx.test(ungated), `ungated copy asserts ${rx}, which the shipped app does not do`);
  }
});

// ---------------------------------------------------------------------------
// 3. SUPPORT — A STABLE PUBLIC URL FOR STORES, GARMIN AND STRIPE
// ---------------------------------------------------------------------------
test('/support exists, is reachable from the footer and is in the sitemap', () => {
  assert.ok(fs.existsSync(path.join(ROOT, 'src/app/support/page.tsx')));
  const page = code(read('src/app/support/page.tsx'));
  assert.match(page, /alternates:\s*\{\s*canonical:\s*"\/support"\s*\}/);
  assert.match(code(read('src/components/layout/Footer.tsx')), /href="\/support"/);
  assert.match(read('src/app/sitemap.ts'), /"\/support"/);
});

test('the support address comes from the legal entity, not a second hard-coded copy', () => {
  const page = code(read('src/app/support/page.tsx'));
  assert.match(page, /legalEntity\.contactEmail/);
  assert.ok(!/@velvetviking\.co\.uk/.test(page),
    'two addresses for one company is how an athlete gets sent to the wrong one');
  // Guarded, so a placeholder can never reach the public.
  assert.match(page, /isConfirmed\(email\)/);
});

test('the statutory company details are real, not placeholders', () => {
  const legal = code(read('src/content/legal.ts'));
  assert.match(legal, /name: "Velvet Viking Ltd"/);
  assert.match(legal, /companyNumber: "17404255"/);
  assert.match(legal, /placeOfRegistration: "England and Wales"/);
  assert.ok(!/registeredAddress: "\[TO BE CONFIRMED/.test(legal));
});

// ---------------------------------------------------------------------------
// 4. NOTHING COMMERCIAL SWITCHED ON, AND THE BETA DOOR IS INTACT
// ---------------------------------------------------------------------------
test('commerce remains fail-closed and no payment code exists on the website', () => {
  const commerce = code(read('src/content/commerce.ts'));
  assert.match(commerce, /live:\s*false/);
  for (const f of srcFiles()) {
    const src = code(read(f));
    for (const rx of [/\bstripe\b/i, /sk_(live|test)_/, /price_[A-Za-z0-9]{6,}/, /entitlement/i]) {
      assert.ok(!rx.test(src), `${f} introduces ${rx}`);
    }
  }
});

test('the private beta door is unchanged and separate from the public CTA', () => {
  const site = code(read('src/content/site.ts'));
  assert.match(site, /velvet-viking-valhalla-1\.vercel\.app\/get/, 'the beta URL must not be retired here');
  const start = code(read('src/app/start/page.tsx'));
  assert.match(start, /betaAccess\.cta\.href/);
});

// ---------------------------------------------------------------------------
// 5. PRODUCTION URL HYGIENE
// ---------------------------------------------------------------------------
test('customer-facing origins are velvetviking.co.uk, with no vercel.app leakage', () => {
  assert.match(code(read('src/content/site.ts')), /siteUrl = "https:\/\/velvetviking\.co\.uk"/);
  for (const f of ['src/app/sitemap.ts', 'src/app/robots.ts', 'src/app/layout.tsx']) {
    assert.ok(!/vercel\.app/.test(code(read(f))), `${f} must not reference a vercel.app host`);
  }
});

test('every page declares its own canonical', () => {
  const pages = srcFiles().filter((f) => /src\/app\/.*page\.tsx$/.test(f));
  for (const f of pages) {
    const src = read(f);
    if (!/export const metadata/.test(src)) continue;
    assert.match(src, /alternates:\s*\{\s*canonical:/, `${f} has metadata but no canonical`);
  }
});
