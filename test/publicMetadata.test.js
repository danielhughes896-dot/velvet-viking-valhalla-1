'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

// PUBLIC METADATA REGRESSION TESTS.
//
// The site shipped for months with its canonical URL, its Open Graph URL and
// every sitemap entry pointing at velvet-viking-website-preview.vercel.app. It
// was not a subtle bug and nothing caught it, because nothing was looking: the
// origin was a string literal duplicated across two files, and a literal that
// nobody imports is a literal nobody notices.
//
// These tests exist so that specific failure cannot happen twice. They are
// deliberately source-level rather than build-level: they need no Next build, no
// server and no network, so they run anywhere and cannot be skipped for being
// slow or flaky.
const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

// Comments in these files legitimately NAME the stale hosts, because explaining
// which host was wrong and why is the thing that stops it being reintroduced.
// Assertions about shipped behaviour therefore run against code with comments
// stripped; prose about the bug is not the bug.
const code = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

// The Valhalla app is a separate deployment and its URL is genuine. It is named
// explicitly so the blanket vercel.app ban below cannot break the route into the
// product while still catching every other Vercel host.
const VALHALLA_APP_HOST = 'velvet-viking-valhalla-1.vercel.app';

const PRODUCTION_ORIGIN = 'https://velvetviking.co.uk';

// Files whose contents reach a search engine, a social crawler or a browser's
// address bar. A stale host in any of these is a public-facing defect.
const PUBLIC_METADATA_FILES = [
  'src/content/site.ts',
  'src/app/layout.tsx',
  'src/app/sitemap.ts',
  'src/app/robots.ts',
];

test('the production origin is declared exactly once', () => {
  const site = read('src/content/site.ts');
  const declarations = site.match(/export const siteUrl\s*=/g) || [];
  assert.equal(declarations.length, 1, 'one source of truth, not two');
  assert.ok(
    site.includes(`export const siteUrl = "${PRODUCTION_ORIGIN}"`),
    'siteUrl must be the production origin'
  );
});

test('no preview or vercel.app host appears in any public metadata file', () => {
  for (const file of PUBLIC_METADATA_FILES) {
    const src = code(read(file));
    assert.ok(
      !/velvet-viking-website-preview/.test(src),
      `${file} still references the preview deployment`
    );
    // Every Vercel host except the real Valhalla app deployment.
    const strays = (src.match(/[a-z0-9-]+\.vercel\.app/g) || []).filter(
      (h) => h !== VALHALLA_APP_HOST
    );
    assert.deepEqual(
      strays,
      [],
      `${file} hardcodes a vercel.app host — public URLs use ${PRODUCTION_ORIGIN}`
    );
  }
});

test('layout and sitemap import the origin rather than restating it', () => {
  for (const file of ['src/app/layout.tsx', 'src/app/sitemap.ts']) {
    const src = read(file);
    assert.match(
      src,
      /import\s*\{[^}]*siteUrl[^}]*\}\s*from\s*"@\/content\/site"/,
      `${file} must import siteUrl`
    );
    assert.ok(
      !/const siteUrl\s*=/.test(src),
      `${file} must not declare its own siteUrl — that duplication is the original bug`
    );
  }
});

test('metadataBase and the Open Graph URL both resolve to the production origin', () => {
  const layout = read('src/app/layout.tsx');
  assert.match(layout, /metadataBase:\s*new URL\(siteUrl\)/);
  assert.match(layout, /url:\s*siteUrl/, 'og:url must use the shared origin');
});

test('robots declares the sitemap and host against the production origin', () => {
  const robots = code(read('src/app/robots.ts'));
  assert.match(robots, /sitemap:\s*`\$\{siteUrl\}\/sitemap\.xml`/);
  assert.match(robots, /host:\s*siteUrl/);
  assert.ok(
    !/velvetviking\.com(?!\.)/.test(robots),
    'the stale .com reference must not return in shipped code; the domain is .co.uk'
  );
});

test('the app link that must stay Vercel-specific is untouched', () => {
  // Not every vercel.app URL is a mistake. Valhalla is a separate deployment and
  // the CTA into it is a genuine deployment URL. This test is here so a future
  // sweep for "vercel.app" does not helpfully break the route into the product.
  const site = read('src/content/site.ts');
  assert.ok(
    site.includes('velvet-viking-valhalla-1.vercel.app/get'),
    'the Valhalla app CTA is a real deployment URL and must not be rewritten to the marketing domain'
  );
});

// ---------------------------------------------------------------------------
// NO TRACKING, AND NO COOKIE BANNER BY ACCIDENT
// ---------------------------------------------------------------------------
// The cookie-banner position rests on a factual claim: this site sets no
// non-essential storage. That claim is only safe while it stays true, and the
// cheapest way for it to stop being true is somebody adding an analytics
// package without realising it changes the site's legal position.
test('no analytics, tracking or advertising dependency is installed', () => {
  const pkg = JSON.parse(read('package.json'));
  const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
  const banned = [
    '@vercel/analytics',
    '@vercel/speed-insights',
    'react-ga',
    'react-ga4',
    'posthog-js',
    'mixpanel-browser',
    'plausible-tracker',
    '@segment/analytics-next',
    'react-facebook-pixel',
  ];
  for (const b of banned) {
    assert.ok(
      !deps.includes(b),
      `${b} collects visitor data. Adding it changes this site's cookie/consent ` +
        `position under PECR and UK GDPR — update the cookie policy and take a ` +
        `consent decision before this test is changed.`
    );
  }
});

test('no tracking script or embed is present in any component or page', () => {
  const files = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(rel);
      else if (/\.(ts|tsx)$/.test(entry.name)) files.push(rel);
    }
  })('src');

  const banned = [
    /googletagmanager\.com/,
    /google-analytics\.com/,
    /\bgtag\s*\(/,
    /connect\.facebook\.net/,
    /\bfbq\s*\(/,
    /plausible\.io/,
    /\bhotjar\b/i,
    /clarity\.ms/,
    /<Analytics\b/,
    /<SpeedInsights\b/,
    /<iframe\b/i,
  ];
  for (const file of files) {
    const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
    // Comments are prose about the codebase, not shipped behaviour.
    const code = src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
    for (const rx of banned) {
      assert.ok(!rx.test(code), `${file} introduces ${rx} — see the note in the test above`);
    }
  }
  assert.ok(files.length > 20, 'sanity: the walk actually found the source tree');
});

// The legal staging assertions live in legalStaging.test.js, which travels with
// the legal content itself — this file must stay runnable without it.
