const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const code = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

// ---------------------------------------------------------------------------
// 1. THE BILLING PERIOD IS ONE VOCABULARY, SHARED
// ---------------------------------------------------------------------------
// /trial offers the choice, /start reflects it, and the backend allow-list
// accepts it. Three copies of two strings is how a fourth surface later accepts
// "annual" and silently falls through to the wrong price.
test('there is a single billing-period module and every surface reads it', () => {
  const mod = code(read('src/content/billingPeriod.ts'));
  assert.match(mod, /BILLING_PERIODS = \["monthly", "yearly"\]/);
  assert.match(mod, /DEFAULT_BILLING_PERIOD: BillingPeriodId = "monthly"/);

  const choice = code(read('src/components/sections/BillingPeriodChoice.tsx'));
  const start = code(read('src/app/start/page.tsx'));
  assert.match(choice, /from "@\/content\/billingPeriod"/, '/trial must read the shared module');
  assert.match(start, /from "@\/content\/billingPeriod"/, '/start must read the shared module');
  assert.match(choice, /DEFAULT_BILLING_PERIOD/, 'the default must not be re-typed in the component');
});

test('the allow-list is exact, with no leniency the backend does not share', () => {
  const mod = code(read('src/content/billingPeriod.ts'));
  // Lowercasing or trimming here while the backend matches exactly is how a
  // reader gets shown one period and billed for the other.
  assert.ok(!/toLowerCase|toUpperCase|\.trim\(\)/.test(mod),
    'readDisplayPeriod must not normalise: the backend allow-list does not');
});

// Behaviour of the resolver, exercised directly against the source contract.
test('malformed billing values resolve to the default rather than throwing', () => {
  const mod = read('src/content/billingPeriod.ts');
  // A total function: every branch returns one of the two known periods.
  assert.match(mod, /return isBillingPeriod\(value\) \? value : DEFAULT_BILLING_PERIOD/);
  assert.ok(!/throw /.test(code(mod)), 'a 500 on the account journey is worse than the default');
  // Arrays are what ?billing=a&billing=b produces; typeof guards them out.
  assert.match(mod, /typeof value === "string"/);
});

// ---------------------------------------------------------------------------
// 2. /start REFLECTS THE CHOSEN PERIOD
// ---------------------------------------------------------------------------
test('/start builds its steps from the requested period, not a fixed price', () => {
  const start = code(read('src/app/start/page.tsx'));
  assert.match(start, /readDisplayPeriod\(\(await searchParams\)\.billing\)/,
    '/start must read the period from the query string');
  assert.match(start, /stepsFor\(period\)/, 'the steps must be a function of the period');
  assert.match(start, /formatPeriodPrice\(period\)/);
  // The old module-scope constant is what made every reader see monthly.
  assert.ok(!/plan\.price\.amount\.toFixed/.test(start),
    'step four must no longer hard-code the monthly amount');
});

test('/start never prints a monthly-equivalent or a comparison for the yearly price', () => {
  const mod = code(read('src/content/billingPeriod.ts'));
  const start = code(read('src/app/start/page.tsx'));
  for (const src of [mod, start]) {
    for (const rx of [/\/\s*12\b/, /equivalent/i, /\bsave\b/i, /\bsavings?\b/i, /\bdiscount/i,
      /best value/i, /most popular/i, /\b53\.89\b/, /\b143\.88\b/, /\b7\.[45][0-9]\b/]) {
      assert.ok(!rx.test(src), `${rx} must not appear: the two periods stay uncompared`);
    }
  }
});

// ---------------------------------------------------------------------------
// 3. THE CHECKOUT RETURN SURFACE THIS ORIGIN ACTUALLY OWNS
// ---------------------------------------------------------------------------
// Verified against api/_stripe.js on the Valhalla app's stripe-foundation
// branch: success_url is built from the APP origin, cancel_url from the
// marketing origin. Only the cancel path returns here.
test('/pricing renders a cancelled notice only for the exact configured value', () => {
  const pricing = code(read('src/app/pricing/page.tsx'));
  assert.match(pricing, /\(await searchParams\)\.checkout === "cancelled"/,
    'exact match, so ?checkout=complete typed by hand renders the ordinary page');
  assert.match(pricing, /CheckoutCancelledNotice/);
});

test('the website never renders a payment-success state, because it cannot know', () => {
  const files = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = path.join(dir, e.name);
      if (e.isDirectory()) walk(rel);
      else if (/\.(ts|tsx)$/.test(e.name)) files.push(rel);
    }
  })('src');
  for (const f of files) {
    const src = code(fs.readFileSync(path.join(ROOT, f), 'utf8'));
    for (const rx of [/checkout=complete/, /payment (successful|complete)/i,
      /subscription (active|started)/i, /you are now subscribed/i, /trial started/i]) {
      assert.ok(!rx.test(src),
        `${f} matches ${rx} — success is asserted by the backend on its own host, never here`);
    }
  }
  assert.ok(files.length > 20, 'sanity: the walk found the source tree');
});

test('the cancelled notice claims nothing about money or entitlement', () => {
  const pricing = read('src/app/pricing/page.tsx');
  const notice = pricing.slice(pricing.indexOf('function CheckoutCancelledNotice'),
    pricing.indexOf('export default async function PricingPage'));
  for (const rx of [/charg/i, /refund/i, /\bpaid\b/i, /subscription/i, /entitle/i, /account/i]) {
    assert.ok(!rx.test(code(notice)),
      `the notice matches ${rx} — a redirect is not the authority on that`);
  }
});

// ---------------------------------------------------------------------------
// 4. SECURITY BOUNDARY — THE WEBSITE HOLDS NO PAYMENT AUTHORITY
// ---------------------------------------------------------------------------
test('no Stripe credential, price id, amount-bearing request or entitlement logic ships', () => {
  const files = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = path.join(dir, e.name);
      if (e.isDirectory()) walk(rel);
      else if (/\.(ts|tsx)$/.test(e.name)) files.push(rel);
    }
  })('src');

  const banned = [
    /sk_(live|test)_/, /whsec_/, /pk_(live|test)_/,           // credentials
    /price_[A-Za-z0-9]{6,}/,                                   // Stripe price ids
    /STRIPE_[A-Z_]+/,                                          // provider env vars
    /SUPABASE_SERVICE|service_role/i,                          // service credentials
    /unit_amount|price_data/,                                  // client naming a sum of money
    /\bstripe\b/i,
    /grantAccess|setEntitlement|hasLiveAccess|access_until/,    // entitlement decisions
    /<input[^>]*(card|cvc|cvv|expiry)/i,                       // card collection
  ];
  for (const f of files) {
    const src = code(fs.readFileSync(path.join(ROOT, f), 'utf8'));
    for (const rx of banned) {
      assert.ok(!rx.test(src), `${f} introduces ${rx} — this belongs to the backend, not the website`);
    }
  }
});

test('commerce remains fail-closed: nothing here can start a charge', () => {
  const commerce = code(read('src/content/commerce.ts'));
  assert.match(commerce, /live:\s*false/, 'trial signup is not live');
  assert.match(commerce, /createAccount:\s*null/, 'the account seam is still null');
  assert.match(commerce, /signIn:\s*null/, 'the sign-in seam is still null');

  // No call to the backend checkout contract exists yet: it needs a Supabase
  // access token this origin has no way to obtain. See the report.
  const files = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = path.join(dir, e.name);
      if (e.isDirectory()) walk(rel);
      else if (/\.(ts|tsx)$/.test(e.name)) files.push(rel);
    }
  })('src');
  for (const f of files) {
    const src = code(fs.readFileSync(path.join(ROOT, f), 'utf8'));
    assert.ok(!/api\/checkout|Authorization:\s*`?Bearer/.test(src),
      `${f} calls the checkout contract — not until the auth seam is settled`);
  }
});

// ---------------------------------------------------------------------------
// 5. THE BETA DOOR AND THE APPROVED JOURNEY ARE UNCHANGED
// ---------------------------------------------------------------------------
test('the private beta entry is untouched', () => {
  const start = read('src/app/start/page.tsx');
  assert.match(start, /betaAccess\.cta\.href/);
  assert.match(start, /betaAccess\.eyebrow/);
  assert.match(read('src/content/site.ts'), /velvet-viking-valhalla-1\.vercel\.app\/get/);
});

test('the approved funnel shape is unchanged', () => {
  const card = code(read('src/components/sections/PricingCard.tsx'));
  assert.match(card, /href="\/trial"/);
  assert.match(card, /Start Free Trial/);
  assert.equal((card.match(/<CtaButton/g) || []).length, 1, 'one product, one CTA');

  const choice = code(read('src/components/sections/BillingPeriodChoice.tsx'));
  assert.equal((choice.match(/<CtaButton/g) || []).length, 1, 'one CTA, never one per price');
  assert.match(choice, /grow basis-0/, 'the two tiles stay equal-width');

  const site = read('src/content/site.ts');
  assert.match(site, /heading: "Create Your Account"/);
  assert.match(site, /heading: "Start Your Free Trial"/);
});

// ---------------------------------------------------------------------------
// 6. PRODUCTION DOMAIN
// ---------------------------------------------------------------------------
test('customer-facing URLs use the .co.uk production domain, never a vercel.app one', () => {
  assert.match(code(read('src/content/site.ts')), /siteUrl = "https:\/\/velvetviking\.co\.uk"/);
  // The one permitted vercel.app reference is the beta app link, which is a
  // real deployment URL for a different project (publicMetadata.test.js guards
  // the canonical/sitemap side of this).
  const sitemap = code(read('src/app/sitemap.ts'));
  assert.ok(!/vercel\.app/.test(sitemap));
});

test('the website declares no /api route and no /account route', () => {
  // Both belong to the Valhalla backend project, on its own host. Vercel does
  // not route between projects, so an /api handler here would be a second,
  // unauthorised commerce surface rather than a proxy.
  assert.ok(!fs.existsSync(path.join(ROOT, 'src/app/api')), 'the website serves no API');
  assert.ok(!fs.existsSync(path.join(ROOT, 'src/app/account')),
    'success returns to the backend host /account, not to a page here');
});
