const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

// Comments in this codebase legitimately quote the wording and route names a
// change moved away from, so prose about a fix must not be mistaken for the
// fix itself. Same helper, same reason, as the other suites here.
const code = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

// ---------------------------------------------------------------------------
// 1. THE JOURNEY IS WIRED: /pricing -> /start -> the app
// ---------------------------------------------------------------------------
test('the pricing CTA sends visitors straight to the commercial entry', () => {
  /* It used to go to /trial, a page whose only job was asking monthly or
     annual -- a question the app asks again where the answer does something.
     One step fewer between the price and the account. */
  const card = code(read('src/components/sections/PricingCard.tsx'));
  assert.match(card, /href="\/start"/, 'the pricing CTA must point at /start');
  assert.match(card, /Start Free Trial/, 'the pricing CTA keeps its Start Free Trial label');
  assert.ok(!/href="\/trial"/.test(card), 'the removed step must not be linked to again');
});

test('the pricing page still offers exactly one CTA, not one per billing period', () => {
  const card = code(read('src/components/sections/PricingCard.tsx'));
  const ctas = (card.match(/<CtaButton/g) || []).length;
  assert.equal(ctas, 1, 'two CTAs would turn one product into a two-option checkout');
});

test('the commercial entry continues into the real account surface', () => {
  const start = code(read('src/app/start/page.tsx'));
  /* "Continue to create account", not "continue to account": the two are
     different promises and only one of them is what the button does. */
  assert.match(start, /Continue to Create Account/);
  assert.ok(!/Continue to Account/.test(start), 'the weaker label must not come back');
  assert.match(start, /href=\{appUrl\}/, 'it hands off to the app, which owns identity');
  /* Sign in is a DIFFERENT destination now. Both CTAs used to point at the
     same URL, so somebody who already had an account was sent to the page
     that starts one. */
  assert.match(start, /href=\{appSignInUrl\}/);
  const site = code(read('src/content/site.ts'));
  assert.match(site, /appSignInUrl = "https:\/\/app\.velvetviking\.co\.uk\/account"/);
  assert.match(site, /appUrl = "https:\/\/app\.velvetviking\.co\.uk\/start"/);
});

test('the terms card carries no CTA of its own, so there is one way forward', () => {
  const terms = code(read('src/components/sections/TrialTerms.tsx'));
  assert.equal((terms.match(/<CtaButton/g) || []).length, 0,
    'a button here would put two primary actions on one page');
});

test('/trial is gone, and forwards rather than 404s', () => {
  /* It was public, indexable and in the sitemap, and it was reachable from the
     pricing CTA -- so search engines have it and anybody who got as far as
     choosing a period may have bookmarked it. Deleting the route without a
     forwarding address turns every one of those into a 404 at the moment
     somebody was trying to buy something. */
  assert.ok(!fs.existsSync(path.join(ROOT, 'src/app/trial/page.tsx')),
    'the route file must be deleted, not merely unlinked from the nav');
  assert.ok(!/"\/trial"/.test(read('src/app/sitemap.ts')),
    'a removed page must not still be advertised for indexing');
  const cfg = code(read('next.config.ts'));
  assert.match(cfg, /source:\s*"\/trial"/);
  assert.match(cfg, /destination:\s*"\/start"/);
  assert.match(cfg, /permanent:\s*true/, 'the move is permanent, so the redirect must say so');
});

test('nothing anywhere still links to the removed step', () => {
  const files = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(rel);
      else if (/\.(tsx?|mjs)$/.test(entry.name)) files.push(rel);
    }
  })('src');
  for (const f of files) {
    const src = code(read(f));
    assert.ok(!/href="\/trial"/.test(src), `${f} still links to the removed /trial page`);
  }
});

// ---------------------------------------------------------------------------
// 2. NO PAYMENT, NO ENTITLEMENT — THE HARD BOUNDARY
// ---------------------------------------------------------------------------
// The brief for this page is explicit that it is UX only. The cheapest way for
// that to stop being true is somebody wiring a provider into the component
// because the page "looks like" checkout. This is the test that fails first.
test('no payment provider, checkout or card-collection code exists anywhere in the app', () => {
  const files = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(rel);
      else if (/\.(ts|tsx)$/.test(entry.name)) files.push(rel);
    }
  })('src');

  const banned = [
    /\bstripe\b/i,
    /@stripe\//i,
    /checkout\.session/i,
    /createCheckout/i,
    /paymentIntent/i,
    /applePay/i,
    /googlePay/i,
    /\bsubscribe\(/,
    /createSubscription/i,
    /entitlement/i,
    /<input[^>]*(card|cvc|cvv|expiry)/i,
    /webhook/i,
  ];
  for (const file of files) {
    const src = code(fs.readFileSync(path.join(ROOT, file), 'utf8'));
    for (const rx of banned) {
      // See productionReadiness.test.js: the legal pack names Stripe as prose.
      if (file === 'src/content/legal.ts' && String(rx) === String(/\bstripe\b/i)) continue;
      assert.ok(!rx.test(src), `${file} introduces ${rx} — this journey is UX only, with no commerce`);
    }
  }
  assert.ok(files.length > 20, 'sanity: the walk actually found the source tree');
});

test('the terms card collects nothing and submits nowhere', () => {
  const terms = code(read('src/components/sections/TrialTerms.tsx'));
  assert.ok(!/<form/i.test(terms), 'a form would imply something is submitted somewhere');
  assert.ok(!/fetch\(|axios|onSubmit|action=/.test(terms), 'the page performs no requests');
  /* IT COLLECTS NOTHING AT ALL NOW. It used to hold two radios and carry the
     chosen period to /start as a query parameter that no page ever read. The
     app asks the same question where the answer creates a subscription, so the
     control here was a second place to answer it and a first place to get it
     wrong. Presentational: no inputs, no state, no "use client". */
  assert.ok(!/<input/.test(terms), 'the terms card must not collect anything');
  assert.ok(!/useState|"use client"/.test(terms), 'it needs no client state');
  assert.ok(!/\?billing=/.test(terms), 'and no dead query parameter follows it forward');
});

test('the not-live state is still driven by trial.live, not hard-coded', () => {
  const choice = code(read('src/components/sections/TrialTerms.tsx'));
  assert.match(choice, /!trial\.live/, 'the notice must read the same flag the rest of the site does');
  const commerce = code(read('src/content/commerce.ts'));
  assert.match(commerce, /live:\s*false/, 'trial signup is still not live');
  assert.match(commerce, /createAccount:\s*null/, 'the account seam is still null');
  assert.match(commerce, /signIn:\s*null/, 'the sign-in seam is still null');
});

// ---------------------------------------------------------------------------
// 3. THE BETA DOOR IS UNTOUCHED
// ---------------------------------------------------------------------------
// Existing testers reach the app through /start. Adding a step in front of it
// must not move, gate or bury that door.
test('the private beta entry still lives on /start and still points at the app', () => {
  const start = read('src/app/start/page.tsx');
  assert.match(start, /betaAccess\.cta\.href/, '/start still renders the beta CTA');
  assert.match(start, /betaAccess\.eyebrow/);
  const site = read('src/content/site.ts');
  assert.match(
    site,
    /velvet-viking-valhalla-1\.vercel\.app\/get/,
    'the beta app URL must be unchanged'
  );
});

test('the terms card does not gate, mention or interfere with beta access', () => {
  const terms = code(read('src/components/sections/TrialTerms.tsx'));
  assert.ok(!/betaAccess|\/get\b/.test(terms),
    'the terms card must not touch the beta entry point');
});

// ---------------------------------------------------------------------------
// 4. TWO EQUAL OPTIONS, NO PROMOTIONAL FRAMING
// ---------------------------------------------------------------------------
test('both billing options render through the same markup, so neither can be styled as preferred', () => {
  const choice = code(read('src/components/sections/TrialTerms.tsx'));
  assert.match(choice, /OPTIONS\.map\(/, 'the options must be mapped, not hand-written twice');
  assert.match(choice, /plans\.standard\.price\b/);
  assert.match(choice, /plans\.standard\.priceAnnual\b/);
  // Equal width track: neither tile may be given a different basis or span.
  assert.match(choice, /grow basis-0/);
});

test('the terms card reads its prices from config rather than hard-coding them', () => {
  const choice = code(read('src/components/sections/TrialTerms.tsx'));
  assert.ok(
    !/11\.99|89\.99/.test(choice),
    'prices must come from content/commerce.ts so /start can never drift from /pricing'
  );
});

test('no savings, ranking or urgency framing appears in the trial journey', () => {
  const surfaces = [
    'src/components/sections/TrialTerms.tsx',
    'src/app/start/page.tsx',
    'src/components/sections/PricingCard.tsx',
    'src/content/site.ts',
    'src/content/commerce.ts',
  ];
  const banned = [
    /\bsave\b/i,
    /\bsavings?\b/i,
    /best value/i,
    /most popular/i,
    /\bdiscount/i,
    /equivalent/i,
    /recommended/i,
    /limited offer/i,
    /line-through/i,
    /\bbuy now\b/i,
    /\b53\.89\b/,
    /\b143\.88\b/,
    /\b7\.[45][0-9]\b/,
  ];
  for (const file of surfaces) {
    const src = code(read(file));
    for (const rx of banned) {
      assert.ok(!rx.test(src), `${file} introduces ${rx} — the two periods stay uncompared`);
    }
  }
});

test('the copy states the trial terms without promising anything unapproved', () => {
  const choice = code(read('src/components/sections/TrialTerms.tsx'));
  // COMMERCIAL CORRECTION: this used to assert the older sentence, "You won't
  // be charged during your 14-day trial." That was true and incomplete — it
  // described a trial that simply expires, when in fact the chosen
  // subscription starts by itself. The assertion now checks the same intent
  // (the trial length and its cost are stated from config) against wording
  // that also states the conversion. See trialModel.test.js for the full model.
  assert.match(choice, /\{trial\.days\}-day trial is free/);
  assert.match(choice, /Cancel before the trial ends/);
  assert.match(choice, /trial\.cardRequired/, 'the card requirement must follow the config flag');
  assert.ok(
    !/refund|cancel any time|cancel anytime|no questions/i.test(choice),
    'no cancellation or refund promise is approved, so none may be stated'
  );
});

test('the page says the two periods are the same product', () => {
  /* "The trial itself is the same either way" lived in pages.trial and went
     with the page. The claim it protected -- that the two periods are one
     product, not two -- is now made once, on the surface that shows them. */
  const choice = read('src/components/sections/TrialTerms.tsx');
  assert.match(choice, /Both are Standard, in full/);
  assert.match(choice, /The only difference is how often you’re billed/);
});

// ---------------------------------------------------------------------------
// 5. PRICING PAGE UNCHANGED WHERE IT MATTERS
// ---------------------------------------------------------------------------
test('pricing still carries both approved prices', () => {
  const commerce = code(read('src/content/commerce.ts'));
  assert.match(commerce, /price:\s*\{\s*amount:\s*11\.99,\s*currency:\s*"GBP",\s*period:\s*"month"\s*\}/);
  assert.match(commerce, /priceAnnual:\s*\{\s*amount:\s*89\.99,\s*currency:\s*"GBP",\s*period:\s*"year"\s*\}/);
});
