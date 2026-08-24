'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

// LEGAL PUBLICATION TESTS.
//
// Five documents sit in @/content/legal at two approval states, and nearly
// every test here exists to stop that boundary collapsing:
//
//   PUBLISHED  termsDraft             -> /terms    commercial, 24 Aug 2026
//              privacyCommercialDraft -> /privacy  commercial, 24 Aug 2026
//              betaTermsDraft         -> /beta-terms   private beta
//              privacyDraft           -> superseded at /privacy, kept as record
//   GATED      cookiesDraft           -> /cookies  accurate, approved by nobody
//
// The failure guarded against has not changed, only which document it would
// hit. It was a "publish the legal pages" change flipping one shared flag and
// taking an unreviewed commercial contract live with the beta set. The
// commercial set has since been reviewed in full and published on the
// founder's approval; the cookie policy has not, is just as finished, and is
// exactly the document a careless "publish everything" would sweep along. Its
// gate is why these tests stay specific about which document is which.
const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const LEGAL = read('src/content/legal.ts');
const docBody = (name) => {
  const at = LEGAL.indexOf('export const ' + name);
  assert.ok(at !== -1, name + ' must exist');
  return LEGAL.slice(at, LEGAL.indexOf('\n};', at));
};

// Grouped by what the route actually serves today. /terms moved across on
// 24 August 2026; /cookies is what "gated" now means, on its own.
const PUBLISHED = [
  ['src/app/privacy/page.tsx', 'privacyDraft', 'privacy'],
  ['src/app/beta-terms/page.tsx', 'betaTermsDraft', 'betaTerms'],
  ['src/app/terms/page.tsx', 'termsDraft', 'terms'],
];
const GATED = [
  ['src/app/cookies/page.tsx', 'cookiesDraft', 'cookies'],
];

// ---------------------------------------------------------------------------
// THE GATE BOUNDARY
// ---------------------------------------------------------------------------
test('the commercial set is approved, and the cookie policy still is not', () => {
  const at = LEGAL.indexOf('export const LEGAL_APPROVALS');
  const block = LEGAL.slice(at, LEGAL.indexOf('} as const;', at));
  assert.match(block, /privacy: true/);
  assert.match(block, /betaTerms: true/);
  assert.match(block, /terms: true/, 'the commercial terms published on 24 August 2026');
  assert.match(block, /privacyCommercial: true/, 'and so did the commercial privacy policy');
  assert.match(block, /cookies: false/,
    'the cookie policy was in no approval given and must not follow the others through');
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
  assert.match(LEGAL, /export const COMMERCIAL_LEGAL_EFFECTIVE_DATE = "\d{1,2} \w+ \d{4}"/);
  // TWO DATES, NOT ONE. The beta set and the commercial set went live on
  // different days under different approvals, and each document carries the
  // date of its own publication. Sharing a constant would lose the distinction
  // exactly where somebody needs it: working out which document a given
  // athlete was shown, and when.
  for (const name of ['privacyDraft', 'betaTermsDraft']) {
    assert.match(docBody(name), /lastUpdated: BETA_LEGAL_EFFECTIVE_DATE/, name);
  }
  for (const name of ['termsDraft', 'privacyCommercialDraft']) {
    assert.match(docBody(name), /lastUpdated: COMMERCIAL_LEGAL_EFFECTIVE_DATE/, name);
  }
  for (const name of ['privacyDraft', 'betaTermsDraft', 'termsDraft', 'privacyCommercialDraft']) {
    assert.ok(!/lastUpdated: TBC\(/.test(docBody(name)), name + ' must not ship a placeholder date');
  }
  // NOT BACKDATED. The commercial documents were unpublished until the day
  // they carry; asserting an earlier one would claim somebody was bound by
  // wording they could not have read.
  assert.match(LEGAL, /export const COMMERCIAL_LEGAL_EFFECTIVE_DATE = "24 August 2026"/);
  // A document not in force has no effective date, so the gated one keeps its.
  assert.match(docBody('cookiesDraft'), /lastUpdated: TBC\(/, 'cookiesDraft is not in force');
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
  // Comments stripped: the file explains WHY /beta-terms is excluded, and that
  // sentence is not a route it offers.
  const declarations = sitemap
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
  assert.ok(
    !/beta-terms/.test(declarations),
    'an invited-testers document does not belong in a public sitemap'
  );
  // Privacy reaches the sitemap through publicLegalLinks, the same gate-driven
  // list the footer uses, rather than through a literal somebody must maintain.
  assert.match(sitemap, /publicLegalLinks/,
    'the published legal documents reach the sitemap through their gates');
  assert.ok(!/"\/privacy"/.test(sitemap),
    'a hard-coded copy alongside the derived list is how the two drift apart');
});

test('beta terms stay noindex, and privacy no longer does', () => {
  assert.match(read('src/app/beta-terms/page.tsx'), /robots: \{ index: false/);
  // The published Privacy Policy is real content and must stay indexable. It
  // now also carries a NOINDEX FOR ITS REVIEW VARIANT ONLY (?review=1, which
  // renders the unapproved commercial draft), so a bare grep for "index: false"
  // no longer expresses the intent. What must hold is that the directive is
  // conditional on review and absent otherwise.
  const privacy = read('src/app/privacy/page.tsx');
  const noindexOccurrences = (privacy.match(/index: false/g) || []).length;
  assert.equal(noindexOccurrences, 1, 'exactly one noindex, and it belongs to the review variant');
  assert.match(
    privacy,
    /review\s*\?\s*\{\s*robots:\s*\{\s*index:\s*false/,
    'the Privacy Policy must stay indexable except in review mode'
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
  // Cross-checks the gate-boundary test above against how publicLegalLinks
  // actually filters, without executing TypeScript: with today's gate state
  // Privacy and Terms are `true` and Cookies is `false`, so the
  // .filter(link => link.approved) call keeps those two and drops the third.
  const at = LEGAL.indexOf('export const LEGAL_APPROVALS');
  const gates = LEGAL.slice(at, LEGAL.indexOf('} as const;', at));
  assert.match(gates, /privacy: true/);
  assert.match(gates, /terms: true/);
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

// ---------------------------------------------------------------------------
// THE CANONICAL DOCUMENT CONTRACT
// ---------------------------------------------------------------------------
//
// Commissioning found that app checkout asks the athlete to accept the app's
// own /terms and /privacy, and that those describe the private beta. So a
// paying customer could accept evidence pointing at documents that do not
// describe the paid product. CANONICAL_LEGAL is the website's half of the fix:
// one address per document, and one identifier naming which document is in
// force there. These tests hold the two properties that make it safe to
// integrate against — it cannot name a version for an unpublished document,
// and it cannot drift away from the approval flags.

// `docBody` anchors on "export const <name>", which would match
// CANONICAL_LEGAL_ORIGIN before CANONICAL_LEGAL. Anchor on the type annotation
// so the slice is the record itself.
const canonicalBody = () => {
  const at = LEGAL.indexOf('export const CANONICAL_LEGAL: Record');
  assert.ok(at !== -1, 'the canonical document set must exist');
  return LEGAL.slice(at, LEGAL.indexOf('\n};', at));
};

test('the canonical set names one origin and one URL per document', () => {
  const body = canonicalBody();
  assert.match(LEGAL, /export const CANONICAL_LEGAL_ORIGIN = "https:\/\/velvetviking\.co\.uk"/);
  for (const route of ['/terms', '/privacy', '/cookies']) {
    assert.ok(
      body.includes('${CANONICAL_LEGAL_ORIGIN}' + route),
      `${route} must derive from the shared origin rather than repeat the host`
    );
  }
  // The host is written once. A second literal is how the app and the website
  // end up pointing at two different places that look like one.
  assert.equal(
    (LEGAL.match(/https:\/\/velvetviking\.co\.uk/g) || []).length, 1,
    'exactly one origin literal'
  );
});

test('an unpublished document reports no version, so nothing can record one', () => {
  const body = canonicalBody();
  // Every `version` is a conditional on a LEGAL_APPROVALS flag with null on the
  // unapproved branch. An unconditional string here would hand the app an
  // identifier for a document that is not published, which is the exact defect
  // this contract exists to prevent.
  for (const doc of ['terms', 'privacy', 'cookies']) {
    const at = body.indexOf(doc + ': {');
    assert.ok(at > -1, `${doc} must be in the canonical set`);
    const entry = body.slice(at, body.indexOf('},', at));
    assert.match(entry, /version:[\s\S]*LEGAL_APPROVALS/,
      `${doc}.version must follow its approval flag`);
    assert.match(entry, /published: /);
  }
  assert.match(body, /version: LEGAL_APPROVALS\.terms \? "commercial_terms_v1" : null/);
  assert.match(body, /published: LEGAL_APPROVALS\.terms,/);
});

test('the commercial identifiers name their document, not just a number', () => {
  const body = canonicalBody();
  // `terms_v1` is what the app records today and it names no document: it would
  // mean the beta Terms on one row and the commercial Terms on another, with
  // nothing in the table to tell them apart. Every identifier is prefixed.
  for (const id of ['commercial_terms_v1', 'commercial_privacy_v1', 'commercial_cookies_v1']) {
    assert.ok(body.includes(id), `${id} must be declared`);
  }
  assert.ok(body.includes('beta_privacy_v1'), 'the in-force beta policy is named as beta');
  assert.ok(!/"terms_v1"|"privacy_v1"/.test(body),
    'a bare terms_v1/privacy_v1 would be ambiguous about which document it means');
});

test('the beta Terms are never offered as the canonical Terms', () => {
  const body = canonicalBody();
  const at = body.indexOf('terms: {');
  const entry = body.slice(at, body.indexOf('},', at));
  // /beta-terms governs five invited testers. Falling back to it when the
  // commercial Terms are unpublished would move the defect rather than fix it.
  assert.ok(!/beta/i.test(entry), 'no beta fallback on the commercial Terms entry');
  // Comments stripped: the block explains WHY /beta-terms is excluded, and that
  // sentence is not itself a route the contract offers.
  const declarations = body
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
  assert.ok(!declarations.includes('/beta-terms'),
    'the beta document must not be a canonical entry');
});

test('the blocker list survives as a mechanism, and is empty because both closed', () => {
  const at = LEGAL.indexOf('export const COMMERCIAL_LEGAL_BLOCKERS');
  assert.ok(at > -1, 'the mechanism that holds an unapproved document shut must not be deleted');
  const body = LEGAL.slice(at, LEGAL.indexOf('\n', LEGAL.indexOf('= [];', at)));
  assert.match(body, /= \[\]/, 'both entries closed on the 24 August 2026 full-document approval');
  // Empty because resolved, not because the list was thrown away: the entries
  // are gone only now that the decisions they named are written INTO the
  // documents. legalPack and launchReadiness hold that wording.
  assert.match(LEGAL, /terms: true/);
  assert.match(LEGAL, /privacyCommercial: true/);
});

test('solicitor approval of the immediate-start wording is not treated as approval of the documents', () => {
  // The reviewed item is one string inside the app's checkout, shipping as
  // immediate_start_v1. It is not review of either document here, and the
  // repository must not imply that it is.
  const at = LEGAL.indexOf('export const COMMERCIAL_LEGAL_BLOCKERS');
  const preamble = LEGAL.slice(LEGAL.lastIndexOf('/**', at), at);
  assert.match(preamble, /immediate.start/i,
    'the scope of the review that HAS happened must be stated where it could be misread');
  assert.match(preamble, /immediate_start_v1/);
});
