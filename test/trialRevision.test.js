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
const trialRevisionIsLive = () =>
  /live:\s*true/.test(constBlock(code(read('src/content/commerce.ts')), 'trialRevision'));

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
// TRIAL_REVISION_LEGAL_AMENDMENT in content/legal.ts — because the app still runs
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
  const start = legal.indexOf('export const TRIAL_REVISION_LEGAL_AMENDMENT');
  const end = legal.indexOf('export const termsDraft');
  assert.ok(start > -1 && end > start, 'the amendment object must exist, above termsDraft');
  const documents = legal.slice(0, start) + legal.slice(end);

  const amendment = legal.slice(start, end);
  const quoted = [
    ...[...amendment.matchAll(/replaces:\s*\n?\s*"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]),
    ...[...amendment.matchAll(/remove:\s*\n?\s*"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]),
    ...[...amendment.matchAll(/replacesHeading:\s*\n?\s*"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]),
  ];
  /* THREE, NOT FIVE. Earlier drafts of this amendment rewrote section 7,
     section 8 and three Privacy clauses as well, because they changed the
     card and the conversion. With both unchanged, what is left is one
     sentence and two lengths. The floor is the real number — raising it
     would demand changes nobody wants, and removing it would let an empty
     amendment pass. */
  assert.ok(quoted.length >= 3, `expected the amendment to quote the clauses it changes, found ${quoted.length}`);

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
  const start = legal.indexOf('export const TRIAL_REVISION_LEGAL_AMENDMENT');
  const end = legal.indexOf('export const termsDraft');
  const documents = legal.slice(0, start) + legal.slice(end);

  const amendment = legal.slice(start, end);
  /* ANCHORED ON THE KEY, NOT THE WORD. This sliced from the first mention of
     "mustNotChange" anywhere in the object — and a comment above
     termsLengthEdits says "neither is the statutory right — see
     mustNotChange". So the slice began forty lines early and swept up the
     length edits' replacement text as though it were protected, then failed
     because a sentence the amendment deliberately rewrites is, of course,
     not in the document unchanged. */
  const protectedSection = amendment.slice(
    amendment.indexOf('mustNotChange: ['),
    amendment.indexOf('openQuestions: [')
  );
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
test('the trial revision is gated off, and does not redeclare what it leaves alone', () => {
  const commerce = code(read('src/content/commerce.ts'));
  const block = constBlock(commerce, 'trialRevision');
  assert.ok(block, 'the trialRevision model must exist');
  assert.match(block, /live:\s*false/, 'trialRevision.live must be false until the app behaves this way');

  /* TWO SEVENS, AND THEY ARE DIFFERENT NUMBERS — how long the trial lasts,
     and how much of the block is shown during it. They coincide today, which
     is exactly why both are asserted: deriving one from the other would hide
     the day they diverge. */
  assert.match(block, /days:\s*7/, 'the trial is seven days long');
  assert.match(block, /horizonDays:\s*7/, 'and seven days of the block are visible during it');

  /* THE REVISION MUST NOT RESTATE THE MACHINERY IT DOES NOT CHANGE. The card
     is still taken up front and the subscription still converts by itself —
     founder: "No I want the card to start." Those facts live in `trial`, and
     a second copy here would be a second place for them to drift. Two
     earlier passes built this object as a rival commercial model with its
     own cardRequired and autoConverts, and both were wrong about them. */
  for (const field of ['cardRequired', 'autoConverts', 'expires', 'periodChosenUpfront']) {
    assert.ok(
      !new RegExp(`${field}:`).test(block),
      `trialRevision redeclares ${field} — it is unchanged, and belongs only in \`trial\``
    );
  }
  const live = constBlock(commerce, 'trial');
  assert.match(live, /cardRequired:\s*true/, 'the card is still taken up front');
  assert.match(live, /autoConverts:\s*true/, 'and the subscription still converts by itself');
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
      !/trialRevisionCopy|freeTrial\./.test(src),
      `${f} reads the free-trial model, which is not live — see trialRevision.live in content/commerce.ts`
    );
  }
});

// ---------------------------------------------------------------------------
// 3. THE TRIPWIRE: FLIPPING THE FLAG WITHOUT THE REST
// ---------------------------------------------------------------------------
test('the revision cannot go live while the Terms still promise the old trial', () => {
  /* THIS IS THE ONE THAT MATTERS. Flipping freeTier.live is a single
     character, and it would put "free, nothing to cancel, nothing taken" on a
     site whose own Terms — one click away, on the same domain — promise a
     14-day card-required trial that converts automatically. That is not an
     inconsistency a reader forgives; it is two different contracts.

     So the flag is tied to the document. If the free tier is live, the
     published Terms must no longer describe a trial, and the amendment must
     have been applied rather than left sitting in the file. */
  if (!trialRevisionIsLive()) return;

  const legal = read('src/content/legal.ts');
  const start = legal.indexOf('export const TRIAL_REVISION_LEGAL_AMENDMENT');
  const end = legal.indexOf('export const termsDraft');
  const documents = legal.slice(0, start) + legal.slice(end);

  assert.ok(
    !/New subscribers are offered a 14-day free trial/.test(documents),
    'the revision is live while the published Terms still offer a 14-day trial'
  );
  assert.ok(
    !/Nothing is held back for paying subscribers/.test(documents),
    'the revision holds the block back — the Terms must not promise otherwise'
  );
  assert.match(
    code(legal),
    /commercialVersion: "commercial_terms_v3"/,
    'a changed contract needs a new identifier, not an edited one'
  );
});

test('when the revision goes live, the live trial must already carry its numbers', () => {
  /* THIS TRIPWIRE USED TO SAY THE WRONG THING. It asserted that if the new
     model went live the old one must be switched off — correct while the two
     were rival commercial models, and wrong now. The founder settled it as a
     REVISION: the card is still taken, the subscription still converts,
     commerce stays live. There is no second model to switch off.

     What has to be true instead is that flipping the flag is the LAST step,
     not the first: by then `trial` itself carries the revised numbers, and
     this object has done its job. A revision that is live while the thing it
     revises still says fourteen days is just two numbers disagreeing. */
  if (!trialRevisionIsLive()) return;

  const commerce = code(read('src/content/commerce.ts'));
  const live = constBlock(commerce, 'trial');
  const revision = constBlock(commerce, 'trialRevision');

  const want = /days:\s*(\d+)/.exec(revision);
  const got = /days:\s*(\d+)/.exec(live);
  assert.ok(want && got, 'both the trial and its revision must state a length');
  assert.equal(
    got[1],
    want[1],
    `the revision is live at ${want[1]} days while the trial still says ${got[1]}`
  );

  assert.match(live, /horizonDays:/, 'the live trial must carry the seven-day view the revision adds');
  // Commerce stays on. A revision does not close the tills.
  assert.match(live, /live:\s*true/, 'the trial itself must still be live — this is a revision, not a retreat');
});

// ---------------------------------------------------------------------------
// 4. WHAT THE WORDING MUST NOT DO
// ---------------------------------------------------------------------------
test('the revised copy keeps the card and the conversion, and states the limit', () => {
  /* THIS TEST HAS NOW BEEN WRONG TWICE, which is the point of leaving the
     history in it. Read as a permanent free tier, it banned the word "trial"
     and anything resembling a countdown. Read as a card-free trial, it
     required the countdown and banned permanence. The founder settled it:
     "No I want the card to start." The card is taken up front and the
     subscription converts automatically, exactly as the live model does —
     so the copy's job is to say the two things that actually changed and to
     keep saying the two that did not. */
  const commerce = read('src/content/commerce.ts');
  const start = commerce.indexOf('export const trialRevisionCopy');
  const end = commerce.indexOf('export const trial = {');
  assert.ok(start > -1 && end > start, 'trialRevisionCopy must exist, above the trial it revises');
  const copy = code(commerce.slice(start, end));

  // The most damaging sentence available here. A reader who believes no card
  // is involved has not understood that a subscription begins a week later.
  for (const rx of [/no card/i, /card.free/i, /without a card/i, /no payment (method|details) (needed|required)/i]) {
    assert.ok(!rx.test(copy), `the copy matches ${rx} — the card is taken before the trial starts`);
  }
  // Nor may it promise a free period that does not end.
  for (const rx of [/\balways\b/i, /\bstays free\b/i, /\bforever\b/i, /\bunlimited\b/i]) {
    assert.ok(!rx.test(copy), `the copy matches ${rx}, which promises a free period that does not end`);
  }
  // It must keep the conversion explicit — the sentence the model rests on.
  assert.match(copy, /automatically/i, 'the copy must say the subscription starts by itself');
  assert.match(copy, /cancel/i, 'and that cancelling is what stops it');
  // And it must name the new limit, as what the subscription adds.
  assert.match(copy, /days of your (training )?block/i, 'the copy must state the seven-day view');
  assert.match(copy, /whole of it|whole block/i, 'and that subscribing shows the whole block');
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
