const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const code = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

// Every surface that talks to an athlete about the trial. Comments are stripped
// before matching, because several of these files legitimately quote the older,
// weaker wording while explaining why it changed.
const TRIAL_SURFACES = [
  'src/content/site.ts',
  'src/content/commerce.ts',
  'src/app/start/page.tsx',
  'src/app/trial/page.tsx',
  'src/components/sections/BillingPeriodChoice.tsx',
  'src/components/sections/PricingCard.tsx',
];

// ---------------------------------------------------------------------------
// 1. THE AUTHORISED MODEL, AS FACTS
// ---------------------------------------------------------------------------
test('the trial config states card up front, period up front and auto-conversion', () => {
  const c = code(read('src/content/commerce.ts'));
  assert.match(c, /days:\s*14/);
  assert.match(c, /cardRequired:\s*true/, 'a payment method is required before the trial');
  assert.match(c, /periodChosenUpfront:\s*true/, 'monthly or annual is chosen before the trial');
  assert.match(c, /autoConverts:\s*true/, 'the subscription starts by itself unless cancelled');
});

// ---------------------------------------------------------------------------
// 2. THE FOUR THINGS THE SITE MUST NEVER IMPLY
// ---------------------------------------------------------------------------
test('no surface implies the trial is card-free', () => {
  for (const f of TRIAL_SURFACES) {
    const src = code(read(f));
    for (const rx of [/no card/i, /card.free/i, /without a card/i, /no payment (method|details) (needed|required)/i,
      /free trial, no card/i]) {
      assert.ok(!rx.test(src), `${f} matches ${rx} — the authorised model requires a card up front`);
    }
  }
});

test('no surface implies payment details are collected only after the trial', () => {
  for (const f of TRIAL_SURFACES) {
    const src = code(read(f));
    for (const rx of [/card (will be )?required (when|after|once) /i, /add (your )?(card|payment method) (after|when the trial|once the trial)/i,
      /pay (at the end|after the trial)/i]) {
      assert.ok(!rx.test(src), `${f} matches ${rx} — the card is taken before the trial starts`);
    }
  }
});

test('no surface implies a manual purchase is needed after the trial', () => {
  for (const f of TRIAL_SURFACES) {
    const src = code(read(f));
    for (const rx of [/choose whether to continue/i, /decide (later|afterwards) whether to (buy|subscribe)/i,
      /upgrade (when|after) the trial/i, /then decide if/i]) {
      assert.ok(!rx.test(src), `${f} matches ${rx} — conversion is automatic, not a later purchase`);
    }
  }
});

test('no surface implies cancellation is unnecessary to avoid being charged', () => {
  // The trap is a sentence that stops after "you won't be charged during the
  // trial" and never says what happens next. Wherever the site says the trial
  // is free, the same surface must also say the subscription starts unless it
  // is cancelled.
  for (const f of ['src/components/sections/PricingCard.tsx', 'src/components/sections/BillingPeriodChoice.tsx']) {
    const src = code(read(f));
    if (!/free trial|trial is free/i.test(src)) continue;
    assert.match(src, /unless you cancel|Cancel before/i,
      `${f} describes the free trial without stating that it converts unless cancelled`);
    assert.match(src, /starts automatically|automatically/i,
      `${f} must say the subscription begins by itself`);
  }
});

test('no surface implies the trial can be taken without choosing a period', () => {
  const start = code(read('src/app/start/page.tsx'));
  const steps = start.slice(start.indexOf('const steps'), start.indexOf('];', start.indexOf('const steps')));
  assert.match(steps, /Choose monthly or annual/i, 'the period choice must be an explicit step');
  // ...and it must come before the trial begins.
  assert.ok(
    steps.indexOf('Choose monthly or annual') < steps.indexOf('free trial starts'),
    'the period is chosen BEFORE the trial starts, so it must be the earlier step'
  );
});

// ---------------------------------------------------------------------------
// 3. THE JOURNEY ORDER: PROGRAMME BEFORE PAYMENT
// ---------------------------------------------------------------------------
test('the programme is shown before any payment method is asked for', () => {
  const start = code(read('src/app/start/page.tsx'));
  const steps = start.slice(start.indexOf('const steps'), start.indexOf('];', start.indexOf('const steps')));
  const programme = steps.indexOf('builds your programme');
  const payment = steps.indexOf('payment method');
  assert.ok(programme > -1 && payment > -1, 'both steps must exist');
  assert.ok(programme < payment,
    'the athlete sees the programme before paying — stating it the other way round would misdescribe the product');
});

test('/start never quotes only the monthly price for a choice that may be annual', () => {
  const start = code(read('src/app/start/page.tsx'));
  if (!/price\.amount/.test(start)) return;
  assert.match(start, /priceAnnual\.amount/,
    'this page is static and cannot know the chosen period, so it must name both prices or neither');
});

// ---------------------------------------------------------------------------
// 4. COMMERCIAL COPY ONLY — NO INVENTED CONTRACTUAL TERMS
// ---------------------------------------------------------------------------
test('no refund, notice-period or guarantee wording is fabricated', () => {
  for (const f of TRIAL_SURFACES) {
    const src = code(read(f));
    for (const rx of [/refund/i, /money.back/i, /guarantee/i, /pro.rata/i, /cooling.off/i,
      /no questions asked/i, /cancel any ?time/i]) {
      assert.ok(!rx.test(src),
        `${f} matches ${rx} — contractual terms are gated until HQ supplies approved wording`);
    }
  }
});

test('the legal gates are untouched and commerce stays fail-closed', () => {
  const legal = code(read('src/content/legal.ts'));
  assert.match(legal, /terms:\s*false/, 'Terms must remain unapproved');
  assert.match(legal, /cookies:\s*false/, 'Cookies must remain unapproved');
  assert.match(code(read('src/content/commerce.ts')), /live:\s*false/);
});
