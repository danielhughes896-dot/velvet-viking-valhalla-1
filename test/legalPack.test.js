const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const code = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

// ---------------------------------------------------------------------------
// 1. NOTHING BECAME APPROVED BY BEING FINISHED
// ---------------------------------------------------------------------------
test('completing the drafts did not publish any of them', () => {
  const legal = code(read('src/content/legal.ts'));
  assert.match(legal, /terms:\s*false/, 'Terms must stay unapproved');
  assert.match(legal, /cookies:\s*false/, 'Cookies must stay unapproved');
  assert.match(legal, /privacyCommercial:\s*false/, 'the commercial privacy draft must stay unapproved');
  // The live beta policy keeps its existing approval, untouched.
  assert.match(legal, /privacy:\s*true/);
  assert.match(legal, /betaTerms:\s*true/);
});

test('the live privacy policy was not edited in place', () => {
  // It is approved and published, and accurate for a beta with no payments and
  // no live integrations. The commercial rewrite is a SEPARATE document.
  const legal = read('src/content/legal.ts');
  assert.match(legal, /export const privacyDraft: LegalDocument/);
  assert.match(legal, /export const privacyCommercialDraft: LegalDocument/);
  const live = legal.slice(legal.indexOf('export const privacyDraft'), legal.indexOf('// ---', legal.indexOf('export const privacyDraft')));
  for (const rx of [/payment processor/i, /monday/i, /subscription data/i]) {
    assert.ok(!rx.test(live), `the live beta policy must not describe ${rx} — that belongs to the commercial draft`);
  }
});

test('only approved documents appear in the public footer', () => {
  const legal = code(read('src/content/legal.ts'));
  const links = legal.slice(legal.indexOf('export const publicLegalLinks'), legal.indexOf('];', legal.indexOf('export const publicLegalLinks')));
  assert.match(links, /approved: LEGAL_APPROVALS\.terms/);
  assert.match(links, /approved: LEGAL_APPROVALS\.cookies/);
  assert.match(links, /filter\(\(link\) => link\.approved\)/);
});

// ---------------------------------------------------------------------------
// 2. REVIEW MODE IS UNLINKED, UNINDEXED AND NON-PUBLISHING
// ---------------------------------------------------------------------------
test('every legal route offers review mode without changing its gate', () => {
  for (const [file, gate] of [
    ['src/app/terms/page.tsx', 'LEGAL_APPROVALS.terms'],
    ['src/app/cookies/page.tsx', 'LEGAL_APPROVALS.cookies'],
    ['src/app/privacy/page.tsx', 'LEGAL_APPROVALS.privacyCommercial'],
  ]) {
    const src = code(read(file));
    assert.match(src, /review === "1"/, `${file} must support ?review=1`);
    assert.match(src, new RegExp(gate.replace('.', '\\.')), `${file} must still consult its gate`);
  }
});

test('review URLs are noindex in every case', () => {
  // /terms and /cookies are noindex in all states. /privacy is indexable when
  // published, so its noindex must attach to the review variant specifically —
  // otherwise an unapproved draft could be indexed on an indexable route.
  for (const f of ['src/app/terms/page.tsx', 'src/app/cookies/page.tsx']) {
    assert.match(code(read(f)), /robots:\s*\{\s*index:\s*false/, `${f} must be noindex`);
  }
  const privacy = code(read('src/app/privacy/page.tsx'));
  assert.match(privacy, /generateMetadata/, 'privacy needs computed metadata to vary robots by query');
  assert.match(privacy, /review\s*\?\s*\{\s*robots:\s*\{\s*index:\s*false/);
});

test('no review URL is linked from the site or listed in the sitemap', () => {
  assert.ok(!/review=1/.test(read('src/app/sitemap.ts')), 'review URLs must never be in the sitemap');
  const files = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = path.join(dir, e.name);
      if (e.isDirectory()) walk(rel);
      else if (/\.tsx?$/.test(e.name)) files.push(rel);
    }
  })('src');
  for (const f of files) {
    if (f.endsWith('LegalReview.tsx')) continue; // the reviewer's own inter-document nav
    assert.ok(!/review=1/.test(code(read(f))), `${f} links to a review URL from ordinary site chrome`);
  }
});

// ---------------------------------------------------------------------------
// 3. THE TERMS MATCH THE AUTHORISED COMMERCIAL MODEL
// ---------------------------------------------------------------------------
test('the trial is described as card-up-front, chosen-up-front and auto-converting', () => {
  const legal = read('src/content/legal.ts');
  const terms = legal.slice(legal.indexOf('export const termsDraft'), legal.indexOf('export const cookiesDraft'));
  assert.match(terms, /not a card-free trial/i);
  assert.match(terms, /does not simply expire/i);
  assert.match(terms, /choose monthly or annual billing and provide a valid payment method/i);
  assert.match(terms, /starts automatically when the trial ends/i);
  assert.match(terms, /Cancelling is what stops it; doing nothing does not/i);
});

test('the Terms do not invent a refund guarantee or a blanket refusal', () => {
  const legal = read('src/content/legal.ts');
  const terms = legal.slice(legal.indexOf('export const termsDraft'), legal.indexOf('export const cookiesDraft'));
  for (const rx of [/no refunds/i, /non-refundable/i, /money-back guarantee/i, /all sales are final/i]) {
    assert.ok(!rx.test(terms), `${rx} is a blanket policy nobody authorised`);
  }
  assert.match(terms, /statutory/i, 'statutory rights must be preserved explicitly');
  assert.match(terms, /discretion we are describing honestly, not a guarantee/i);
});

test('the Terms carry no US boilerplate', () => {
  const legal = read('src/content/legal.ts');
  const terms = legal.slice(legal.indexOf('export const termsDraft'), legal.indexOf('export const cookiesDraft'));
  for (const rx of [/arbitration/i, /class action/i, /jury trial/i, /\bDMCA\b/, /State of [A-Z]/, /\bAS IS\b/]) {
    assert.ok(!rx.test(terms), `${rx} has no place in a UK consumer contract`);
  }
  assert.match(terms, /law of England and Wales/i);
});

test('cancellation is described without friction or false mechanics', () => {
  const legal = read('src/content/legal.ts');
  const terms = legal.slice(legal.indexOf('export const termsDraft'), legal.indexOf('export const cookiesDraft'));
  assert.match(terms, /Deleting the app from your phone does not cancel a subscription/i);
  assert.match(terms, /we do not take further payments after a valid cancellation/i);
  // No fabricated UI: the route is described in provider-neutral terms.
  for (const rx of [/\bstripe\b/i, /billing portal/i, /customer portal/i]) {
    assert.ok(!rx.test(terms), `${rx} names a mechanism System has not confirmed`);
  }
});

test('unbuilt commercial features are gated, not promised', () => {
  const legal = code(read('src/content/legal.ts'));
  assert.match(legal, /foundingPriceLock:\s*false/);
  assert.match(legal, /subscriptionPause:\s*false/);
  const terms = legal.slice(legal.indexOf('export const termsDraft'), legal.indexOf('export const cookiesDraft'));
  assert.match(terms, /COMMERCIAL_FEATURES\.subscriptionPause/, 'pause wording must be gated');
  // The founding price is described conditionally rather than promised.
  assert.match(terms, /Where an offer is described to you at the point of sale/i);
  assert.ok(!/your price stays the same for as long as you stay subscribed/i.test(terms),
    'that is an unconditional promise the backend cannot yet honour');
});

// ---------------------------------------------------------------------------
// 4. FACTUAL ACCURACY OF PRIVACY AND COOKIES
// ---------------------------------------------------------------------------
test('monday.com is never described as receiving coaching or training data', () => {
  const legal = read('src/content/legal.ts');
  const idx = legal.indexOf('monday.com');
  assert.ok(idx > -1, 'the commercial privacy draft should account for monday.com');
  const sentence = legal.slice(idx - 200, idx + 400);
  assert.match(sentence, /does not receive your training history/i);
  for (const rx of [/monday[^.]{0,120}(training history|heart rate|session notes|readiness)/i]) {
    // guarded by the explicit negative above; this catches an accidental positive claim
    assert.ok(/does not receive/i.test(sentence), `monday must be described negatively, got: ${rx}`);
  }
});

test('Garmin is never described as operating', () => {
  const legal = read('src/content/legal.ts');
  const commercial = legal.slice(legal.indexOf('export const privacyCommercialDraft'), legal.indexOf('// ---', legal.indexOf('export const privacyCommercialDraft')));
  assert.match(commercial, /not switched on/i);
  assert.ok(!/we collect (data )?from your Garmin/i.test(commercial));
});

test('the cookie policy matches the website audit: no cookies, no analytics', () => {
  const legal = read('src/content/legal.ts');
  const cookies = legal.slice(legal.indexOf('export const cookiesDraft'), legal.indexOf('export const privacyCommercialDraft'));
  assert.match(cookies, /sets no cookies/i);
  assert.match(cookies, /strictly necessary/i);
  // And the claim must remain true of the actual source.
  const files = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = path.join(dir, e.name);
      if (e.isDirectory()) walk(rel);
      else if (/\.tsx?$/.test(e.name)) files.push(rel);
    }
  })('src');
  for (const f of files) {
    const src = code(read(f));
    for (const rx of [/document\.cookie/, /localStorage/, /sessionStorage/]) {
      assert.ok(!rx.test(src), `${f} uses ${rx} — the cookie policy says this website stores nothing`);
    }
  }
});

test('unresolved legal facts are marked, not invented', () => {
  const legal = read('src/content/legal.ts');
  // TBC markers are expected; what matters is that none can ever render.
  assert.match(legal, /TO BE CONFIRMED/);
  assert.match(code(read('src/content/legal.ts')), /isConfirmed/);
});
