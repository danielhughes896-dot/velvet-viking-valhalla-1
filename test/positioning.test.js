'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

// POSITIONING regression tests.
//
// The claim boundary this guards, from the Business review: a reasonable
// visitor must not come away thinking they are buying access to a qualified
// running coach, and must not come away thinking Valhalla is a static
// downloadable plan either. The public copy therefore describes what the
// product DOES — reads what happened, waits for a real pattern, adjusts when
// justified, leaves the decision with the athlete — and never asserts a
// professional credential.
//
// Source-level, matching this repo's existing test style: no build or server
// required. Marketing copy lives in content/site.ts and content/commerce.ts,
// but two public surfaces sit outside them and are checked explicitly —
// layout.tsx (the meta and Open Graph descriptions, which reach people who
// never open the site) and Hero.tsx (the one piece of visible copy still
// hard-coded in a component, which is exactly why an earlier config-only
// sweep missed a coach claim living there).
const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

// Same convention as publicMetadata.test.js and finalQaFixPass.test.js:
// explanatory "was X" comments in this codebase legitimately quote the old,
// wrong text — that is what stops it being reintroduced. Assertions about
// shipped content run with comments stripped.
const code = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

// Legal documents are deliberately NOT in scope. content/legal.ts uses
// "coaching data" and "coaching output" as defined terms for what the product
// produces, which is a drafting decision with contractual weight rather than a
// marketing claim, and it is the one file this pass was told to leave alone.
const PUBLIC_COPY_FILES = [
  'src/content/site.ts',
  'src/content/commerce.ts',
  'src/app/layout.tsx',
  'src/app/start/page.tsx',
  'src/components/sections/Hero.tsx',
  'src/components/sections/PricingCard.tsx',
];

test('no public-facing copy positions Valhalla as a coach or as coaching', () => {
  for (const file of PUBLIC_COPY_FILES) {
    const src = code(read(file));
    assert.ok(
      !/coach/i.test(src),
      `${file} reintroduces coach/coaching language into public copy — the product ` +
        `describes behaviour (reads training, waits for a pattern, adjusts when justified), ` +
        `not a professional credential. If a genuine need for this word appears, the claim ` +
        `boundary has to be re-decided, not this test edited.`
    );
  }
});

test('the widest-reach copy — meta and Open Graph descriptions — is free of coach language', () => {
  // These two strings are the search-result snippet and the link preview shown
  // wherever the site is pasted, so they reached people who never loaded a page.
  const layout = code(read('src/app/layout.tsx'));
  const descriptions = [...layout.matchAll(/description:\s*\n?\s*"([^"]+)"/g)].map((m) => m[1]);
  assert.ok(descriptions.length >= 2, 'sanity: the metadata descriptions were not found');
  for (const d of descriptions) {
    assert.ok(!/coach/i.test(d), `metadata description still claims coaching: "${d}"`);
  }
});

test('the hero category line states a behaviour, not a credential', () => {
  const hero = code(read('src/components/sections/Hero.tsx'));
  assert.ok(
    !/Coached With Intent/i.test(hero),
    'the "Endurance Performance, Coached With Intent" brand line must not return'
  );
});

test('the copy still asserts the product is not a static plan', () => {
  // The other half of the claim boundary. If the coach language were stripped
  // without this, the site would read as a plain downloadable training plan.
  const site = code(read('src/content/site.ts'));
  for (const claim of [
    /not a plan that forgets you/,
    /waits for a real pattern before it changes anything/i,
    /shouldn’t go stale the moment real training starts/,
  ]) {
    assert.match(site, claim, `the "not a static plan" side of the positioning lost: ${claim}`);
  }
});

test('protected brand language survived the positioning pass', () => {
  const site = read('src/content/site.ts');
  for (const phrase of [
    'Earn Your Place',
    'Valhalla Awaits',
    'Consistency Compounds',
    'The Flagship',
    'Not punishment. Not luck.',
  ]) {
    assert.ok(site.includes(phrase), `protected brand language missing: "${phrase}"`);
  }
});

// ---------------------------------------------------------------------------
// PRICING — TWO EQUAL BILLING PERIODS, NO COMPARATIVE FRAMING
// ---------------------------------------------------------------------------
test('Standard carries both a monthly and an annual price', () => {
  const commerce = code(read('src/content/commerce.ts'));
  assert.match(commerce, /price:\s*\{\s*amount:\s*11\.99,\s*currency:\s*"GBP",\s*period:\s*"month"\s*\}/);
  assert.match(commerce, /priceAnnual:\s*\{\s*amount:\s*89\.99,\s*currency:\s*"GBP",\s*period:\s*"year"\s*\}/);
});

test('no savings, discount or urgency framing is stored or rendered anywhere in the pricing surface', () => {
  // The arithmetic that would produce a savings claim is recorded only in a
  // source comment, deliberately out of the UI's reach. At the final approved
  // prices that is 11.99 x 12 = 143.88 annualised, 53.89 more than the 89.99
  // annual price, and an effective 7.50 a month. None of those three numbers
  // may appear in shipped code.
  const banned = [
    /\bsave\b/i,
    /\bsavings?\b/i,
    /best value/i,
    /most popular/i,
    /\bdiscount/i,
    /equivalent/i,
    /line-through/i,
    /\b53\.89\b/,
    /\b143\.88\b/,
    /\b7\.[45][0-9]\b/,
  ];
  for (const file of ['src/components/sections/PricingCard.tsx', 'src/content/commerce.ts']) {
    const src = code(read(file));
    for (const rx of banned) {
      assert.ok(!rx.test(src), `${file} introduces comparative pricing framing: ${rx}`);
    }
  }
});

test('both prices render through the same markup, so neither can be styled as subordinate', () => {
  // Two hand-written price blocks could drift apart in size or weight later;
  // one mapped block cannot.
  const card = code(read('src/components/sections/PricingCard.tsx'));
  assert.match(card, /priceOptions\s*=\s*\[plan\.price,\s*plan\.priceAnnual\]/);
  assert.match(card, /priceOptions\.map\(/);
});

test('adding a second price added no purchase behaviour', () => {
  const commerce = code(read('src/content/commerce.ts'));
  // Every commercial action stays gated on these, exactly as before.
  assert.match(commerce, /live:\s*false/, 'trial.live must stay false until billing is real');
  assert.match(commerce, /createAccount:\s*null/);
  assert.match(commerce, /signIn:\s*null/);

  const card = code(read('src/components/sections/PricingCard.tsx'));
  assert.ok(
    !/<(select|input|form)\b/i.test(card),
    'no billing-period control may be offered while there is nowhere to submit it'
  );
});

// ---------------------------------------------------------------------------
// THE LEARNING PROPOSITION — the primary hook, and the claims around its edges
// ---------------------------------------------------------------------------
test('the primary hook is the learning proposition, not a coaching credential', () => {
  const site = code(read('src/content/site.ts'));
  const hero = site.slice(site.indexOf('export const hero'), site.indexOf('export const brandStory'));
  assert.match(hero, /Training that learns how you train/,
    'the hero must lead with what compounds, not with attentiveness');
  assert.match(hero, /the better it understands how you respond/);
  // The whole point of choosing "learns" over "coach".
  assert.ok(!/coach/i.test(hero));
});

test('the meta and Open Graph descriptions carry the same proposition, verbatim', () => {
  // They are the search snippet and the link preview, so they reach people who
  // never load a page. They drifted from the hero once before.
  const layout = code(read('src/app/layout.tsx'));
  const site = code(read('src/content/site.ts'));
  const heroLine = /Training that learns how you train\. The longer you run with Valhalla, the better it understands how you respond\./;
  assert.match(site, heroLine);
  // Counting needs the global flag — a non-global match returns one result no
  // matter how many times the string occurs, which made this pass-by-accident
  // in either direction.
  const both = new RegExp(heroLine.source, 'g');
  assert.equal((layout.match(both) || []).length, 2, 'meta and og:description must both match the hero line');
});

test('the learning claim does not overreach', () => {
  const files = ['src/content/site.ts', 'src/app/layout.tsx', 'src/content/commerce.ts'];
  const banned = [
    /knows everything about you/i,
    /understands your body/i,
    /medical/i,
    /diagnos/i,
    /guarantee[sd]? (a )?(personal best|pb|performance|result)/i,
    /\bthe only\b/i,
    /replaces? (a|your) coach/i,
    /like having a coach/i,
    /\bAI coach\b/i,
  ];
  for (const f of files) {
    const src = code(read(f));
    for (const rx of banned) {
      assert.ok(!rx.test(src), `${f} overreaches on the learning claim: ${rx}`);
    }
  }
});

test('the year-round lifecycle is published and says the athlete chooses', () => {
  const claims = code(read('src/content/productClaims.ts'));
  assert.match(claims, /yearRoundCoaching:\s*true/);
  const site = code(read('src/content/site.ts'));
  const yr = site.slice(site.indexOf('export const yearRound'), site.indexOf('export const futureWorld'));
  for (const stage of ['Race Build', 'Race', 'Recovery', 'Maintain, Base or Speed', 'Next Goal']) {
    assert.ok(yr.includes(stage), `the lifecycle is missing "${stage}"`);
  }
  // No forced transitions: app main is explicit that the athlete decides.
  assert.match(yr, /You choose when to move on\. Valhalla does not decide it for you\./);
  assert.match(yr, /you can pick none/i);
  assert.match(code(read('src/components/sections/YearRound.tsx')), /yearRound\.footnote/,
    'the "athlete chooses" line must actually render');
});

test('the gated claims that remain gated', () => {
  const claims = code(read('src/content/productClaims.ts'));
  assert.match(claims, /garminIntegration:\s*false/, 'Garmin is still not available');
  const legal = code(read('src/content/legal.ts'));
  assert.match(legal, /foundingPriceLock:\s*false/, 'the public founding-price claim is not approved');
  assert.match(legal, /subscriptionPause:\s*false/, 'there is no athlete-facing pause trigger yet');
  assert.match(legal, /terms:\s*false/);
  assert.match(legal, /cookies:\s*false/);
  assert.match(legal, /privacyCommercial:\s*false/);
  assert.match(code(read('src/content/commerce.ts')), /live:\s*false/);
});
