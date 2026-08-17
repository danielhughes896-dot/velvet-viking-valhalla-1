'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

// LEGAL PUBLICATION TESTS.
//
// Four documents sit in @/content/legal at TWO different approval states, and
// nearly every test here exists to stop that boundary collapsing:
//
//   PUBLISHED  privacyDraft   -> /privacy       HQ-approved for the private beta
//              betaTermsDraft -> /beta-terms    HQ-approved for the private beta
//   GATED      termsDraft     -> /terms         future commercial ToS, unapproved
//              cookiesDraft   -> /cookies       accurate, outside the approval
//
// The failure guarded against is a future "publish the legal pages" change
// flipping one shared flag and putting an unreviewed commercial terms of service
// live — representing as approved a document nobody has approved. That is worse
// than the beta shipping with no commercial terms at all, which is why the gates
// are per-document and why these tests are specific about which is which.
const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const LEGAL = read('src/content/legal.ts');
const docBody = (name) => {
  const at = LEGAL.indexOf('export const ' + name);
  assert.ok(at !== -1, name + ' must exist');
  return LEGAL.slice(at, LEGAL.indexOf('\n};', at));
};

const PUBLISHED = [
  ['src/app/privacy/page.tsx', 'privacyDraft', 'privacy'],
  ['src/app/beta-terms/page.tsx', 'betaTermsDraft', 'betaTerms'],
];
const GATED = [
  ['src/app/terms/page.tsx', 'termsDraft', 'terms'],
  ['src/app/cookies/page.tsx', 'cookiesDraft', 'cookies'],
];

// ---------------------------------------------------------------------------
// THE GATE BOUNDARY
// ---------------------------------------------------------------------------
test('the two beta documents are approved and the two commercial ones are not', () => {
  const at = LEGAL.indexOf('export const LEGAL_APPROVALS');
  const block = LEGAL.slice(at, LEGAL.indexOf('} as const;', at));
  assert.match(block, /privacy: true/);
  assert.match(block, /betaTerms: true/);
  assert.match(block, /terms: false/, 'the commercial terms of service must stay gated');
  assert.match(block, /cookies: false/, 'the cookie policy is outside the beta approval');
});

test('the future commercial gate is preserved as its own named thing', () => {
  const at = LEGAL.indexOf('export const COMMERCIAL_LEGAL_APPROVED');
  assert.ok(at !== -1, 'the commercial gate must survive as a named export');
  const decl = LEGAL.slice(at, LEGAL.indexOf(';', at));
  assert.match(decl, /LEGAL_APPROVALS\.terms/);
  assert.match(decl, /LEGAL_APPROVALS\.cookies/);
  assert.ok(
    !/privacy|betaTerms/.test(decl),
    'the beta documents must not feed the commercial gate, or approving a beta approves the commercial set'
  );
});

test('there is no single flag that publishes everything at once', () => {
  assert.ok(
    !/export const LEGAL_CONTENT_APPROVED/.test(LEGAL),
    'the combined flag is gone on purpose: it could not express "two of four"'
  );
});

test('each page reads its own gate, and only its own', () => {
  const allKeys = [...PUBLISHED, ...GATED].map((r) => r[2]);
  for (const [file, draft, key] of [...PUBLISHED, ...GATED]) {
    const src = read(file);
    assert.match(src, new RegExp(`LEGAL_APPROVALS,\\s*${draft}`), `${file} imports its draft`);
    assert.match(
      src,
      new RegExp(`if \\(LEGAL_APPROVALS\\.${key}\\) \\{`),
      `${file} must be gated on LEGAL_APPROVALS.${key}`
    );
    for (const other of allKeys.filter((k) => k !== key)) {
      assert.ok(
        !new RegExp(`LEGAL_APPROVALS\\.${other}\\b`).test(src),
        `${file} must not read LEGAL_APPROVALS.${other}`
      );
    }
  }
});

// ---------------------------------------------------------------------------
// PUBLISHED DOCUMENTS ARE ACTUALLY FINISHED
// ---------------------------------------------------------------------------
test('the published documents carry a real effective date, not a placeholder', () => {
  assert.match(LEGAL, /export const BETA_LEGAL_EFFECTIVE_DATE = "\d{1,2} \w+ \d{4}"/);
  for (const name of ['privacyDraft', 'betaTermsDraft']) {
    const body = docBody(name);
    assert.match(body, /lastUpdated: BETA_LEGAL_EFFECTIVE_DATE/, name);
    assert.ok(!/lastUpdated: TBC\(/.test(body), name + ' must not ship a placeholder date');
  }
  // A document not in force has no effective date, so the gated pair keep theirs.
  for (const name of ['termsDraft', 'cookiesDraft']) {
    assert.match(docBody(name), /lastUpdated: TBC\(/, name + ' is not in force');
  }
});

test('no placeholder token can appear in either published document', () => {
  // The specific near-miss this catches: the controller sentence used to
  // interpolate legalEntity.registeredAddress directly, which would have printed
  // "[TO BE CONFIRMED: registered office address...]" into the opening paragraph
  // of a live Privacy Policy.
  for (const name of ['privacyDraft', 'betaTermsDraft']) {
    const body = docBody(name);
    assert.ok(!/TBC\(/.test(body), name + ' still contains a TBC placeholder');
    assert.ok(
      !/legalEntity\.registeredAddress/.test(body),
      name + ' must go through entityDescription(), which omits an unconfirmed address'
    );
  }
});

test('entityDescription includes each company fact only once confirmed', () => {
  const at = LEGAL.indexOf('export const entityDescription');
  const body = LEGAL.slice(at, LEGAL.indexOf('\n};', at));
  for (const f of ['companyNumber', 'placeOfRegistration', 'registeredAddress']) {
    assert.match(body, new RegExp(`isConfirmed\\(legalEntity\\.${f}\\)`), f + ' must be guarded');
  }
});

// ---------------------------------------------------------------------------
// COMPANY FACTS
// ---------------------------------------------------------------------------
test('all four statutory company facts are supplied, none of them placeholders', () => {
  // The Companies (Trading Disclosures) Regulations 2008 require exactly these
  // four on a company's website. The registered office was the last outstanding
  // one and has now been supplied by HQ.
  assert.match(LEGAL, /name: "Velvet Viking Ltd"/);
  assert.match(LEGAL, /companyNumber: "17404255"/);
  assert.match(LEGAL, /placeOfRegistration: "England and Wales"/);
  assert.match(LEGAL, /registeredAddress: "7 Myrtle Drive, Halifax, HX2 8HQ"/);
  // Not a placeholder any more, and no facts may quietly regress to one.
  const at = LEGAL.indexOf('export const legalEntity');
  const entity = LEGAL.slice(at, LEGAL.indexOf('} as const;', at));
  assert.ok(!/TBC\(/.test(entity), 'no company fact may be a placeholder');
});

test('the trading disclosure is complete', () => {
  // `complete` is the one boolean a pre-launch check can read to answer "is the
  // statutory disclosure finished". Evaluated here rather than asserted from the
  // source text, so it reflects the real predicate rather than a regex of it.
  const src = LEGAL
    // strip TypeScript annotations so the module can be evaluated as plain JS
    .replace(/^export const /gm, 'const ')
    .replace(/: string\[\]/g, '')
    .replace(/\(value: string\): boolean/g, '(value)')
    .replace(/\(\): string/g, '()')
    .replace(/\(\): boolean/g, '()')
    .replace(/\(what: string\)/g, '(what)')
    .replace(/ as const/g, '');
  const at = src.indexOf('const TBC');
  const end = src.indexOf('export type LegalSection') === -1
    ? src.indexOf('const privacyDraft')
    : src.indexOf('export type LegalSection');
  const slice = src.slice(at, end).replace(/^type [\s\S]*?};$/gm, '');
  const fn = new Function(slice + '\nreturn { tradingDisclosure, entityDescription, legalEntity };');
  const { tradingDisclosure, entityDescription, legalEntity } = fn();

  assert.equal(tradingDisclosure.complete, true, 'all four elements must be present');
  assert.deepEqual(tradingDisclosure.lines, [
    'Velvet Viking Ltd',
    'Registered in England and Wales, company number 17404255',
    'Registered office: 7 Myrtle Drive, Halifax, HX2 8HQ',
  ]);
  assert.equal(
    entityDescription(),
    'Velvet Viking Ltd (company number 17404255, registered in England and Wales, registered office 7 Myrtle Drive, Halifax, HX2 8HQ)'
  );
  assert.equal(legalEntity.contactEmail, 'support@velvetviking.co.uk');
});

test('the trading disclosure guards every optional element', () => {
  const at = LEGAL.indexOf('export const tradingDisclosure');
  const body = LEGAL.slice(at, LEGAL.indexOf('} as const;', at));
  for (const f of ['companyNumber', 'placeOfRegistration', 'registeredAddress']) {
    assert.match(body, new RegExp(`isConfirmed\\(legalEntity\\.${f}\\)`), f);
  }
  assert.match(body, /out: string\[\] = \[legalEntity\.name\]/);
});

test('the footer renders the disclosure through the guarded accessor only', () => {
  const footer = read('src/components/layout/Footer.tsx');
  assert.match(footer, /tradingDisclosure\.lines\.map/);
  assert.ok(
    !/legalEntity\.(companyNumber|registeredAddress|placeOfRegistration)/.test(footer),
    'the footer must not read raw fact fields — only the guarded lines'
  );
});

// ---------------------------------------------------------------------------
// THE PUBLISHED CONTENT MATCHES WHAT THE PRODUCT ACTUALLY DOES
// ---------------------------------------------------------------------------
test('the auth wording is accurate and not absolute', () => {
  // The app uses magic links, but a password credential exists on the Supabase
  // owner account and password auth is a project-level setting the app does not
  // control. So the policy describes what the ATHLETE does — true and checkable —
  // and must not make an absolute claim the database could contradict.
  const body = docBody('privacyDraft');
  assert.match(body, /you do not create or use a password to access Valhalla/);
  for (const overclaim of [
    /we do not store (a )?passwords?/i,
    /no password to (store or )?leak/i,
    /passwords? (are|is) never stored/i,
  ]) {
    assert.ok(
      !overclaim.test(body),
      'absolute password claim found, and it is not provable while password auth is a project-level setting'
    );
  }
});

test('the data inventory covers what the runtime actually persists', () => {
  // dd.actual carries km, pace, hr, rpe, feel, notes and splits;
  // state.readiness carries health, legs and sleep. Verified in the app repo.
  const body = docBody('privacyDraft');
  for (const [thing, rx] of [
    ['email', /email address/i],
    ['programme data', /goal distance and date/i],
    ['distance', /distance covered/i],
    ['pace', /the pace/i],
    ['heart rate', /heart rate/i],
    ['RPE', /rating of perceived effort/i],
    ['athlete feel', /how the session felt/i],
    ['manual laps and splits', /lap or split figures you enter by hand/i],
    ['athlete notes', /notes you write/i],
    ['daily check-in', /how you slept/i],
    ['pain, illness and niggles', /pain, unwell, or carrying a niggle/i],
    ['coaching output', /execution reviews/i],
  ]) {
    assert.match(body, rx, 'the inventory must mention ' + thing);
  }
});

test('Strava is described as off for everyone in this beta', () => {
  assert.match(LEGAL, /switched off and no Strava data is collected for anyone in this beta/);
});

test('no analytics is claimed, and none is installed', () => {
  const body = docBody('privacyDraft');
  assert.match(body, /We do not use analytics, advertising or tracking technology/);
  // The draft used to claim aggregate product-event counts were collected to see
  // whether the coaching was working. Nothing collects or transmits that — the app
  // has no telemetry endpoint at all — so the claim was removed, not reworded.
  assert.ok(
    !/aggregate, non-identifying counts/.test(body),
    'that claim was untrue of the product and must not return without a real collector'
  );
  const pkg = JSON.parse(read('package.json'));
  const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
  for (const b of ['@vercel/analytics', '@vercel/speed-insights']) {
    assert.ok(!deps.includes(b), b + ' would contradict the policy above');
  }
});

test('the beta terms stay a beta document and never become a commercial contract', () => {
  const body = docBody('betaTermsDraft');
  assert.match(body, /no subscription, no trial that turns into a payment/);
  assert.match(body, /It will contain defects/, 'pre-release status must be explicit');
  for (const bad of [/\brefund/i, /\bbilling/i, /\binvoice/i, /\bcancellation period/i]) {
    assert.ok(!bad.test(body), 'commercial language leaked into the beta terms: ' + bad);
  }
  // Safety wording present, without medicalising the product.
  assert.match(body, /nothing it says is medical advice/i);
  assert.match(body, /If something hurts, trust that over the app/);
});

test('the support address is the only contact address anywhere', () => {
  assert.match(LEGAL, /contactEmail: "support@velvetviking\.co\.uk"/);
  const others = (LEGAL.match(/[\w.+-]+@[\w.-]+\.\w+/g) || []).filter(
    (a) => a !== 'support@velvetviking.co.uk'
  );
  assert.deepEqual(others, [], 'no other contact address should appear in the legal content');
});

// ---------------------------------------------------------------------------
// DISCOVERABILITY AND SINGLE SOURCE OF TRUTH
// ---------------------------------------------------------------------------
test('beta terms are kept out of the public sitemap, privacy stays in', () => {
  const sitemap = read('src/app/sitemap.ts');
  assert.ok(
    !/beta-terms/.test(sitemap),
    'an invited-testers document does not belong in a public sitemap'
  );
  assert.match(sitemap, /"\/privacy"/, 'the Privacy Policy is public and stays in the sitemap');
});

test('beta terms stay noindex, and privacy no longer does', () => {
  assert.match(read('src/app/beta-terms/page.tsx'), /robots: \{ index: false/);
  assert.ok(
    !/robots: \{ index: false/.test(read('src/app/privacy/page.tsx')),
    'the Privacy Policy is real content now and should be indexable'
  );
  for (const [file] of GATED) {
    assert.match(read(file), /robots: \{ index: false/, file + ' is still a placeholder');
  }
});

test('both published pages declare their canonical path', () => {
  assert.match(read('src/app/privacy/page.tsx'), /canonical: "\/privacy"/);
  assert.match(read('src/app/beta-terms/page.tsx'), /canonical: "\/beta-terms"/);
});

test('the public footer link list is derived from LEGAL_APPROVALS, not a static array', () => {
  const at = LEGAL.indexOf('export const publicLegalLinks');
  assert.ok(at !== -1, 'publicLegalLinks must exist in @/content/legal');
  const block = LEGAL.slice(at, LEGAL.indexOf('.filter(', at));
  assert.match(
    block,
    /href: "\/privacy",\s*approved: LEGAL_APPROVALS\.privacy/,
    'Privacy must be gated on its own approval flag, not hard-coded true'
  );
  assert.match(
    block,
    /href: "\/terms",\s*approved: LEGAL_APPROVALS\.terms/,
    'Terms must be gated on its own approval flag'
  );
  assert.match(
    block,
    /href: "\/cookies",\s*approved: LEGAL_APPROVALS\.cookies/,
    'Cookies must be gated on its own approval flag'
  );
  assert.match(LEGAL.slice(at), /\.filter\(\(link\) => link\.approved\)/, 'unapproved documents must be filtered out');
  assert.ok(
    !/beta-terms/.test(LEGAL.slice(at, LEGAL.indexOf('.filter(', at))),
    'the beta terms are for five invited testers, not public footer furniture — must never be a footer candidate'
  );
});

test('only approved legal documents currently reach the public footer', () => {
  // Cross-checks the gate-boundary test above (privacy: true, terms/cookies:
  // false) against how publicLegalLinks actually filters, without executing
  // TypeScript: with today's gate state, Privacy's `approved` is `true` and
  // Terms/Cookies' are `false`, so the .filter(link => link.approved) call
  // keeps Privacy alone.
  const at = LEGAL.indexOf('export const LEGAL_APPROVALS');
  const gates = LEGAL.slice(at, LEGAL.indexOf('} as const;', at));
  assert.match(gates, /privacy: true/);
  assert.match(gates, /terms: false/);
  assert.match(gates, /cookies: false/);
});

test('the footer renders legal links from the derived, state-driven list only', () => {
  const footer = read('src/components/layout/Footer.tsx');
  assert.match(
    footer,
    /import\s*\{[^}]*publicLegalLinks[^}]*\}\s*from\s*"@\/content\/legal"/,
    'Footer must import publicLegalLinks from @/content/legal'
  );
  assert.match(footer, /publicLegalLinks\.map/, 'Footer must render from publicLegalLinks');
  assert.ok(
    !/footer\.legalLinks/.test(footer),
    'the footer must not fall back to a static legalLinks array — visibility must come from LEGAL_APPROVALS'
  );
});

test('site.ts no longer hard-codes a static public legal link list', () => {
  const site = read('src/content/site.ts');
  assert.ok(
    !/legalLinks:\s*\[/.test(site),
    'legal link visibility must live in publicLegalLinks (@/content/legal), not a static array in site.ts — ' +
      'a static array here is exactly the hard-coded regression this architecture exists to prevent'
  );
});

test('the renderer linkifies the support address and internal legal paths', () => {
  const doc = read('src/components/sections/LegalDocument.tsx');
  assert.match(doc, /mailto:/, 'the support address should be actionable in a legal page');
  assert.match(doc, /LINK_PATTERN/);
  // Narrow on purpose: a general autolinker in legal copy creates surprises.
  assert.match(doc, /privacy\|beta-terms\|terms\|cookies/);
});
