const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const code = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

// THE SIMPLIFIED COMMERCIAL ENTRY.
//
// The journey was /valhalla -> /pricing -> /trial -> /start, and the last two
// were both placeholders in different ways: /trial asked a question the app
// asks again where the answer does something, and /start described account
// creation instead of leading to it. It is now /valhalla -> /pricing -> /start
// -> the app, and /start is the real thing.
//
// What these tests guard is the boundary that survived the simplification:
// the website still owns no identity and no commerce, and creating an account
// still grants nothing.

// ---------------------------------------------------------------------------
// THE JOURNEY, END TO END
// ---------------------------------------------------------------------------
test('valhalla -> pricing -> start -> app, and nothing in between', () => {
  const site = code(read('src/content/site.ts'));
  assert.match(site, /label: "See Prices", href: "\/pricing"/);

  const card = code(read('src/components/sections/PricingCard.tsx'));
  assert.match(card, /href="\/start"/);

  const start = code(read('src/app/start/page.tsx'));
  assert.match(start, /href=\{appUrl\}/);
  assert.match(start, /href=\{appSignInUrl\}/);
});

test('the account entry says what the trial turns into, before the account is made', () => {
  // The one thing a visitor must not be able to miss: the prices are what
  // happens AFTER the free fourteen days, automatically.
  const site = code(read('src/content/site.ts'));
  assert.match(site, /heading: "Start Your Free Trial"/);
  assert.match(site, /sub: "Free for 14 days\."/);
  assert.match(site, /Your first 14 days are free\. After your trial, your chosen subscription starts automatically unless you cancel beforehand\./);

  const terms = code(read('src/components/sections/TrialTerms.tsx'));
  assert.match(terms, /After your trial/, 'the prices must be labelled as post-trial');
  assert.match(terms, /label: "Monthly"/);
  assert.match(terms, /label: "Annual"/);
});

test('the placeholder is gone, not merely reworded', () => {
  const site = code(read('src/content/site.ts'));
  const start = code(read('src/app/start/page.tsx'));
  for (const gone of [/Trial signup isn.t open yet/i, /This is how it will work/i,
                      /Here.s exactly what happens next/i, /Create Your Account"/]) {
    assert.ok(!gone.test(site), `the placeholder copy survives in site.ts: ${gone}`);
  }
  // The numbered "how it will work" list was the placeholder's body.
  assert.ok(!/const steps/.test(start), 'the numbered explanation must be gone');
  assert.ok(!/<ol/.test(start), 'and the list that rendered it');
});

test('the marketing site does not advertise internal beta plumbing', () => {
  /* The status notice used to read "Paid subscriptions aren't switched on, and
     accounts are open to invited testers only." The second clause was true and
     nobody's business: a marketing page announcing the shape of a private beta
     is internal plumbing shown to people who have no use for it, and it reads
     as a closed door before a visitor has reached one.

     THE ACCESS RULE IS UNCHANGED. It is enforced by a trigger on auth.users,
     and the app tells an uninvited address plainly at the point they try. This
     asserts only that the website stops narrating it -- comments stripped,
     because the component legitimately quotes the removed wording while
     explaining why it went. */
  for (const f of ['src/components/sections/TrialTerms.tsx', 'src/app/start/page.tsx',
                   'src/content/site.ts', 'src/components/sections/PricingCard.tsx']) {
    const shipped = code(read(f));
    for (const rx of [/invited testers/i, /invitation only/i, /private beta only/i,
                      /closed beta/i, /allowlist/i, /waitlist/i]) {
      assert.ok(!rx.test(shipped), `${f} advertises the beta gate to visitors: ${rx}`);
    }
  }
  // The commercial half of the notice stays, because that is what trial.live is for.
  const terms = code(read('src/components/sections/TrialTerms.tsx'));
  assert.match(terms, /Paid subscriptions aren.t switched on yet/);
  assert.match(terms, /Nothing below charges you or starts/);
  assert.match(terms, /!trial\.live/, 'and it still reads the flag rather than hard-coding it');
});

test('the primary CTA creates an account, and says exactly that', () => {
  const start = code(read('src/app/start/page.tsx'));
  assert.match(start, /Continue to Create Account/);
  // "Continue to Account" is a different promise: it reads as managing one you
  // already have, which is the other button.
  assert.ok(!/Continue to Account\b/.test(start));
});

test('sign in is a different door, because it is a different page', () => {
  const start = code(read('src/app/start/page.tsx'));
  assert.match(start, /Already have an account\?/);
  assert.match(start, /Sign In/);
  const site = code(read('src/content/site.ts'));
  const create = /appUrl = "([^"]+)"/.exec(site)[1];
  const signIn = /appSignInUrl = "([^"]+)"/.exec(site)[1];
  assert.notEqual(create, signIn,
    'both CTAs pointing at one URL is what sent an existing athlete to the page that starts an account');
  assert.ok(signIn.endsWith('/account'));
  assert.ok(create.endsWith('/start'));
});

// ---------------------------------------------------------------------------
// THE BOUNDARIES THAT MUST SURVIVE
// ---------------------------------------------------------------------------
test('the website owns no identity: no auth form, no key, no provider', () => {
  /* Putting an email field here would mean a second identity surface, a second
     place holding a publishable key, and a second redirect target for a
     single-use sign-in link. The app owns all of it. */
  const files = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = path.join(dir, e.name);
      if (e.isDirectory()) walk(rel);
      else if (/\.(tsx?|mjs)$/.test(e.name)) files.push(rel);
    }
  })('src');
  for (const f of files) {
    const src = code(read(f));
    for (const rx of [/createClient\(/, /signInWithOtp/i, /type="password"/,
                      /type="email"/, /anon_key|ANON_KEY|publishable/i]) {
      assert.ok(!rx.test(src), `${f} matches ${rx} — identity belongs to the app, not the site`);
    }
    /* THE PROVIDER'S NAME, separately and with one exemption. content/legal.ts
       names Supabase because a privacy notice has to name its processors --
       that is required disclosure, not implementation terminology leaking into
       the funnel. Everywhere else, a visitor walking from a price to an account
       should never learn which vendor is behind the door. */
    if (f !== path.join('src', 'content', 'legal.ts')) {
      assert.ok(!/supabase/i.test(src), `${f} names the auth provider to a normal visitor`);
    }
  }
  assert.ok(files.length > 20, 'sanity: the walk found the source tree');
  /* And specifically not on any page in the journey -- comments stripped,
     because these files legitimately EXPLAIN in a comment why identity belongs
     to the app and name the provider while doing so. A visitor never reads a
     comment; the rule is about what ships to the page. */
  for (const f of ['src/app/start/page.tsx', 'src/app/pricing/page.tsx',
                   'src/app/valhalla/page.tsx', 'src/components/sections/TrialTerms.tsx']) {
    assert.ok(!/supabase|gotrue|postgres/i.test(code(read(f))),
      `${f} exposes provider terminology in shipped text`);
  }
});

test('no password journey is invented for an auth model that has none', () => {
  // Sign-in is an emailed link. There is no password anywhere in the product,
  // so a "forgot password" link here would lead somewhere that does not exist.
  const files = ['src/app/start/page.tsx', 'src/components/sections/TrialTerms.tsx',
                 'src/content/site.ts'];
  for (const f of files) {
    const src = code(read(f));
    for (const rx of [/forgot.{0,5}password/i, /reset.{0,5}password/i, /create a password/i]) {
      assert.ok(!rx.test(src), `${f} offers ${rx}, which this auth model does not have`);
    }
  }
  assert.match(code(read('src/app/start/page.tsx')), /no password to create or remember/,
    'and the page should say so, so nobody goes looking for one');
});

test('nothing here activates commerce, and the flag still says so', () => {
  const commerce = code(read('src/content/commerce.ts'));
  assert.match(commerce, /live:\s*false/, 'the trial must not be switched on by this change');
  const start = code(read('src/app/start/page.tsx'));
  const terms = code(read('src/components/sections/TrialTerms.tsx'));
  for (const src of [start, terms]) {
    for (const rx of [/stripe/i, /checkout/i, /card ?number/i, /<form/i, /fetch\(/]) {
      assert.ok(!rx.test(src), `the commercial entry matches ${rx} — it must take no payment`);
    }
  }
  assert.match(terms, /!trial\.live/, 'the status notice reads the flag rather than hard-coding it');
});

test('the private beta door is untouched, and is not the primary action', () => {
  const start = code(read('src/app/start/page.tsx'));
  assert.match(start, /betaAccess\.cta\.href/);
  assert.match(start, /betaAccess\.eyebrow/);
  assert.match(start, /variant="ghost"/, 'it stays quiet beside the commercial entry');
  // And it must come after the commercial CTAs in the document.
  assert.ok(start.indexOf('Continue to Create Account') < start.indexOf('betaAccess.cta.href'));
  // Creating an account is not becoming a beta tester, and the site never says
  // or implies it is.
  assert.ok(!/become a (beta )?tester|join the beta/i.test(start));
});

// ---------------------------------------------------------------------------
// MOBILE FIRST
// ---------------------------------------------------------------------------
test('the entry is built mobile-first, not shrunk from desktop', () => {
  const start = code(read('src/app/start/page.tsx'));
  const terms = code(read('src/components/sections/TrialTerms.tsx'));
  // Both CTAs are full-width and stacked at every breakpoint: these are the two
  // most important taps on the site and a thumb should not have to find a
  // narrow one.
  assert.match(start, /className="w-full"/);
  assert.match(start, /flex-col/);
  // The price tiles stack first and go side by side only from sm.
  assert.match(terms, /flex-col gap-4 sm:flex-row/);
  assert.match(terms, /grow basis-0/, 'equal-width tracks, so neither price reads as preferred');
  // The price and its period can wrap on a narrow screen rather than overflow.
  assert.match(terms, /flex-wrap items-baseline/);
});

test('the removed step leaves no dead link and no orphan component', () => {
  assert.ok(!fs.existsSync(path.join(ROOT, 'src/app/trial/page.tsx')));
  assert.ok(!fs.existsSync(path.join(ROOT, 'src/components/sections/BillingPeriodChoice.tsx')));
  const files = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = path.join(dir, e.name);
      if (e.isDirectory()) walk(rel);
      else if (/\.(tsx?|mjs)$/.test(e.name)) files.push(rel);
    }
  })('src');
  for (const f of files) {
    const src = code(read(f));
    assert.ok(!/href="\/trial"/.test(src), `${f} links to the removed page`);
    assert.ok(!/BillingPeriodChoice/.test(src), `${f} imports the removed component`);
  }
});
