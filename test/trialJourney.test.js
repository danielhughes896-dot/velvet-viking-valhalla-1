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
// 1. THE JOURNEY IS WIRED: /pricing -> /trial -> /start
// ---------------------------------------------------------------------------
test('the pricing CTA sends visitors to the billing preference step', () => {
  const card = code(read('src/components/sections/PricingCard.tsx'));
  assert.match(card, /href="\/trial"/, 'the pricing CTA must point at /trial');
  assert.match(card, /Start Free Trial/, 'the pricing CTA keeps its Start Free Trial label');
  assert.ok(
    !/href="\/start"/.test(card),
    'the pricing CTA must no longer skip the billing step by going straight to /start'
  );
});

test('the pricing page still offers exactly one CTA, not one per billing period', () => {
  const card = code(read('src/components/sections/PricingCard.tsx'));
  const ctas = (card.match(/<CtaButton/g) || []).length;
  assert.equal(ctas, 1, 'two CTAs would turn one product into a two-option checkout');
});

test('the billing step continues into the existing account page', () => {
  const choice = code(read('src/components/sections/BillingPeriodChoice.tsx'));
  assert.match(choice, /href=\{`\/start\?billing=\$\{selected\}`\}/);
  assert.match(choice, /Continue to Account/);
  const ctas = (choice.match(/<CtaButton/g) || []).length;
  assert.equal(ctas, 1, 'there must be a single primary CTA, never one button per price');
});

test('/trial exists as a real route with its own canonical and metadata', () => {
  assert.ok(fs.existsSync(path.join(ROOT, 'src/app/trial/page.tsx')));
  const page = code(read('src/app/trial/page.tsx'));
  assert.match(page, /alternates:\s*\{\s*canonical:\s*"\/trial"\s*\}/);
  assert.match(page, /pages\.trial/);
  assert.match(read('src/app/sitemap.ts'), /"\/trial"/, '/trial is public and belongs in the sitemap');
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
      assert.ok(!rx.test(src), `${file} introduces ${rx} — this journey is UX only, with no commerce`);
    }
  }
  assert.ok(files.length > 20, 'sanity: the walk actually found the source tree');
});

test('the billing step collects nothing and submits nowhere', () => {
  const choice = code(read('src/components/sections/BillingPeriodChoice.tsx'));
  assert.ok(!/<form/i.test(choice), 'a form would imply something is submitted somewhere');
  assert.ok(!/fetch\(|axios|onSubmit|action=/.test(choice), 'the page performs no requests');
  // One <input> literal, rendered once per entry in OPTIONS, and OPTIONS holds
  // exactly the two billing periods. So the page collects two radio values and
  // nothing else — no name, no email, no card, no address.
  const inputs = (choice.match(/<input/g) || []).length;
  assert.equal(inputs, 1, 'a second input literal would mean something beyond the period is collected');
  assert.match(choice, /type="radio"/);
  const optionIds = [...choice.matchAll(/id:\s*"(monthly|yearly)"/g)].map((m) => m[1]);
  assert.deepEqual(optionIds, ['monthly', 'yearly'], 'exactly two options: monthly and yearly');
});

test('the not-live state is still driven by trial.live, not hard-coded', () => {
  const choice = code(read('src/components/sections/BillingPeriodChoice.tsx'));
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

test('/trial does not gate, mention or interfere with beta access', () => {
  const choice = code(read('src/components/sections/BillingPeriodChoice.tsx'));
  const page = code(read('src/app/trial/page.tsx'));
  for (const src of [choice, page]) {
    assert.ok(!/betaAccess|\/get\b/.test(src), 'the billing step must not touch the beta entry point');
  }
});

// ---------------------------------------------------------------------------
// 4. TWO EQUAL OPTIONS, NO PROMOTIONAL FRAMING
// ---------------------------------------------------------------------------
test('both billing options render through the same markup, so neither can be styled as preferred', () => {
  const choice = code(read('src/components/sections/BillingPeriodChoice.tsx'));
  assert.match(choice, /OPTIONS\.map\(/, 'the options must be mapped, not hand-written twice');
  assert.match(choice, /plans\.standard\.price\b/);
  assert.match(choice, /plans\.standard\.priceAnnual\b/);
  // Equal width track: neither tile may be given a different basis or span.
  assert.match(choice, /grow basis-0/);
});

test('the billing step reads its prices from config rather than hard-coding them', () => {
  const choice = code(read('src/components/sections/BillingPeriodChoice.tsx'));
  assert.ok(
    !/11\.99|89\.99/.test(choice),
    'prices must come from content/commerce.ts so /trial can never drift from /pricing'
  );
});

test('no savings, ranking or urgency framing appears in the trial journey', () => {
  const surfaces = [
    'src/components/sections/BillingPeriodChoice.tsx',
    'src/app/trial/page.tsx',
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
  const choice = code(read('src/components/sections/BillingPeriodChoice.tsx'));
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
  const site = read('src/content/site.ts');
  assert.match(site, /The trial itself is the same either way/);
  const choice = read('src/components/sections/BillingPeriodChoice.tsx');
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
