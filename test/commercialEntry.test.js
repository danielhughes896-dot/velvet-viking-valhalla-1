const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const code = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

/* ONE FILE AGAIN. For a few hours /start composed a BuilderEntry component
   holding the app's stage 01, and these guards read both files. The founder
   removed the builder from the website — "Build my plan should not build it
   on the website" — so the route is a single page component again and this
   helper is what it always was. */
const startEntry = () => code(read('src/app/start/page.tsx'));

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
  /* "See Prices" survives as /valhalla's SECONDARY link. Its primary closing
     action is the build — the approved value-first order converts a reader who
     understands the product into a plan, not into a price list. */
  assert.match(site, /label: "See Prices", href: "\/pricing"/);

  /* The pricing CTA used to point at /start. It now goes one step further,
     through buildUrl, straight into the app's nine-stage builder — the same
     route every other first-time CTA uses, so there is one journey rather than
     two that differ by a page. */
  /* ONE ROUTE, AND THE PERIOD NO LONGER RIDES ON IT.
     This asserted buildUrlForPeriod(period) — buildUrl plus ?period=, which
     the app's /start read as a preselection on its trial card. The founder
     has put the app install between /pricing and that card: Build My Plan
     goes to the app's /get now, and an install page forwards no query at all,
     so a parameter there would be read by nobody. The helper is gone rather
     than left appending something nothing consumes.
     What this test guards is unchanged — one shared journey, no page-local
     entry route — so it asserts the choice leads to the same buildUrl every
     other first-time CTA uses, and that the two period values are still the
     only two the app would accept if the preselection is ever restored. */
  const card = code(read('src/components/sections/PricingCard.tsx'));
  const choice = code(read('src/components/sections/PeriodChoice.tsx'));
  assert.match(choice, /href=\{buildUrl\}/, 'the choice leads to the one shared route');
  assert.ok(!/buildUrlForPeriod/.test(choice),
    'a period parameter must not be appended to a URL that forwards nothing');
  assert.match(choice, /type Period = "monthly" \| "yearly"/,
    'and the only two values it can carry are the two the app accepts');
  for (const src of [card, choice]) {
    assert.ok(!/href="\/start"/.test(src), 'no page-local entry route');
  }
  /* And what travels is a period name, never anything purchasable: a URL
     carrying a Stripe price is a URL anybody can edit into a different one. */
  for (const src of [card, choice]) {
    assert.ok(!/price_[A-Za-z0-9]/.test(src), 'a provider price id reached the website');
  }

  const start = startEntry();
  assert.match(start, /href=\{buildUrl\}/, 'first-time entry goes through the shared build route');
  assert.match(start, /href=\{appSignInUrl\}/);
});

test('the account entry says what the trial turns into, before the account is made', () => {
  // The one thing a visitor must not be able to miss: the prices are what
  // happens AFTER the free fourteen days, automatically.
  /* IT IS SAID WHERE THE PRICES ARE NOW, WHICH IS /pricing.
     This used to read three strings out of pages.start — a heading, a sub,
     and "Your first 14 days are free. After your trial, your chosen
     subscription starts automatically unless you cancel beforehand." That
     page was a marketing surface showing two prices, so the sentence had to
     be on it. /start is the app's builder entry now: it shows no price, asks
     nothing and sells nothing, so a paragraph about what happens to a card
     after fourteen days has nothing on that screen to attach to, and
     pages.start went with it.
     The guarantee is not weakened, it is relocated and now checked in three
     places rather than one — the visitor must not be able to miss that the
     prices are what happens AFTER the free fourteen days, automatically. */
  const card = code(read('src/components/sections/PricingCard.tsx'));
  assert.match(card, /trial\.days\}-day free trial/);
  assert.match(card, /chosen subscription starts automatically/,
    'the card must say the subscription starts by itself');
  assert.match(card, /trial\.autoConverts/, 'and it must follow the flag, not assert it in copy');

  const choice = code(read('src/components/sections/PeriodChoice.tsx'));
  assert.match(choice, /After \$\{trial\.days\} days this becomes/,
    'the note under the choice names the post-trial price');

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
  /* THE COMMERCIAL HALF OF THE NOTICE IS GONE TOO, AT LAUNCH. It said paid
     subscriptions were not switched on. They are. The assertion inverts rather
     than being dropped, because a pre-launch sentence reappearing on a live
     product is a regression worth catching. */
  const terms = code(read('src/components/sections/TrialTerms.tsx'));
  assert.ok(!/Paid subscriptions aren.t switched on/.test(terms),
    'the site still tells a paying visitor that subscriptions are closed');
  assert.ok(!/Not open yet/.test(terms));
  const card = code(read('src/components/sections/PricingCard.tsx'));
  assert.ok(!/Not open yet/.test(card));
  assert.ok(!/Paid subscriptions aren.t switched on/.test(card));
});

test('the primary CTA enters the builder, and says exactly that', () => {
  /* WAS /Continue to Create Account/, which was accurate about an app whose
     /start opened on "Create your account, or sign in". App main now opens on
     the nine-stage builder and asks for an account at step three, after the
     programme has been built and seen — so a button promising account creation
     would name the wrong screen. The label reads from buildCta, shared with
     every other first-time CTA, and cannot drift into a page-local variant. */
  /* BACK TO THE SITE'S OWN LABEL. It read entryLabels.continue while this
     route drew the app's builder screen. The builder is gone from the website
     and this is a handoff page again, so the button is the same "Build My
     Plan" every other first-time CTA on the site carries, read from buildCta
     so it cannot drift into a page-local variant. */
  const start = startEntry();
  assert.match(start, /\{buildCta\.label\}/);
  assert.match(start, /href=\{buildUrl\}/);
  assert.ok(!/Continue to (Create )?Account/.test(start),
    'the account is step three of the app journey, not the promise on this button');
});

test('sign in is a different door, because it is a different page', () => {
  const start = startEntry();
  assert.match(start, /Already have an account\?/);
  assert.match(start, /\{signInCta\.label\}/, 'the label is shared, not retyped per page');
  /* Both doors derive from ONE declared origin rather than two absolute
     literals — the two passes that added appSignInUrl differed on the
     mechanism and the shared origin survived, so the host is still written
     down exactly once. Read the paths off the template literals. */
  const site = code(read('src/content/site.ts'));
  const create = /appUrl = `\$\{appOrigin\}([^`]+)`/.exec(site)[1];
  const signIn = /appSignInUrl = `\$\{appOrigin\}([^`]+)`/.exec(site)[1];
  assert.notEqual(create, signIn,
    'both CTAs pointing at one URL is what sent an existing athlete to the page that starts an account');
  assert.equal(signIn, '/account');
  assert.equal(create, '/start');
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
                   'src/app/sacoro/page.tsx', 'src/components/sections/TrialTerms.tsx']) {
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

test('the trial is open, and the site still takes no payment itself', () => {
  const commerce = code(read('src/content/commerce.ts'));
  /* LIVE. The flag tracks whether somebody can actually BUY, and the two
     conditions its own comment named are met: charging is switched on in the
     app's environment, and public signup is open now that the private beta is
     retired and the allowlist trigger on auth.users is dropped.

     THE HALF THAT MUST NEVER CHANGE is below. Opening the trial did not move
     one gram of commercial authority onto the marketing site: no Stripe, no
     checkout, no card field, no form, no fetch. The site hands an athlete to
     the app and the app does everything. That is the assertion this test was
     always really making, and it is unchanged. */
  assert.match(commerce, /live:\s*true/);
  const start = code(read('src/app/start/page.tsx'));
  const terms = code(read('src/components/sections/TrialTerms.tsx'));
  const card = code(read('src/components/sections/PricingCard.tsx'));
  for (const src of [start, terms, card]) {
    for (const rx of [/stripe/i, /checkout/i, /card ?number/i, /<form/i, /fetch\(/]) {
      assert.ok(!rx.test(src), `the commercial entry matches ${rx} — it must take no payment`);
    }
  }
});

test('the private beta door is untouched, and is not the primary action', () => {
  const start = code(read('src/app/start/page.tsx'));
  assert.match(start, /betaAccess\.cta\.href/);
  assert.match(start, /betaAccess\.eyebrow/);
  assert.match(start, /variant="ghost"/, 'it stays quiet beside the commercial entry');
  // And it must come after the commercial CTAs in the document.
  assert.ok(start.indexOf('{buildCta.label}') < start.indexOf('betaAccess.cta.href'));
  // Creating an account is not becoming a beta tester, and the site never says
  // or implies it is.
  assert.ok(!/become a (beta )?tester|join the beta/i.test(start));
});

// ---------------------------------------------------------------------------
// MOBILE FIRST
// ---------------------------------------------------------------------------
test('the entry is built mobile-first, not shrunk from desktop', () => {
  const start = startEntry();
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
