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

// THE ACQUISITION JOURNEY.
//
// WAS trialJourney.test.js, which guarded a chain that no longer exists:
// /pricing -> /trial -> /start, with a billing-period step in the middle. The
// approved journey is value-first — build a plan, see it, save it, then decide
// — so the billing step moved behind the preview into the app and this suite
// now guards the entry architecture instead. The parts that were never about
// /trial (no payment code on the website, the private beta door, the approved
// prices) are carried over unchanged, because they were the reason the old
// suite existed at all.

// ---------------------------------------------------------------------------
// 1. ONE FIRST-TIME ACTION, ONE RETURNING ACTION
// ---------------------------------------------------------------------------
test('both public actions are named once and reused, never retyped', () => {
  const site = code(read('src/content/site.ts'));
  assert.match(site, /export const buildCta = \{ label: "Build My Plan" \} as const;/);
  assert.match(site, /export const signInCta = \{ label: "Sign In" \} as const;/);
  // Nothing may hard-code either label: four different words for one door is
  // the defect this replaced.
  for (const f of srcFiles()) {
    if (f === 'src/content/site.ts') continue;
    const src = code(read(f));
    assert.ok(!/["']Build My Plan["']/.test(src), `${f} hard-codes the build label instead of reading buildCta`);
  }
});

test('every first-time CTA goes through the single gated build route', () => {
  const surfaces = [
    'src/components/sections/Hero.tsx',
    'src/components/sections/ProductShowcase.tsx',
    'src/components/sections/FinalCta.tsx',
    'src/components/sections/PricingCard.tsx',
    'src/app/valhalla/page.tsx',
    'src/components/layout/Header.tsx',
    'src/components/layout/MobileNav.tsx',
  ];
  for (const f of surfaces) {
    const src = code(read(f));
    assert.match(src, /buildUrl/, `${f} must route its primary action through buildUrl`);
    assert.ok(
      !/href="\/trial"|href="\/start"/.test(src),
      `${f} hard-codes an entry route — buildUrl is the only thing that decides where the build starts`
    );
  }
});

test('the returning athlete reaches their account, not the first-time builder', () => {
  const site = code(read('src/content/site.ts'));
  assert.match(site, /export const appSignInUrl = `\$\{appOrigin\}\/account`/);
  assert.match(site, /export const appUrl = `\$\{appOrigin\}\/start`/);
  // Two different rooms. Sending both to one URL is what made "Sign In" and
  // "Start Free Trial" the same click with two different promises.
  assert.ok(!/appSignInUrl = `\$\{appOrigin\}\/start`/.test(site));
  for (const f of ['src/components/layout/Header.tsx', 'src/components/layout/MobileNav.tsx', 'src/app/start/page.tsx']) {
    assert.match(code(read(f)), /appSignInUrl/, `${f} must offer a real returning-athlete route`);
  }
});

test('sign in is live everywhere it appears — no surface still says coming soon', () => {
  for (const f of srcFiles()) {
    const src = code(read(f));
    if (!/signIn|Sign In/.test(src)) continue;
    assert.ok(
      !/Coming soon/i.test(src),
      `${f} still renders an inert Sign In while the app has offered accounts throughout`
    );
  }
  // The old gate is gone, not merely bypassed.
  assert.ok(
    !/commerceSeams\.signIn/.test(code(read('src/components/layout/MobileNav.tsx'))),
    'the menu must not read a null seam to decide whether accounts exist'
  );
});

// ---------------------------------------------------------------------------
// 2. NO PRE-PREVIEW COMMERCIAL STEP
// ---------------------------------------------------------------------------
test('/trial is gone: no route, no component, no sitemap entry, no inbound link', () => {
  assert.ok(!fs.existsSync(path.join(ROOT, 'src/app/trial/page.tsx')), '/trial must not exist as a route');
  assert.ok(!fs.existsSync(path.join(ROOT, 'src/components/sections/BillingPeriodChoice.tsx')));
  assert.ok(!/"\/trial"/.test(read('src/app/sitemap.ts')), '/trial must not be advertised in the sitemap');
  for (const f of srcFiles()) {
    assert.ok(!/["']\/trial["']/.test(code(read(f))), `${f} still links to the removed billing step`);
  }
});

test('no first-time route asks for a billing period before a plan has been seen', () => {
  // The period is still chosen — it is what the subscription starts on — but
  // it happens after the preview, in the app. Nothing on the website may
  // collect it.
  for (const f of srcFiles()) {
    const src = code(read(f));
    assert.ok(!/type="radio"/.test(src), `${f} collects a choice the website no longer owns`);
    assert.ok(!/billing=\$\{|\?billing=/.test(src), `${f} still passes a billing preference between pages`);
  }
});

test('the journey gate exists, is off, and is the only thing deciding the deep link', () => {
  const j = code(read('src/content/journey.ts'));
  // OPEN, and verified before it was: app main 58b5fb0 runs builder ->
  // preview -> Save My Plan -> auth, and its pane-build mounts the app's
  // nine-stage builder (BLD_STAGES) rather than the old one-page form. The
  // shape of the gate is what still matters — one flag, one exported route.
  assert.match(j, /valueFirstLive:\s*true/);
  assert.match(j, /buildUrl: string = JOURNEY\.valueFirstLive \? appUrl : "\/start"/,
    'the gate must remain a single switch, so it can be closed again in one line');
  // It governs a route, not a claim. If it ever starts gating what the site
  // SAYS about the product, that belongs in PRODUCT_CLAIMS instead.
  assert.ok(!/claim|approved|publish/i.test(j.replace(/JOURNEY|valueFirstLive/g, '')));
});

// ---------------------------------------------------------------------------
// 3. NO PAYMENT, NO ENTITLEMENT — THE HARD BOUNDARY (carried over)
// ---------------------------------------------------------------------------
test('no payment provider, checkout or card-collection code exists anywhere in the app', () => {
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
  const files = srcFiles();
  for (const file of files) {
    const src = code(read(file));
    for (const rx of banned) {
      // See productionReadiness.test.js: the legal pack names Stripe as prose.
      if (file === 'src/content/legal.ts' && String(rx) === String(/\bstripe\b/i)) continue;
      assert.ok(!rx.test(src), `${file} introduces ${rx} — this journey is UX only, with no commerce`);
    }
  }
  assert.ok(files.length > 20, 'sanity: the walk actually found the source tree');
});

test('the seams are wired, and the website still owns nothing behind them', () => {
  // COMMERCIAL LAUNCH. trial.live is TRUE and the seams name real routes: the
  // flag follows whether a trial can be STARTED, and both of its conditions
  // are met -- charging is on in the app's environment, and public signup is
  // open now the private beta is retired.
  //
  // WHAT THE NULL SEAMS WERE ACTUALLY PROTECTING was authority, not silence,
  // and that is what is asserted now instead. A seam is allowed to name the
  // app's origin. It is not allowed to be a route the website serves itself,
  // because an account or a purchase resolved on this side of the link is one
  // resolved without the athlete's token, their entitlement or their
  // agreements.
  const commerce = code(read('src/content/commerce.ts'));
  assert.match(commerce, /live:\s*true/);
  assert.match(commerce, /createAccount:\s*appUrl/, 'the account seam must point at the app');
  assert.match(commerce, /signIn:\s*appSignInUrl/, 'the sign-in seam must point at the app');
  /* Every seam leaves this origin. A relative href here would be the website
     quietly becoming the account system. */
  for (const m of commerce.match(/(createAccount|signIn):[^,]+/g) || []) {
    assert.ok(!/["'`]\//.test(m), `a seam points at a website-local route: ${m}`);
  }
});

// ---------------------------------------------------------------------------
// 4. THE BETA DOOR IS UNTOUCHED (carried over)
// ---------------------------------------------------------------------------
test('the private beta entry still lives on /start and still points at the app', () => {
  const start = read('src/app/start/page.tsx');
  assert.match(start, /betaAccess\.cta\.href/, '/start still renders the beta CTA');
  assert.match(start, /betaAccess\.eyebrow/);
  const site = read('src/content/site.ts');
  assert.match(site, /velvet-viking-valhalla-1\.vercel\.app\/get/, 'the beta app URL must be unchanged');
  assert.match(site, /label: "Continue to Valhalla"/, 'the beta label is a separate lane and keeps its own words');
});

test('the beta lane is separate from the public one', () => {
  const site = code(read('src/content/site.ts'));
  const beta = site.slice(site.indexOf('export const betaAccess'), site.indexOf('export const pages'));
  assert.ok(!/buildCta|buildUrl|appSignInUrl/.test(beta), 'the beta door must not be folded into the public journey');
});

// ---------------------------------------------------------------------------
// 5. PRICING PAGE UNCHANGED WHERE IT MATTERS (carried over)
// ---------------------------------------------------------------------------
test('pricing still carries both approved prices', () => {
  const commerce = code(read('src/content/commerce.ts'));
  assert.match(commerce, /price:\s*\{\s*amount:\s*11\.99,\s*currency:\s*"GBP",\s*period:\s*"month"\s*\}/);
  assert.match(commerce, /priceAnnual:\s*\{\s*amount:\s*89\.99,\s*currency:\s*"GBP",\s*period:\s*"year"\s*\}/);
});

test('the pricing card offers one CTA per billing period, and no purchase controls', () => {
  /* WAS "EXACTLY ONE CTA", AND THE REASONING IS WORTH KEEPING RATHER THAN
     DELETING. Two buttons were refused on the grounds that they turn one
     product into a two-option checkout. That held while nothing could be
     bought: the choice had nowhere to go, so offering it twice was noise.
     At launch the athlete MUST choose a period before the trial starts, and
     choosing it here means choosing it once instead of being asked the same
     question again at the commercial step.

     WHAT THE TEST STILL GUARDS is the part that mattered: the card takes no
     payment and quotes no price of its own. Two links are not a checkout. */
  const card = code(read('src/components/sections/PricingCard.tsx'));
  assert.equal((card.match(/<CtaButton/g) || []).length, 2,
    'one CTA per billing period, and no more');
  assert.ok(!/<(select|input|form)\b/i.test(card), 'the card grew a purchase control');
  assert.ok(!/11\.99|89\.99/.test(card), 'prices come from content/commerce.ts');
  /* And still one product: the periods differ, the plan does not. */
  assert.equal((card.match(/plan\.features/g) || []).length, 1);
});

test('no savings, ranking or urgency framing entered the entry journey', () => {
  const surfaces = [
    'src/components/sections/PricingCard.tsx',
    'src/components/sections/Hero.tsx',
    'src/app/start/page.tsx',
    'src/content/site.ts',
    'src/content/commerce.ts',
    'src/content/journey.ts',
  ];
  const banned = [
    // "save" only in its COMPARATIVE sense — "save £54", "save 25%", "save
    // money". The bare word is legitimate English elsewhere and now appears
    // in the journey for a real reason: "Save it to your account" is the
    // approved name for the step where an athlete keeps their programme.
    // Banning the word outright would have forced that step to be renamed to
    // protect a test, which is backwards.
    /\bsave\s+(?:£|\$|\d|up to|over|money)/i, /\bsavings?\b/i, /best value/i, /most popular/i, /\bdiscount/i,
    /equivalent/i, /recommended/i, /limited offer/i, /line-through/i, /\bbuy now\b/i,
    /\b53\.89\b/, /\b143\.88\b/, /\b7\.[45][0-9]\b/,
  ];
  for (const file of surfaces) {
    const src = code(read(file));
    for (const rx of banned) {
      assert.ok(!rx.test(src), `${file} introduces ${rx} — the two periods stay uncompared`);
    }
  }
});
