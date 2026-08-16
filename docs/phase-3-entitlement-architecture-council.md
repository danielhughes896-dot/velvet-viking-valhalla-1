# Phase 3 — Commercial / Entitlement Architecture

**Council pass. Recommendation only. Nothing implemented.**

Status: awaiting HQ approval. No code, no auth changes, no payment integration,
no entitlement tables, no signup page, no Android paywall.

---

## 0. Council status — read this first

| Member | Role | Status |
|---|---|---|
| Claude Code | Orchestrator, repository evidence, synthesis | **Delivered** |
| OpenAI | Independent architecture / systems reviewer | **NOT DELIVERED** |
| Gemini | Independent adversarial reviewer | **NOT DELIVERED** |

The AI Council MCP server accepted every call, echoed the requested role, and
reported `isError: false` — but returned **no review text at all**, from either
provider, at every response depth, on both trivial and substantial prompts.
Larger prompts timed out at the 60-second tool ceiling; smaller ones returned an
empty metadata envelope. The server's own `council://policy` resource reads
fine, so the server is running; the provider responses are not reaching the
caller.

**No OpenAI or Gemini opinion is recorded in this document, because none was
received. Nothing below has been attributed to them, invented on their behalf,
or presented as independent confirmation.** This is a single-member synthesis
grounded in repository evidence.

Consequence for HQ: this pass carries the repository-evidence half of the
Council's value but not the independent-review half. The adversarial section
(§7) is my own falsification attempt, not Gemini's. **Recommend re-running the
Council against this document once the MCP server is fixed, specifically for
§4 (the state machine), §5 (Play policy) and §7 (attack surface)** — those are
where an independent challenge would be worth most.

---

## 1. The finding that reframes Phase 3

I inspected both repositories at HEAD. The Phase 3 brief assumes an application
that can refuse to serve its product. **It cannot, today, in any form.**

**The product is one public static HTML file.** `velvet-viking-valhalla.html` is
851 KB, and the entire coaching engine is an inline `<script>` — plan
generation, Execution Score, coach decision logic, plan adaptation. `vercel.json`
sets `"framework": null`, `"buildCommand": ""`, `"outputDirectory": "."` and
rewrites `/` straight to that file. There is no build step, no bundler, no
server rendering, no middleware, no per-route auth. Anyone who can reach the
deployment receives the complete engine.

**It boots without auth, from localStorage, deliberately.** `init()` runs
`loadState()` → `renderApp()`, and only then calls `cloudInit()`, with this
comment in the source:

> *"Deliberately last and un-awaited: the app is already painted from
> localStorage by this point, so cloud sync can never delay startup and a cloud
> failure can never prevent the app from opening."*

`handleGeneratePlan()` contains no authentication check of any kind. **A user can
generate and run a full adaptive plan having never signed in.** Sign-in is
optional cloud backup, not identity and not entitlement.

**The existing beta gate gates data, not the product.** `supabase-beta-gate.sql`
is genuinely well-built — `beta_allowlist` with RLS on and no policies,
`is_beta_approved()` as `SECURITY DEFINER` with a pinned `search_path` reading
the email claim from the verified JWT, and a `BEFORE INSERT` trigger on
`auth.users`. `api/beta-signin.js` is admirably honest about its own scope:

> *"THIS ENDPOINT IS NOT THE SECURITY BOUNDARY... What actually refuses is the
> BEFORE INSERT trigger."*

But the predicate is applied to RLS policies on `plans` and `strava_activities`
**only**. A revoked tester loses cloud sync and keeps a fully functional local
coach. **The gate has never once had to stop anyone using the product.** HQ's
statement that the beta gate is "verified operationally" is true, and means
something considerably narrower than §7 of the brief assumes.

**The good news is structural.** Android is a Capacitor shell whose
`capacitor.config.json` sets `server.url` to the live Vercel deployment; `www/`
holds a single 1.1 KB offline stub. Every APK, old or new, loads current server
code. **"Old APK bypass" is structurally impossible** — and any gate deployed to
the web is instantly live in every installed APK, with no store review and no
reinstall. That is a genuinely strong position and it should be protected, not
traded away.

### What this means

The contract "no entitlement = no access" is achievable, but **not** by gating
computation — there is no server call to deny. It must be achieved by gating
**delivery** and **data**. That is the whole architecture, and §3 sets it out.

---

## 2. Commercial answers (Q1–Q5)

**Q1 — Two tiers or three?** Two in the schema. **Do not build Basic.** Agreed
with HQ, and the reasoning holds: a third tier exists to make a pricing table
look conventional, which is not a product reason.

**Q2 — Should Pro launch? No. Launch Standard-only.** This is my strongest
commercial recommendation and it is a change to the working contract.

Every Pro differentiator — splits/reps analysis, forecasting, multi-goal
periodisation, long-horizon analytics — is **unbuilt**. Selling it is the
clearest self-inflicted wound available here. It invites refunds, and it
contradicts §15's own claim discipline in a product whose entire pitch is *we
wait for real evidence and we don't overclaim*. Charging £18.99 for a promise
undermines the one thing the brand is selling.

Carry the `tier` column from day one so Pro is later a config change, not a
migration. But **ship one purchasable thing**. This also deletes upgrade,
downgrade, proration and mid-plan tier-change from launch scope entirely — a
very large simplification, and it removes several of §21's attack scenarios by
making them unreachable rather than by defending against them.

**Q3 — 14-day, Standard-only, card-required, auto-converting trial?** Yes, and
the product reasoning is better than the brief claims. It is **derivable from
the coaching engine's own behaviour**. `test/coachDecision.test.js` pins the
invariants that *a single weak signal never reaches MODIFY* and *two independent
corroborating signals do*. On a 3–6 day/week plan, a 7-day trial may deliver as
few as three sessions — structurally too few to trip the engine's own evidence
threshold. The athlete would experience plan generation and nothing that
distinguishes the product. 14 days yields roughly 6–12 sessions, which can.

**The trial length is set by the evidence threshold in the coaching logic.** That
is a defensible, specific rationale, and it is much stronger than "14 feels
right". Make the length a config value regardless.

Card required: agreed — it filters tyre-kickers and produces clean retention
data.

On the legal point, HQ's caution is correct and I would go further: an
auto-converting trial with card capture is precisely the pattern the DMCC
subscription regime and the existing Consumer Contracts Regulations target —
mandatory pre-contract information, reminders before renewal, and a
straightforward exit. **Do not treat 14 days as legally protective in any
direction.** Architecturally, build the pre-charge reminder mechanism as a
launch requirement rather than a nicety, because it is likely to be one.

**Q4 — £11.99 / £18.99 credible?** £11.99 is well-judged. It sits below Runna
and TrainingPeaks Premium and reads as *serious but not premium-priced*, which
suits a product with no public track record. £99.99/yr is a ~30% discount —
conventional and sensible.

Three qualifications:

- **Consider launching monthly-only.** Annual billing on an unproven product,
  with no refund history and a 14-day trial, concentrates refund liability at
  exactly the moment you have the least evidence about retention. Add annual
  once you know the monthly churn curve. It also keeps the price changeable.
- **Founding cohort: helpful, with one condition.** Run it as a *fixed-term
  discount on the standard price*, never as a permanently grandfathered "founder
  tier". A permanent discount is a permanent liability and a future migration
  problem. It must also be genuinely time-limited, or the claim itself is a
  problem under the CPRs/DMCC.
- **£18.99 is currently undecidable and should not be published.** It cannot be
  defended until Pro exists.

**Q5 — Subscription-only?** Agreed, and the repository supports it more strongly
than the brief argues. The value *is* the loop over time —
`evolutionChanges`, `coachDecision`, `futureDecisionMemory`. A one-off plan is
the single thing this engine is worst at representing. No reason to invent one.

---

## 3. Entitlement architecture (Q6, Q8, Q9)

**Q6 — Is HQ's contract achievable?** Yes, with one honest caveat, and at
moderate structural cost. Three layers:

### Layer 1 — Delivery gate (new; this is the change)

`/` stops rewriting to the static file. It routes to a Vercel function that
requires a valid Supabase session, resolves entitlement **server-side**, and only
then streams the app document. Without entitlement, the caller receives the
**locked shell** — account, billing, legal, export, delete — and the 851 KB
engine is never sent.

**The honest caveat, which HQ must accept explicitly: both repositories are
public on GitHub, and the APK is published unauthenticated to public GitHub
Releases.** Delivery gating stops casual bypass; it does not make the engine
secret, because the source is already downloadable by anyone. **Recommend both
repos go private before commercial activation.** Even then, code secrecy is not
the moat — the moat is the account, the retained data, cloud sync, and continuous
updates. That is the correct place for it to be, and the architecture should not
pretend otherwise.

### Layer 2 — Data gate (extend what already works)

Extend the proven pattern: `has_active_entitlement()` alongside
`is_beta_approved()`, applied as an RLS predicate on `plans`,
`strava_activities` and every new table. **This is the real security boundary**,
exactly as `beta-signin.js` already documents about itself. The Supabase
publishable key ships in the client, so PostgREST is directly reachable by
anyone — entitlement therefore *must* live in RLS predicates and never in
application code.

### Layer 3 — Client render gate (UX only, explicitly not security)

The client renders locked state. This is a courtesy to the user, not a boundary,
and should be commented as such in the source — following the precedent
`beta-signin.js` already sets.

**Q8 — Where does authority live?** In Postgres, as a `SECURITY DEFINER`
function reading the verified JWT — the same shape as `is_beta_approved()`,
which already works and is already trusted. The Vercel delivery function and the
RLS predicates both call it, so there is exactly **one** definition of "has
access" and no second implementation to drift.

**Q9 — The local plan, and the invariant conflict.** This is the sharpest
tension in the brief, and it resolves cleanly once you separate two things the
current code conflates:

> **Network failure is not a verdict of "expired".**

The client caches a **server-signed entitlement verdict** — `{user_id, tier,
access_until, not_after}`, signed with a server key it does not hold. While that
verdict is fresh, the app runs, offline or not. When it goes stale, the app
locks.

This preserves the existing invariant for the case it was written for (ordinary
network blips, Supabase hiccups — the app still opens) while still closing the
gate. It also answers the localStorage-spoof attack directly: **a forged verdict
fails signature verification, and the client cannot mint one.**

---

## 4. The state machine (Q7, Q10)

**Q7 — The eight proposed states are not minimal.** Several are not states at
all; they are combinations. Modelling them as peer states creates illegal
combinations that then need defending. Collapse to:

| Field | Values | Purpose |
|---|---|---|
| `status` | `trialing` \| `active` \| `grace` \| `expired` | lifecycle only |
| `tier` | `standard` \| `pro` | capability only |
| `access_until` | timestamptz | the single source of "does access hold *now*" |
| `cancel_at_period_end` | boolean | a flag, not a state |
| `override` | `null` \| `owner` \| `beta` \| `promo` | non-commercial access |
| `override_until` | timestamptz, nullable | owner = null (never expires) |

Then, everywhere:

```
has_access  :=  (override is not null and (override_until is null or now() < override_until))
                or now() < access_until
tier        answers what you get, never whether you get in
```

This collapses four of the eight proposed states:

- `CANCELLED_ACTIVE_UNTIL_PERIOD_END` → `active` + `cancel_at_period_end = true`
- `PAYMENT_GRACE` → `grace` + `access_until` extended by the grace window
- `EXPIRED` → `now() >= access_until`, no override
- `OWNER` / `BETA_TEST` / future `PROMOTIONAL` → the **one** `override`
  mechanism HQ asked for, exactly as §6 of the brief hoped

**Grace policy (Q11 of the brief, §11):** a flat **7 days** from first failed
payment, then lock. No race-proximity logic — agreed with HQ, and the separation
is right: goal proximity belongs to coaching, never to billing.

**Q10 — The activation boundary.** A single server-side `COMMERCE_ACTIVE` flag,
plus the override mechanism. Before activation, `has_access()` returns true for
anyone on the beta allowlist. After activation, allowlist entries have already
been backfilled as explicit `override = 'beta'` rows with an expiry HQ sets
deliberately.

The safety property matters more than the mechanism: **fail-closed to strangers,
fail-open to the owner.** The existing beta-gate SQL already sets the right
precedent with its abort-if-placeholders-remain block, and it should be copied
literally: **refuse to activate commerce if no owner override row exists.**

The owner identity mechanism also already exists — `api/admin-user.js` verifies
the Supabase access token server-side and requires the caller's user id to equal
`VVV_OWNER_USER_ID`, failing closed when no owner is configured. **Reuse
`VVV_OWNER_USER_ID`; do not invent a second notion of owner.**

---

## 5. Purchase channel and payment (Q11, Q12, Q14, Q15, Q16)

**Q11 — Play policy.** What ships to Google is a WebView shell delivering digital
services from the web. **Do not assume a reader-app exemption; the honest
reading is that this sits squarely in "digital goods consumed in the app",**
where Play Billing has historically been required. Recent regulatory movement on
external link-outs is real but unsettled and jurisdiction-dependent, and the
launch market is the UK.

Architecture that keeps every option open:

- **Entitlement is channel-agnostic.** One entitlement record, a `source` column
  (`stripe` | `play` | `manual`), and a provider-adapter boundary. Nothing
  downstream of entitlement knows who took the money.
- **Android launches purchase-silent** — resolves entitlement, and when there is
  none shows a locked state with **no purchase UI and no link to web checkout**.
  A link is precisely the thing Play polices. Even "manage your subscription on
  the web" wording needs legal review before it ships.
- **Budget for Play Billing being required.** Because entitlement is
  channel-agnostic, adding it later is a new webhook adapter and a `source`
  value — not a re-architecture.

Two risks to put in front of HQ rather than bury: if Play Billing becomes
required, Google's fee changes the £11.99 economics — **so price must be data,
not code, in both repos.** And a thin WebView wrapper of a website carries some
exposure under Play's own minimum-functionality policy; worth checking
independently of billing.

**Q12 — Choose a provider now?** Separate the two decisions, as the brief asks.

*Architectural requirement (decide now):* hosted checkout so no card data touches
VVV and PCI scope stays at SAQ-A; trials with card capture; monthly and annual;
dunning and grace; webhooks with event ids and a stable ordering signal; a
hosted customer portal; UK VAT handling; SCA/3DS.

*Vendor (decide now, reversibly):* **Stripe as the launch adapter.** Not because
it is popular — because Billing plus the hosted Customer Portal removes an
entire category of launch work (cancel, update card, invoice history) that would
otherwise be bespoke UI in an 851 KB HTML file. **Paddle is the one credible
alternative worth an hour**, because as merchant of record it absorbs global VAT
— which matters if international expansion arrives quickly. For a UK-only
launch, Stripe plus VAT advice is simpler.

**Hard sequencing constraint, not previously flagged: PSP onboarding is blocked
on Companies House approval.** You cannot onboard as a company that does not yet
exist. The good news is that **nothing in §3 or §4 is blocked on it** — the
entire entitlement layer is provider-independent and can be built now.

**Q14 — Webhooks.** Five rules, in order of importance:

1. Verify the signature. Reject anything unverified.
2. Persist the raw event with **the provider's event id as primary key**. Replay
   then becomes a no-op *by construction*. Do not invent a second idempotency
   mechanism.
3. **Never trust ordering.** Store the provider's own updated-at/version and
   apply only if newer. Late old events lose.
4. **Never compute entitlement from the event body.** On any event, re-fetch the
   subscription from the provider and project it. Missed events then self-heal.
5. **Add a daily reconciliation job.** This — not webhooks — is the correctness
   guarantee. Webhooks are a latency optimisation.

Entitlement writes go through `service_role` only. The client never writes
entitlement, ever.

**Q15/Q16 — Offline.** The signed verdict carries a `not_after`. **Recommend a
72-hour leash**: long enough to survive a weekend in a signal notch or a
Supabase outage, short enough to be commercially meaningful. Offline with a
fresh verdict works; past the leash it locks.

After expiry, **nothing coaching remains usable** — no new computation, no plan,
no Execution Review, no Next Move, per HQ's contract. What remains reachable
always, online or off, entitled or not: **sign-in, billing/resubscribe, legal
pages, data export, account deletion.** That set is a legal requirement, not a
courtesy, and it must not sit behind the gate.

---

## 6. Retained data (Q6 continued)

The cleanest model, and it needs no new machinery:

- Cloud remains the durable record; RLS denies reads without entitlement.
- The device copy is **not wiped on expiry** — but the locked shell will not
  render or compute from it.
- Re-subscription restores access to the retained record. `stampPlanOwner` /
  `planOwnerUid` already do the ownership resolution this needs.
- Retention is an explicit published period, enforced by a scheduled job, and
  stated in the Privacy Policy before activation.

One caution from evidence: `test/localPlanReauth.test.js` documents a real
incident where account deletion minted a new uid, the plan was still stamped
with the old one, and ownership resolution parked it in `vvv_plan_archive` —
nothing destroyed, but unreachable, "which amounts to the same thing".
**Plan-ownership-versus-identity is already a live source of edge cases, and
entitlement adds a third axis to it.** Whatever lands here needs tests in that
same harness before activation.

---

## 7. Adversarial pass (Q13) — my own falsification, not Gemini's

Ranked by real risk to *this* codebase, not generic advice.

1. **The static file is the product.** Until delivery gating lands, fetching the
   app URL bypasses everything. `get.html` even offers *"Just open it in this
   browser instead"* pointing at `/`. **Highest severity; §3 Layer 1 is the only
   fix.**
2. **Public repos and an unauthenticated public APK.** The engine and all SQL are
   downloadable from GitHub today. Delivery gating does not change that. **Make
   both repos private before activation** — and note that this bounds what any
   client-side gate can ever achieve.
3. **`app-debug.apk` is a debug build**, distributed from public Releases. Debug
   builds are debuggable, allow backup, and are trivial to instrument. **Must
   become a signed release build before commercial activation.**
4. **Trial re-registration abuse is currently unbounded.** `delete_own_account()`
   mints a fresh uid on re-signin — the reauth test proves it. Delete, re-register,
   get another 14 days, indefinitely. **Trial eligibility must key on something
   more durable than uid** — email hash plus the PSP's card fingerprint is the
   standard answer, and it needs a privacy-policy line.
5. **localStorage survives everything.** `STORAGE_KEY` and `vvv_plan_archive`
   persist across sign-out and expiry. Mitigated only by the locked shell *plus*
   not re-serving the engine — either alone is insufficient.
6. **Direct PostgREST access.** The publishable key ships in the client, so
   anyone can hit `/rest/v1/`. RLS is the *only* thing standing there. This is
   why entitlement must be an RLS predicate and not application logic.
7. **Shared account / shared device.** `stampPlanOwner` handles device ownership
   but nothing prevents one subscription serving several people sequentially.
   **Accept at launch; monitor.** Not worth pre-solving.

Two scenarios from §21 that **do not apply**, and should be struck from the risk
register rather than defended against:

- **Old APK bypass** — impossible. The Capacitor shell always loads live server
  code.
- **Downgrade / mid-plan tier-change races** — unreachable if Q2 is accepted and
  launch is Standard-only. Deleting the scenario beats defending it.

I also checked, and cleared, one surface I expected to be a hole: **`/admin` is
sound.** `admin.html` holds no secrets by design, and `api/admin-user.js`
verifies the token server-side, requires `VVV_OWNER_USER_ID`, and fails closed
when no owner is configured. It is a good precedent, not a risk.

---

## 8. Migration and sequencing (Q17–Q20)

**Q17 — Safest migration.** Six steps, in order, no shortcuts:

1. Deploy entitlement schema and `has_access()` with `COMMERCE_ACTIVE = false`.
   Behaviour is unchanged for everyone.
2. Backfill every active `beta_allowlist` row to `override = 'beta'` with a
   generous expiry HQ sets; owner to `override = 'owner'`, no expiry.
3. Add a verification block mirroring the beta gate's own FINAL CHECK — **abort
   if the owner override is missing or the count is not the number HQ
   authorised.**
4. Deploy the delivery gate in **report-only mode**: log who *would* be denied,
   deny nobody. Run for a week and read the log.
5. Only then flip `COMMERCE_ACTIVE`.
6. Beta users get explicit comms and a founding offer **before** their override
   expires. Never silently lock a tester.

**The single most important sequencing point in this document:** *"you now need
an account"* and *"you now need to pay"* must be **two separate releases**.
Today, zero users are required to have an account — `handleGeneratePlan()` proves
it. Requiring accounts is the largest behavioural change in Phase 3 and it will
surface every ownership edge case in §6. Shipping it together with payment
doubles the risk of the riskiest release of the project.

**Q18 — System builds first.** Entitlement schema, `has_access()`, the RLS
predicate swap, `billing_events`, and the reconciliation job. **No payment
provider yet** — all of this is provider-independent, none of it is blocked on
incorporation, and it unblocks everything else.

**Q19 — App builds first.** The **locked shell** — the app's ability to render an
entitlement-less state offering only account, billing, legal and export — plus
the signed-verdict cache and the 72-hour leash. This must precede delivery
gating, because the locked shell is *what the gate serves*. Then, as its own
release, require an account.

**Q20 — Website builds first.** The legal and commercial foundation: real Privacy
Policy, Terms, subscription and cancellation terms, and company details once
Companies House approves. All three legal routes are currently 15-line stubs
reading *"[Privacy policy to be confirmed.]"*. Then a pricing page **driven by
the same config source as the server** — §3 of the brief's "do not hard-code
prices" applies to both repos. **Do not build checkout UI first.** Keep the
existing placeholder media slots intact for the real-evidence validation §18
requires.

---

## 9. What HQ is being asked to decide

1. **Accept Standard-only at launch?** (Changes the working contract. My
   strongest recommendation.)
2. **Accept monthly-only at launch**, adding annual once retention data exists?
3. **Accept that delivery gating bounds casual bypass only**, and approve making
   both repositories private before activation?
4. **Approve the collapsed state machine** (§4) over the eight proposed states?
5. **Approve the 72-hour offline leash?**
6. **Approve Stripe as the launch adapter**, recorded as a reversible vendor
   decision behind a provider boundary?
7. **Approve splitting "require an account" from "require payment"** into two
   releases?

Open and **not** resolvable by this Council: UK subscription/DMCC compliance,
Google Play digital-services classification, and Strava's written approval. All
three need external confirmation before commercial activation. None of them
blocks the §8 build order.

**Recommend re-running OpenAI and Gemini against this document once the Council
MCP server is returning content**, particularly on §4, §5 and §7.
