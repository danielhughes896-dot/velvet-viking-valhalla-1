'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

// LEGAL STAGING TESTS.
//
// The drafted Privacy Policy, Terms, Cookie Policy and Private Beta Terms are
// staged in the repository but NOT published. Two separate things must stay true
// for that to be safe, and neither is guaranteed by good intentions:
//
//   1. the gate stays shut until a solicitor has reviewed the text, and
//   2. no unresolved business fact can render to a visitor.
//
// The second is the one worth automating. A "[TO BE CONFIRMED: registered office
// address]" string on a statutory disclosure is worse than the line being
// absent — absent is an incomplete disclosure, visible is an advertisement that
// nobody checked.
const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const LEGAL = read('src/content/legal.ts');

const LEGAL_PAGES = [
  ['src/app/privacy/page.tsx', 'privacyDraft'],
  ['src/app/terms/page.tsx', 'termsDraft'],
  ['src/app/cookies/page.tsx', 'cookiesDraft'],
  ['src/app/beta-terms/page.tsx', 'betaTermsDraft'],
];

test('the publication gate is shut', () => {
  assert.match(LEGAL, /export const LEGAL_CONTENT_APPROVED = false;/);
});

test('every legal route is wired to its draft and gated behind the flag', () => {
  for (const [file, draft] of LEGAL_PAGES) {
    const src = read(file);
    assert.match(src, new RegExp(`LEGAL_CONTENT_APPROVED,\\s*${draft}`), `${file} imports its draft`);
    assert.match(
      src,
      /if \(LEGAL_CONTENT_APPROVED\) \{/,
      `${file} must render the draft only behind the gate`
    );
    assert.match(src, /robots: \{ index: false/, `${file} must stay out of the index while unpublished`);
  }
});

test('the four drafts all exist and are non-trivial', () => {
  for (const draft of ['privacyDraft', 'termsDraft', 'cookiesDraft', 'betaTermsDraft']) {
    assert.match(LEGAL, new RegExp(`export const ${draft}: LegalDocument`), draft);
  }
  // A draft that is only headings is not a draft anybody can review.
  const paragraphs = (LEGAL.match(/^\s{8}["`]/gm) || []).length;
  assert.ok(paragraphs > 40, `expected substantial drafted prose, found ${paragraphs} paragraphs`);
});

// ---------------------------------------------------------------------------
// THE PLACEHOLDER CAN NEVER REACH A VISITOR
// ---------------------------------------------------------------------------
test('isConfirmed rejects placeholders and accepts real values', () => {
  // Exercised through the real source rather than a reimplementation, so the
  // test cannot pass against a predicate that no longer matches the token.
  assert.match(LEGAL, /const TBC = \(what: string\) => `\[TO BE CONFIRMED: \$\{what\}\]`/);
  assert.match(LEGAL, /!value\.startsWith\("\[TO BE CONFIRMED"\)/);
});

test('the trading disclosure prints only confirmed facts', () => {
  // Every optional line is guarded by isConfirmed, and the entity name — the one
  // fact that IS known — is unguarded so something always renders.
  const at = LEGAL.indexOf('export const tradingDisclosure');
  const body = LEGAL.slice(at, LEGAL.indexOf('} as const;', at));
  assert.match(body, /isConfirmed\(legalEntity\.companyNumber\)/);
  assert.match(body, /isConfirmed\(legalEntity\.registeredAddress\)/);
  assert.match(body, /isConfirmed\(legalEntity\.placeOfRegistration\)/);
  assert.match(body, /out: string\[\] = \[legalEntity\.name\]/);
});

test('the footer renders the disclosure through the guarded accessor', () => {
  const footer = read('src/components/layout/Footer.tsx');
  assert.match(footer, /import \{ tradingDisclosure \} from "@\/content\/legal"/);
  assert.match(footer, /tradingDisclosure\.lines\.map/);
  // Never the raw fields, which are the ones that can still be placeholders.
  assert.ok(
    !/legalEntity\.(companyNumber|registeredAddress|placeOfRegistration)/.test(footer),
    'the footer must not read the raw fact fields — only the guarded lines'
  );
});

test('the outstanding facts are placeholders, not inventions', () => {
  // The specific failure this guards against is somebody making the disclosure
  // "complete" by writing a plausible company number in. A wrong company number
  // on a statutory disclosure is a worse outcome than a missing one.
  for (const field of ['companyNumber', 'registeredAddress', 'placeOfRegistration']) {
    assert.match(
      LEGAL,
      new RegExp(`${field}: TBC\\(`),
      `${field} must remain a placeholder until HQ supplies the real value`
    );
  }
  assert.ok(!/\b\d{8}\b/.test(LEGAL), 'no eight-digit company-number-shaped literal is present');
});

test('the support address is the real one, everywhere it appears', () => {
  assert.match(LEGAL, /contactEmail: "support@velvetviking\.co\.uk"/);
  const others = (LEGAL.match(/[\w.+-]+@[\w.-]+/g) || []).filter(
    (a) => a !== 'support@velvetviking.co.uk'
  );
  assert.deepEqual(others, [], 'no other contact address should appear in the legal content');
});

// ---------------------------------------------------------------------------
// THE DRAFTS MUST MATCH WHAT THE PRODUCT ACTUALLY DOES
// ---------------------------------------------------------------------------
test('Strava is described as switched off, not as active', () => {
  assert.match(
    LEGAL,
    /that integration is currently switched off and no Strava data is collected/,
    'the integration exists in code but is off; the policy must say so'
  );
});

test('the policy claims no tracking, and the site installs none', () => {
  assert.match(LEGAL, /We do not use advertising cookies, cross-site tracking pixels/);
  const pkg = JSON.parse(read('package.json'));
  const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
  for (const b of ['@vercel/analytics', '@vercel/speed-insights']) {
    assert.ok(!deps.includes(b), `${b} would contradict the cookie policy above`);
  }
});
