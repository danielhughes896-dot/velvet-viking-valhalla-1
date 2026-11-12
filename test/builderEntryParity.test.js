const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

// THE BUILDER ENTRY MUST NOT DRIFT FROM THE APP'S.
//
// /start is the app's stage 01 now, which means this repo has started making
// a promise it cannot keep on its own: that the questions, their order and
// their wording are the app's. The whole reason content/vendor/builder-spec.js
// is a VENDORED COPY of the app's assets/builder-spec.js rather than eleven
// stage names retyped into a TypeScript literal is so that promise is
// checkable by diff instead of by a human comparing two screens.
//
// TWO LEVELS, BECAUSE ONLY ONE OF THEM IS ALWAYS AVAILABLE.
//
//   WHEN THE APP IS CHECKED OUT BESIDE THIS REPO — which it is in the
//   environment this work is done in — the vendored file is diffed against
//   the real one byte for byte, and the three orientation rows are checked
//   against the markup start.html actually renders. That is the real guard.
//
//   WHEN IT IS NOT — CI for this repo alone — the shape the website depends
//   on is asserted instead: eleven stages, OVERVIEW first, and the exact
//   heading and lede the screen prints. That cannot catch a change made in
//   the app, and it is not pretended that it can. What it does catch is this
//   repo quietly editing its own copy, which is the failure mode a vendored
//   file actually has.
const APP = path.join(ROOT, '..', 'velvet-viking-valhalla-2');
const appPresent = fs.existsSync(path.join(APP, 'assets', 'builder-spec.js'));

test('the vendored spec is the app spec, byte for byte', { skip: !appPresent && 'app checkout not present' }, () => {
  const mine = read('src/content/vendor/builder-spec.js');
  const theirs = fs.readFileSync(path.join(APP, 'assets', 'builder-spec.js'), 'utf8');
  assert.equal(
    mine,
    theirs,
    'content/vendor/builder-spec.js has drifted from the app — re-copy it rather than editing it here'
  );
});

test('the orientation rows match the markup the app renders', { skip: !appPresent && 'app checkout not present' }, () => {
  const start = fs.readFileSync(path.join(APP, 'start.html'), 'utf8');
  const fn = start.slice(start.indexOf('function renderOverviewStage'));
  const body = fn.slice(0, fn.indexOf('\n  }'));

  // The app writes them as <span class="bor-t">title</span><span
  // class="bor-d">detail</span> pairs inside renderOverviewStage().
  const titles = [...body.matchAll(/class="bor-t">([^<]+)</g)].map((m) => m[1]);
  const details = [...body.matchAll(/class="bor-d">([^<]+)</g)].map((m) => m[1]);
  assert.equal(titles.length, 3, "the app's overview no longer has three rows");

  const mine = read('src/content/builderEntry.ts');
  for (let i = 0; i < titles.length; i++) {
    assert.ok(
      mine.includes(titles[i]),
      `row ${i + 1} title drifted — the app says ${JSON.stringify(titles[i])}`
    );
    assert.ok(
      mine.includes(details[i]),
      `row ${i + 1} detail drifted — the app says ${JSON.stringify(details[i])}`
    );
  }
});

test('the shape /start renders is the shape the spec declares', () => {
  const spec = require('../src/content/vendor/builder-spec.js');
  assert.ok(Array.isArray(spec.stages), 'the spec must expose a stages array');
  assert.equal(spec.stages.length, 11, 'the rail prints 01 / 11 — a stage was added or removed');
  assert.equal(spec.stages[0].key, 'OVERVIEW', '/start renders stage 01, which must be the orientation screen');
  assert.equal(spec.stages[0].heading, 'Build Your Training Block');
  assert.equal(spec.stages[0].lede, 'A plan, built around you.');

  // Every stage must be able to fill the rail's label and the screen's copy,
  // because bldGoToStage reads all four of these for whichever stage is up.
  for (const s of spec.stages) {
    for (const k of ['key', 'name', 'heading', 'lede']) {
      assert.equal(typeof s[k], 'string', `stage ${s.key} is missing ${k}`);
      assert.ok(s[k].length > 0, `stage ${s.key} has an empty ${k}`);
    }
  }
});

test('the website renders the entry from the spec, not from retyped copy', () => {
  const entry = read('src/components/sections/BuilderEntry.tsx');
  // The heading, the lede and the stage name must come through the module,
  // so a change in the app's file reaches the screen without an edit here.
  assert.match(entry, /overviewStage\.heading/);
  assert.match(entry, /overviewStage\.lede/);
  assert.match(entry, /overviewStage\.name/);
  assert.match(entry, /builderStages\.length/, 'the rail length is the spec length, not a literal 11');
  assert.ok(
    !/Build Your Training Block|A plan, built around you/.test(entry),
    'the stage copy is typed into the component — it must be read from the spec'
  );
});

test('the vendored copy stays a copy — nothing imports it for anything but shape', () => {
  // The website must never grow a second plan engine. The spec is taxonomy
  // and validation bounds; anything that computes a session, a pace or a
  // progression belongs behind the app's API, not in this repo.
  const vendored = read('src/content/vendor/builder-spec.js');
  for (const rx of [/function .*pace/i, /function .*session/i, /fetch\(/]) {
    assert.ok(!rx.test(vendored), `the vendored spec matches ${rx} — it must stay pure taxonomy`);
  }
});
