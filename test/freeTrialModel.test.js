const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const code = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

/* A LAZY [\s\S]*? DOES NOT STOP AT A CLOSING BRACE, which is how the first
   version of the two tripwires below reported the free tier as live while it
   was not: /freeTier = \{[\s\S]*?live:\s*true/ ran straight past the end of
   freeTier and matched `trial.live: true` further down the file. A tripwire
   that fires on the wrong object is worse than none, so the block is cut out
   by its own terminator first and searched on its own. */
const constBlock = (src, name) => {
  const start = src.indexOf(`export const ${name} = {`);
  if (start === -1) return '';
  const end = src.indexOf('} as const;', start);
  return end === -1 ? '' : src.slice(start, end);
};
const freeTrialIsLive = () =>
  /live:\s*true/.test(constBlock(code(read('src/content/commerce.ts')), 'freeTrial'));

// THE 7-DAY FREE TRIAL: DECIDED, DRAFTED, AND NOT YET TRUE.
//
// Founder: "I think it should be 7 days free trial. And when they sign up for
// free all data after 7 days is hidden. Then when they pay they see the full
// data." Then, correcting a first reading of that as a permanent free tier:
// "Just a single 7 days. Then it ends. But a user can only see 7 days."
//
// So: one seven-day period per account, no card, showing seven days of the
// block, ending rather than converting.
//
// WHAT THIS FILE IS FOR. The model is written down in two places that cannot
// yet be published — `freeTier`/`freeTierCopy` in content/commerce.ts and
// FREE_TRIAL_LEGAL_AMENDMENT in content/legal.ts — because the app still runs
// the opposite product. Writing a commercial model down and not shipping it
// is exactly the state in which things go wrong quietly: the draft rots
// against the live document, or somebody flips the flag and the copy is
// stale. These are the tripwires for both.

// ---------------------------------------------------------------------------
// 1. THE AMENDMENT POINTS AT TEXT THAT ACTUALLY EXISTS
// ---------------------------------------------------------------------------
test('every clause the amendment replaces is present, verbatim, in the live documents', () => {
  /* An amendment that quotes a sentence the contract does not contain is
     worse than no amendment: it reads as precise and applies to nothing. The
     published Terms and Privacy policy are edited by other passes for other
     reasons, so the quoted text has to be checked rather than trusted. */
  const legal = read('src/content/legal.ts');

  // The amendment's own quotations are inside the object, so strip it out
  // before searching — otherwise every string trivially finds itself.
  const start = legal.indexOf('export const FREE_TRIAL_LEGAL_AMENDMENT');
  const end = legal.indexOf('export const termsDraft');
  assert.ok(start > -1 && end > start, 'the amendment object must exist, above termsDraft');
  const documents = legal.slice(0, start) + legal.slice(end);

  const amendment = legal.slice(start, end);
  const quoted = [
    ...[...amendment.matchAll(/replaces:\s*\n?\s*"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]),
    ...[...amendment.matchAll(/remove:\s*\n?\s*"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]),
    ...[...amendment.matchAll(/replacesHeading:\s*\n?\s*"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]),
  ];
  assert.ok(quoted.length >= 5, `expected the amendment to quote the clauses it changes, found ${quoted.length}`);

  for (const q of quoted) {
    assert.ok(
      documents.includes(q),
      `the amendment replaces a clause that is not in the live documents:\n  ${q.slice(0, 90)}…`
    );
  }
});

test('the lines the amendment protects are still in the documents it protects them in', () => {
  /* mustNotChange exists because the trial length and a statutory right are
     both written as "14 days" in this file, a few lines apart. One is a
     commercial decision the founder may change at will; the other is the
     consumer's right to cancel a distance contract, which is law. A careless
     find-and-replace of "14" would have shortened the right to seven. */
  const legal = read('src/content/legal.ts');
  const start = legal.indexOf('export const FREE_TRIAL_LEGAL_AMENDMENT');
  const end = legal.indexOf('export const termsDraft');
  const documents = legal.slice(0, start) + legal.slice(end);

  const amendment = legal.slice(start, end);
  const protectedSection = amendment.slice(amendment.indexOf('mustNotChange'), amendment.indexOf('openQuestions'));
  const lines = [...protectedSection.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]).filter((s) => s.length > 40);
  assert.ok(lines.length >= 2, 'mustNotChange must name the lines it protects');

  for (const line of lines) {
    assert.ok(documents.includes(line), `a protected line has been altered or removed:\n  ${line.slice(0, 90)}…`);
  }

  // And the statutory right specifically, by its own words rather than by
  // whatever the amendment happens to quote.
  assert.match(
    documents,
    /statutory right to change your mind about a contract bought at a distance, within 14 days/,
    'the 14-day distance-selling right must not be shortened with the trial'
  );
});

// ---------------------------------------------------------------------------
// 2. THE MODEL IS NOT LIVE, AND NOTHING DESCRIBES IT YET
// ---------------------------------------------------------------------------
test('the free trial is gated off, and the site still describes the product the app runs', () => {
  const commerce = code(read('src/content/commerce.ts'));
  const block = constBlock(commerce, 'freeTrial');
  assert.ok(block, 'the freeTrial model must exist');
  assert.match(block, /live:\s*false/, 'freeTrial.live must be false until the app behaves this way');

  /* TWO SEVENS, AND THEY ARE DIFFERENT NUMBERS — how long the free period
     lasts, and how much of the block is shown during it. They coincide
     today, which is exactly why both are asserted: deriving one from the
     other would hide the day they diverge. */
  assert.match(block, /days:\s*7/, 'the free period is seven days long');
  assert.match(block, /horizonDays:\s*7/, 'and seven days of the block are visible during it');

  assert.match(block, /cardRequired:\s*false/);
  assert.match(block, /autoConverts:\s*false/, 'it ends rather than becoming a subscription');
  assert.match(block, /expires:\s*true/, 'it is a trial with a last day, not a permanent free tier');
  assert.match(block, /onePerAccount:\s*true/, '"just a single 7 days"');

  // COMMERCIAL_MODEL is the single branch every surface would read.
  assert.match(commerce, /COMMERCIAL_MODEL: "freeTrial" \| "cardTrial"/);
});

test('no rendered surface describes the free trial while it is gated off', () => {
  /* freeTierCopy is written early on purpose — the wording is the part worth
     reviewing before the engineering lands. The risk of writing copy that
     nothing renders is that something starts rendering it. Until the flag
     flips, no component may read it. */
  const files = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = `${dir}/${e.name}`;
      if (e.isDirectory()) walk(rel);
      else if (/\.tsx?$/.test(e.name)) files.push(rel);
    }
  };
  walk('src');

  for (const f of files) {
    if (f === 'src/content/commerce.ts') continue;
    const src = code(read(f));
    assert.ok(
      !/freeTrialCopy|freeTrial\./.test(src),
      `${f} reads the free-trial model, which is not live — see freeTrial.live in content/commerce.ts`
    );
  }
});

// ---------------------------------------------------------------------------
// 3. THE TRIPWIRE: FLIPPING THE FLAG WITHOUT THE REST
// ---------------------------------------------------------------------------
test('the free trial cannot go live while the Terms still promise the old one', () => {
  /* THIS IS THE ONE THAT MATTERS. Flipping freeTier.live is a single
     character, and it would put "free, nothing to cancel, nothing taken" on a
     site whose own Terms — one click away, on the same domain — promise a
     14-day card-required trial that converts automatically. That is not an
     inconsistency a reader forgives; it is two different contracts.

     So the flag is tied to the document. If the free tier is live, the
     published Terms must no longer describe a trial, and the amendment must
     have been applied rather than left sitting in the file. */
  if (!freeTrialIsLive()) return;

  const legal = read('src/content/legal.ts');
  const start = legal.indexOf('export const FREE_TRIAL_LEGAL_AMENDMENT');
  const end = legal.indexOf('export const termsDraft');
  const documents = legal.slice(0, start) + legal.slice(end);

  assert.ok(
    !/New subscribers are offered a 14-day free trial/.test(documents),
    'the free trial is live while the published Terms still offer a 14-day trial'
  );
  assert.ok(
    !/Nothing is held back for paying subscribers/.test(documents),
    'the free trial holds the block back — the Terms must not promise otherwise'
  );
  assert.match(
    code(legal),
    /commercialVersion: "commercial_terms_v3"/,
    'a changed contract needs a new identifier, not an edited one'
  );
});

test('the free trial cannot go live while the card trial is still being advertised', () => {
  /* The two models are mutually exclusive: one takes a card up front and
     converts, the other takes nothing and never does. Whichever is live, the
     other must be silent — a page describing both is a page a reader cannot
     act on. */
  if (!freeTrialIsLive()) return;

  const commerce = code(read('src/content/commerce.ts'));
  assert.ok(
    !/live:\s*true/.test(constBlock(commerce, 'trial')),
    'both commercial models are switched on at once'
  );
  for (const f of ['src/components/sections/TrialTerms.tsx', 'src/components/sections/PricingCard.tsx']) {
    assert.ok(
      !/trial\.days/.test(code(read(f))),
      `${f} still renders the old trial length while the free trial is live`
    );
  }
});

// ---------------------------------------------------------------------------
// 4. WHAT THE WORDING MUST NOT DO
// ---------------------------------------------------------------------------
test('the free-trial copy says it ends, and never promises permanence', () => {
  /* THIS TEST USED TO ASSERT THE OPPOSITE, and that is worth leaving on the
     record. The first reading of the founder's message modelled a permanent
     free tier, so this guard banned the word "trial" and banned anything that
     sounded like a countdown. The founder corrected it — "Just a single 7
     days. Then it ends" — and every one of those banned words became
     required. Copy that hid the ending would have been the most damaging
     possible error here: an athlete planning around an account that does not
     exist, told so by the page that took their email. */
  const commerce = read('src/content/commerce.ts');
  const start = commerce.indexOf('export const freeTrialCopy');
  const end = commerce.indexOf('export const trial');
  assert.ok(start > -1 && end > start, 'freeTrialCopy must exist, above the trial it replaces');
  const copy = code(commerce.slice(start, end));

  // It must not promise permanence in any of the ways that read as a promise.
  for (const rx of [/\balways\b/i, /\bstays free\b/i, /\bforever\b/i, /\bnever expires?\b/i, /\bunlimited\b/i]) {
    assert.ok(!rx.test(copy), `the copy matches ${rx}, which promises a free period that does not end`);
  }
  // And it must say, in the copy itself, that it ends.
  assert.match(copy, /\bends\b/i, 'the copy must state that the free period ends');
  // Paying must be described by what it actually does.
  assert.match(copy, /whole block/i, 'the copy must say that subscribing shows the whole block');
  // No urgency framing, same restraint the prices are held to.
  for (const rx of [/\bhurry\b/i, /\bdon.t miss\b/i, /\blimited time\b/i, /\bact now\b/i]) {
    assert.ok(!rx.test(copy), `the copy matches ${rx}, which is urgency framing`);
  }
});

// ---------------------------------------------------------------------------
// 5. THE LENGTH THE SITE CLAIMS IS THE LENGTH THE APP GIVES
// ---------------------------------------------------------------------------
const APP = path.join(ROOT, '..', 'velvet-viking-valhalla-2');
const appPresent = fs.existsSync(path.join(APP, 'api', '_products.js'));

test('the trial length on the site matches the one the app charges on', {
  skip: !appPresent && 'app checkout not present',
}, () => {
  /* NOTHING CHECKED THIS, AND IT IS THE LIVE RISK RIGHT NOW. The site tells a
     visitor how many free days they get; api/_products.js is what Stripe and
     the entitlement system actually use. They agree today at fourteen, and
     they are about to be changed by two different people in two different
     repositories — the founder has asked for seven. Whichever moves first,
     the other is a false commercial claim on a site with live prices behind
     it, and the only reason this is catchable is that both repositories are
     checked out side by side.

     IT GUARDS THE AGREEMENT, NOT THE NUMBER. Change both to 7 and it passes.
     Change one and it fails, naming which. */
  const products = fs.readFileSync(path.join(APP, 'api', '_products.js'), 'utf8');
  const m = /const TRIAL_DAYS\s*=\s*(\d+)/.exec(products);
  assert.ok(m, "the app's TRIAL_DAYS could not be read — this guard has gone blind");
  const appDays = Number(m[1]);

  const commerce = code(read('src/content/commerce.ts'));
  const t = /days:\s*(\d+)/.exec(constBlock(commerce, 'trial'));
  assert.ok(t, 'the site no longer states a trial length');
  const siteDays = Number(t[1]);

  assert.equal(
    siteDays,
    appDays,
    `the site offers a ${siteDays}-day trial and the app charges on day ${appDays}. ` +
      'Change api/_products.js TRIAL_DAYS and content/commerce.ts trial.days together, or neither.'
  );
});
