// ---------------------------------------------------------------------------
// LEGAL CONTENT — TWO DOCUMENTS PUBLISHED, TWO STILL GATED
// ---------------------------------------------------------------------------
//
// This file holds four documents at two different approval states, and the
// difference between them is the most important thing in it.
//
// PUBLISHED, for the five-person invited private beta, on HQ's explicit
// publication approval:
//     privacyDraft    -> /privacy
//     betaTermsDraft  -> /beta-terms
//
// NOT PUBLISHED, and not approved by anybody:
//     termsDraft      -> /terms      the FUTURE COMMERCIAL terms of service
//     cookiesDraft    -> /cookies    accurate, but outside the beta approval
//
// WHY THIS IS NOT ONE FLAG ANY MORE. It used to be: a single
// LEGAL_CONTENT_APPROVED gated all four. HQ has approved two documents, so
// flipping that flag would also have published an unreviewed commercial terms of
// service — representing as approved a document nobody has approved, which is a
// worse outcome than the beta shipping without terms at all. Per-document gates
// make each state explicit, independently auditable, and impossible to change by
// accident: publishing the commercial terms now requires editing the line that
// says commercial terms, and says false.
//
// Bracketed [TO BE CONFIRMED: ...] strings are business facts genuinely unknown
// to this repository. They are deliberately NOT invented, and nothing renders
// them to a visitor — see isConfirmed() and tradingDisclosure below.
//
// STILL FOR A SOLICITOR, and parked by HQ until after this private trial:
//   - lawful basis wording for each processing purpose under UK GDPR
//   - whether the training data collected is "data concerning health" under
//     Art 9, and what condition would then apply
//   - whether ICO registration/fee is required for this processing
//   - enforceability/scope of the IP and anti-scraping provisions in Terms §7
//   - liability caps and consumer-law carve-outs (Terms §9)
//   - the refund/cancellation regime, before any paid access exists
// ---------------------------------------------------------------------------

/**
 * PER-DOCUMENT PUBLICATION GATES.
 *
 * A document renders its real content only when its own flag here is true.
 * There is no combined switch and deliberately no default: a document added
 * later has no entry, so it cannot inherit somebody else's approval.
 */
export const LEGAL_APPROVALS = {
  /** HQ-approved for the five-person private beta. */
  privacy: true,
  /** HQ-approved for the five-person private beta. */
  betaTerms: true,

  /**
   * FUTURE COMMERCIAL TERMS OF SERVICE — NOT APPROVED, NOT REVIEWED.
   *
   * This is the gate the previous audit was told to preserve, and it is
   * separate from the beta approval on purpose. It describes subscriptions,
   * trials, cancellation and refunds, none of which exist yet. It must not be
   * published on the strength of a beta approval, and must not be published at
   * all until a solicitor has reviewed it and paid access actually exists.
   */
  terms: false,

  /**
   * COMMERCIAL PRIVACY POLICY — NOT APPROVED.
   *
   * Separate from `privacy` above, and deliberately so. The live policy is
   * approved and ACCURATE FOR TODAY: no payments, no Strava traffic, no
   * Garmin. Editing it in place to describe subscriptions and payment
   * processors would push unreviewed wording onto an approved, published
   * document, and would describe processing that is not happening yet.
   * privacyCommercialDraft replaces it at commercial launch, the same way
   * termsDraft replaces betaTermsDraft.
   */
  privacyCommercial: false,

  /**
   * Cookie policy. Its content was verified as accurate against the live site
   * and the app, but HQ's approval covered the two beta documents only, so it
   * stays gated rather than being waved through for being correct.
   */
  cookies: false,
} as const;

/**
 * The commercial legal set, preserved as a single named gate so "have the
 * commercial documents been approved" stays answerable in one place.
 */
export const COMMERCIAL_LEGAL_APPROVED =
  LEGAL_APPROVALS.terms && LEGAL_APPROVALS.cookies;

/**
 * PUBLIC FOOTER LEGAL LINKS.
 *
 * Derived from each document's own gate above, not a static list a human has
 * to remember to edit. When LEGAL_APPROVALS.terms or .cookies flips true for
 * commercial launch, that document's footer link appears on its own — the
 * gate flip is the only change required, exactly as for the page itself.
 *
 * /beta-terms is never included here, in any state. It governs five invited
 * testers, not the public — see the note on its own page — so it has no
 * `approved` branch to eventually take; it simply isn't a footer candidate.
 */
export const publicLegalLinks = [
  { label: "Privacy", href: "/privacy", approved: LEGAL_APPROVALS.privacy },
  { label: "Terms", href: "/terms", approved: LEGAL_APPROVALS.terms },
  { label: "Cookies", href: "/cookies", approved: LEGAL_APPROVALS.cookies },
].filter((link) => link.approved);

/** Placeholder token, so unresolved business facts are greppable before launch. */
const TBC = (what: string) => `[TO BE CONFIRMED: ${what}]`;

// ALL FOUR STATUTORY FACTS ARE NOW SUPPLIED BY HQ, so the disclosure required by
// the Companies (Trading Disclosures) Regulations 2008 is complete: registered
// name, registered number, place of registration and registered office address.
//
// The address is held as one comma-separated line rather than as the three lines
// it is filed on, because every place it appears is mid-sentence — "registered
// office X" in the footer, "registered at X" in a document body. Line breaks
// would read as a formatting fault in those positions. The wording is the filed
// address unchanged; only the separators differ.
export const legalEntity = {
  name: "Velvet Viking Ltd",
  companyNumber: "17404255",
  placeOfRegistration: "England and Wales",
  registeredAddress: "7 Myrtle Drive, Halifax, HX2 8HQ",
  contactEmail: "support@velvetviking.co.uk",
} as const;

/**
 * True when a business fact has actually been supplied, rather than still being
 * a placeholder.
 *
 * This exists so a renderer can never print "[TO BE CONFIRMED: ...]" to the
 * public. A visible placeholder on a statutory disclosure is worse than an
 * absent one: absent is an incomplete disclosure, whereas visible reads as
 * carelessness on the one part of the site whose whole job is looking
 * trustworthy. Everything user-facing must ask this before rendering.
 */
export const isConfirmed = (value: string): boolean =>
  typeof value === "string" && value.length > 0 && !value.startsWith("[TO BE CONFIRMED");

/**
 * How the operating company is described inside a document body.
 *
 * Assembled rather than written out, because these sentences previously
 * interpolated the registered office directly — which would have printed
 * "[TO BE CONFIRMED: registered office address...]" into the first paragraph of a
 * published Privacy Policy. Every fact is included only once confirmed, so the
 * sentence stays true and grammatical at each stage of being filled in, and gains
 * the registered office automatically when that address is supplied.
 */
export const entityDescription = (): string => {
  const parts: string[] = [];
  if (isConfirmed(legalEntity.companyNumber)) {
    parts.push(`company number ${legalEntity.companyNumber}`);
  }
  if (isConfirmed(legalEntity.placeOfRegistration)) {
    parts.push(`registered in ${legalEntity.placeOfRegistration}`);
  }
  if (isConfirmed(legalEntity.registeredAddress)) {
    parts.push(`registered office ${legalEntity.registeredAddress}`);
  }
  return parts.length ? `${legalEntity.name} (${parts.join(", ")})` : legalEntity.name;
};

/**
 * Effective date of the two documents published for the private beta.
 *
 * A real date rather than a placeholder, because these documents are actually
 * live now: HQ gave publication approval for the five-person beta, and a policy
 * with no effective date is not much of a policy. The commercial documents keep
 * their placeholder — they have no effective date because they are not in force.
 */
export const BETA_LEGAL_EFFECTIVE_DATE = "17 August 2026";

/**
 * The statutory trading disclosure, assembled from whatever is actually known.
 *
 * The Companies (Trading Disclosures) Regulations 2008 require a company's
 * website to state its registered name, its registered number, its place of
 * registration and its registered office address. Three of the four are now
 * supplied; the registered office line appears automatically, with no code
 * change, the moment that address is filled in above.
 *
 * `complete` is what a test and a pre-launch check can read to answer "is the
 * site's statutory disclosure finished yet" without anybody having to remember
 * to look.
 */
export const tradingDisclosure = {
  get lines(): string[] {
    // Explicitly string[]: legalEntity is `as const`, so an inferred array would
    // narrow to the literal name type and reject every line appended below.
    const out: string[] = [legalEntity.name];
    if (isConfirmed(legalEntity.companyNumber)) {
      out.push(
        isConfirmed(legalEntity.placeOfRegistration)
          ? `Registered in ${legalEntity.placeOfRegistration}, company number ${legalEntity.companyNumber}`
          : `Company number ${legalEntity.companyNumber}`
      );
    }
    if (isConfirmed(legalEntity.registeredAddress)) {
      out.push(`Registered office: ${legalEntity.registeredAddress}`);
    }
    return out;
  },
  get complete(): boolean {
    return (
      isConfirmed(legalEntity.name) &&
      isConfirmed(legalEntity.companyNumber) &&
      isConfirmed(legalEntity.placeOfRegistration) &&
      isConfirmed(legalEntity.registeredAddress)
    );
  },
} as const;

// COMMERCIAL FEATURES THAT ARE APPROVED IN PRINCIPLE BUT NOT YET BUILT.
//
// Separate from LEGAL_APPROVALS, which asks "has this wording been approved".
// These ask "can we promise this to a customer yet". Both default to off, and
// both are read by the Terms so that a feature System has not finished cannot
// become a contractual promise by the back door.
//
// The distinction matters more than it looks. A price-lock promise and a pause
// entitlement are things a customer can hold us to; publishing either before
// the billing system can honour it would be a term we would then breach.
export const COMMERCIAL_FEATURES = {
  /**
   * FOUNDING PRICE LOCK. The implementation is now proven: a qualifying
   * agreement stores the agreed price, renewal does not overwrite it, a valid
   * pause preserves it, and cancelling then returning — or switching between
   * monthly and annual — starts a new agreement at the current price.
   *
   * The flag stays FALSE because the PUBLIC CLAIM is not approved, which is a
   * different question from whether the system can honour it. The Terms
   * describe the mechanism conditionally, engaged only by an offer that says
   * so at the point of sale, so they are accurate whether or not one is
   * running and become operative without a rewrite.
   */
  foundingPriceLock: false,

  /**
   * SUBSCRIPTION PAUSE — monthly only, one to three whole months, once per
   * rolling 365 days, billing and access both stopping, automatic resume, the
   * founding-price agreement preserved. The architecture is proven.
   *
   * Still FALSE, and for a concrete reason rather than caution: there is no
   * athlete-facing way to trigger a pause yet. Promising a feature nobody can
   * reach would be a term we could not perform. The Terms mention pause only
   * where it has actually been offered to that subscriber.
   */
  subscriptionPause: false,
} as const;

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalDocument = {
  eyebrow: string;
  heading: string;
  sub: string;
  /** Shown once, above the sections — sets scope and effective date. */
  preamble: string;
  lastUpdated: string;
  sections: LegalSection[];
};

// ---------------------------------------------------------------------------
// PRIVACY POLICY (draft)
// ---------------------------------------------------------------------------

export const privacyDraft: LegalDocument = {
  eyebrow: "Velvet Viking",
  heading: "Privacy",
  sub: "What Valhalla stores about your training, why, and what you can do about it.",
  preamble:
    "This policy explains what personal data Valhalla collects when you use the product, what it is used for, how long it is kept, and the rights you have over it. It is written to describe what the product actually does today, in the invited private beta, rather than what it might do in future. Where something is switched off, it says so.",
  lastUpdated: BETA_LEGAL_EFFECTIVE_DATE,
  sections: [
    {
      heading: "Who is responsible for your data",
      paragraphs: [
        `Valhalla is operated by ${entityDescription()}. For data protection purposes, we are the data controller for the personal data described in this policy.`,
        `If you have a question about your data, or want to exercise any of the rights set out below, contact us at ${legalEntity.contactEmail}.`,
      ],
    },
    {
      heading: "What we collect",
      paragraphs: [
        "Account data: your email address, and the authentication records needed to sign you in. You sign in with a link we email you, so you do not create or use a password to access Valhalla.",
        "Programme data: the answers you give when you set up a training block — your goal distance and date, your current weekly volume, the days you can run, your benchmark time, and your goal times — and the plan Valhalla generates from them.",
        "Completed workouts: for each session you log, the distance covered, the pace, your heart rate where you record it, your rating of perceived effort, how the session felt, any lap or split figures you enter by hand, and any notes you write. Where you use the notes tool that reads your own text back to you, we also keep the original wording alongside what it picked out.",
        "Daily check-in: when you record it, how you are feeling that day — your general health, how your legs feel, and how you slept. You can use Valhalla without providing this.",
        "Injury, pain and illness information where you supply it: if you tell Valhalla you are in pain, unwell, or carrying a niggle — whether through the daily check-in or in a session note — that is stored with the session or day it relates to and is used to decide what to recommend next, including recommending that you do not run.",
        "Coaching data: the outputs Valhalla produces about your training, including execution reviews, proposed plan changes, and the record of whether you accepted or declined them.",
        "Preferences: units, theme, and whether you have enabled reminders.",
        "Connected services: Valhalla can support a connection to Strava, but that integration is switched off and no Strava data is collected for anyone in this beta. If it is enabled in future, we would store the access credentials for the connection and the activity data it returns, you would choose whether to connect, and you could disconnect at any time. This policy will be updated before that happens.",
        "We do not use analytics, advertising or tracking technology. We do not collect advertising identifiers, and we do not track your behaviour across other websites or apps.",
      ],
    },
    {
      heading: "What we use it for",
      paragraphs: [
        "To create and adjust your training plan, and to produce the coaching output that is the substance of the product. Without your training data, Valhalla cannot do the thing you came to it for.",
        "To decide what to recommend next, including holding you back or telling you not to run when what you have recorded says you should not.",
        "To keep your plan and history available across your devices, and to restore it if you sign in again later.",
        "To operate the service — authenticating you, keeping the service secure and available, and diagnosing faults.",
        "To handle your support requests, and to hear your feedback on the beta.",
        "That is the complete list. We do not run analytics over your data, we do not measure your behaviour in the product, and we do not build advertising or behavioural profiles.",
      ],
    },
    {
      heading: "What we will not do with it",
      paragraphs: [
        "We do not sell your personal data, and we do not share it with third parties for their own marketing.",
        "We do not use your individual training data to train or fine-tune machine learning models offered to anyone else, and we do not make your data available to third parties for that purpose.",
      ],
    },
    {
      heading: "Where your data is stored",
      paragraphs: [
        "Your account and training data are stored in a managed database hosted in the European Union, provided by Supabase acting as our data processor. Vercel hosts the website, the application and the small server functions that talk to the database. Both process the data only to provide the service to us, and under contract.",
        "The Valhalla application also stores a copy of your current plan and recent activity on your own device, so the product remains usable when you are offline or have a poor connection. Data held on your device is under your control and is removed when you uninstall the application or clear its data.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "While your account is open, we keep your training history so that it remains available to you and so that coaching decisions can take your history into account. Losing your history would degrade the product for you, so we do not delete it routinely.",
        "If this beta ends, or if Valhalla later becomes a paid product and you do not continue, your record of your own training does not disappear for that reason. We will tell you before anything changes about how long we keep it.",
        "If you delete your account, we delete your account and the training data associated with it from our live systems straight away. Copies can persist for a short period in routine encrypted backups taken by our database provider before those backups rotate out, and we may retain a minimal record where the law requires it.",
        `If you want your data deleted and would rather not do it yourself in the app, email ${legalEntity.contactEmail} and we will do it for you.`,
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "Under UK data protection law you have the right to access a copy of your data, to have inaccurate data corrected, to have your data erased, to obtain your data in a portable form, and to object to or restrict certain processing.",
        "You can delete your account from within the product at any time. For any other request, contact us and we will respond within the period required by law.",
        "If you are unhappy with how we have handled your data, you have the right to complain to the Information Commissioner's Office (ico.org.uk).",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "If we make a material change to how we handle your data, we will tell you before it takes effect. The date at the top of this page shows when it was last updated.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// TERMS OF USE (draft)
// ---------------------------------------------------------------------------

export const termsDraft: LegalDocument = {
  eyebrow: "Velvet Viking",
  heading: "Terms",
  sub: "The agreement between you and Velvet Viking when you use Valhalla.",
  preamble:
    "These terms set out what you can expect from Valhalla, what we expect from you, and the limits of both. They are written to be read, not to be survived. If anything here is unclear, ask us before you subscribe.",
  // Set when HQ approves publication, not by whoever last edited the file.
  lastUpdated: TBC("effective date, set on publication"),
  sections: [
    {
      heading: "1. Who we are",
      paragraphs: [
        `Valhalla is operated by ${legalEntity.name} (company number ${legalEntity.companyNumber}), registered in ${legalEntity.placeOfRegistration} at ${legalEntity.registeredAddress}. In these terms, "we" and "us" means that company, and "you" means the person using the product.`,
        `You can reach us at ${legalEntity.contactEmail}. That address is also where complaints go, and a person reads it.`,
      ],
    },
    {
      heading: "2. What Valhalla is",
      paragraphs: [
        "Valhalla builds an endurance training plan from the information you give it, reviews the sessions you log against that plan, and proposes changes to your future training when the evidence supports it. You decide whether to accept a proposed change.",
        "Valhalla is a training tool. It is not a qualified human coach, and it is not a medical service. Section 6 explains what that means in practice.",
      ],
    },
    {
      heading: "3. Your account and the information you give us",
      paragraphs: [
        "You must be at least 18 to create an account. One account is for one person.",
        "You are responsible for the email address your account uses and for anything done through it. Tell us promptly if you think someone else has access.",
        "The plan Valhalla produces is built from what you tell it about your fitness, your goal and the days you can train. If that information is wrong or out of date, the plan will be too. Keeping it accurate is your part of the arrangement.",
      ],
    },
    {
      heading: "4. Subscriptions, and what they cost",
      paragraphs: [
        "Valhalla is sold as one subscription with one set of features. There is no cheaper tier with less in it, and no more expensive tier with more.",
        "You choose how often you are billed. Monthly is billed every month, and annual is billed once a year. Both give you exactly the same product; the only difference is the billing period and the price.",
        "The current prices are shown on our pricing page and again before you commit. Prices include VAT where it applies.",
      ],
    },
    {
      heading: "5. The free trial, and how it becomes a paid subscription",
      paragraphs: [
        "New subscribers are offered a 14-day free trial. This is not a card-free trial, and it does not simply expire.",
        "Before the trial begins you choose monthly or annual billing and provide a valid payment method. You are shown the price you have chosen and the date the first payment would be taken before you confirm anything. Nothing is charged to start the trial.",
        "You get the complete product for the 14 days. Nothing is held back for paying subscribers.",
        "If you cancel before the trial ends, the subscription does not begin and you are not charged. If you do not cancel, the subscription you chose starts automatically when the trial ends and the first payment is taken at the price you selected. Cancelling is what stops it; doing nothing does not.",
        "One trial per person. We may decline a trial to an account that has had one before.",
      ],
    },
    {
      heading: "6. Training, health and your own judgement",
      paragraphs: [
        "Endurance training carries risk, and only you know how you actually feel. You are responsible for deciding whether you are well enough to train on a given day, and for stopping when you should. If you have a health condition, are returning from injury, are pregnant, or are unsure whether training is safe for you, speak to a qualified medical professional before starting.",
        "Valhalla does not diagnose, treat, monitor or prevent illness or injury, and nothing it produces is medical advice or medical clearance. When it tells you to ease off, hold a plan or recover, it is making a training judgement from the information you have given it, not a clinical one.",
        "None of that reduces our own responsibility for the product itself. If Valhalla does not work as described, section 12 and your statutory rights apply in the ordinary way. This section is about the difference between a training tool and a doctor, not an attempt to disclaim everything Valhalla does.",
      ],
    },
    {
      heading: "7. Payment",
      paragraphs: [
        "By providing a payment method and starting a trial or subscription, you authorise us to take the payments described in section 5 on the schedule you chose, until you cancel.",
        "We are the merchant: you are buying the service from us, and we are responsible to you for it. Card payments for web subscriptions are handled by Stripe, our payment processor. Your card details are given to Stripe, not to us. We do not receive or store your full card number, its expiry date or its security code.",
        "Your subscription, including the trial period, is held as a subscription with that processor, which is what makes the dates and the automatic conversion described above work the way they do.",
        "If a payment fails we may retry it, and we may suspend paid access until it succeeds. We will tell you if that happens.",
      ],
    },
    {
      heading: "8. Cancelling",
      paragraphs: [
        "You can cancel at any time. There is always a route to cancel a running subscription: on the web you can manage it through the billing controls in your account, and if that is unavailable to you for any reason, contact us and we will cancel it for you. Cancelling is meant to take a moment, and we will not put obstacles in the way of it.",
        "Where you subscribed through an app store, that store's own subscription controls apply and we will tell you where to find them.",
        "Cancelling during the 14-day trial stops the subscription before it starts, and you are not charged.",
        "Cancelling an active subscription stops it renewing. Your access continues to the end of the period you have already paid for, and then ends. We do not cut short a period you have paid for, and we do not take further payments after a valid cancellation.",
        "Deleting the app from your phone does not cancel a subscription. Neither does simply not using it. Use the cancellation route in your account, and if that is not working for you, email us and we will deal with it.",
        `If you have any difficulty cancelling, contact ${legalEntity.contactEmail}.`,
      ],
    },
    {
      heading: "9. Refunds, and your rights as a consumer",
      paragraphs: [
        "Nothing in these terms removes or limits the rights the law gives you as a consumer. Where the law entitles you to a refund, you will get one, and the rest of this section is subject to that.",
        "Cancelling and being refunded are different things. Cancelling stops future payments. It does not by itself entitle you to a refund of a payment already properly taken for a period you have had access to.",
        "You have a statutory right to change your mind about a contract bought at a distance, within 14 days. Where you have asked us to start the service immediately and acknowledged that doing so affects that right, the position is as the law provides. If you want to rely on this right, tell us and we will deal with it properly rather than argue about it.",
        "If the service is faulty, not as described, or not fit for the purpose we described, your statutory remedies under consumer law apply, which may include a repair, a price reduction or a refund depending on the circumstances.",
        "If you are charged twice for the same period, charged after a valid cancellation, or charged an amount you did not agree to, tell us and we will refund the incorrect charge.",
        "Outside those situations we are not promising a refund as a matter of course, and you should not subscribe on the assumption of one. We will still look at individual circumstances and may refund where it seems right to us to do so. That is a discretion we are describing honestly, not a guarantee, and choosing not to exercise it in one case does not oblige us in another.",
        `Billing questions and disputes: ${legalEntity.contactEmail}. Tell us what you were charged and when, and we will look into it.`,
      ],
    },
    {
      heading: "10. Price changes",
      paragraphs: [
        "We may change our prices. If we change the price of a subscription you already have, we will tell you in advance, the new price will only apply from your next billing period, and you may cancel before it takes effect if you do not want to continue at the new price.",
        // FOUNDING PRICE: conditional by construction. With the flag off this
        // sentence describes a mechanism that is only ever engaged by an offer
        // actually saying so, which is true when no such offer exists. It is
        // deliberately not a promise that any offer is running, because System
        // has not finished the implementation that would honour one.
        "Where an offer is described to you at the point of sale as holding your price for as long as your subscription continues without interruption, that offer's own terms apply and we will honour them. If an offer does not say that, no price lock applies to it.",
        ...(COMMERCIAL_FEATURES.subscriptionPause
          ? [
              "Where a pause is available on your subscription, its terms are shown to you when you use it.",
            ]
          : []),
      ],
    },
    {
      heading: "11. Connected services",
      paragraphs: [
        "Valhalla can connect to Strava, so that activities you record there can be brought into your training record. Connecting is your choice, you are asked to authorise it through Strava itself, and you can disconnect at any time from your account settings or from within Strava. We only ask for the access needed to read the activities you choose to share, and disconnecting stops any further data coming across.",
        "Strava is a separate company. It does not endorse Valhalla, and it is not responsible for it. Your use of Strava is governed by Strava's own terms.",
        "We may add other optional connections to devices and services in future, including the ability to send workouts to a watch. Any such connection will be optional, will ask for your authorisation, will be described in our Privacy Policy before it starts operating, and will be disconnectable in the same way.",
        "We are not responsible for a third-party service being unavailable, changing what it offers, or ending its access. If a connection stops working through no fault of ours, we will tell you.",
      ],
    },
    {
      heading: "12. Availability, changes and our responsibility to you",
      paragraphs: [
        "We aim to keep Valhalla available and working properly, and we owe you reasonable care and skill in providing it. We do not guarantee that it will never be unavailable: we may need to suspend it for maintenance, and things occasionally break.",
        "We may change or remove features as the product develops. If we make a change that materially reduces what you are paying for, we will tell you and you may cancel.",
        "We do not exclude or limit our liability where it would be unlawful to do so. That includes liability for death or personal injury caused by our negligence, for fraud or fraudulent misrepresentation, and for anything else that cannot lawfully be excluded.",
        "Otherwise, we are responsible for loss you suffer that is a foreseeable result of our breaking these terms or failing to use reasonable care and skill. We are not responsible for loss that was not foreseeable, or for business losses, since Valhalla is supplied for personal use.",
        TBC(
          "liability cap, if any — for the solicitor, not for System. No monetary cap has been drafted: under the Consumer Rights Act 2015 an unreasonable cap in a consumer contract is unenforceable and its presence can taint the surrounding clause. This section is complete and enforceable as it stands. Decide whether to add one, rather than assuming one is missing.",
        ),
      ],
    },
    {
      heading: "13. Your training data, and our material",
      paragraphs: [
        "You keep ownership of the training data you put into Valhalla. We do not claim it. Whether or not you are currently subscribed, you can view, export and delete your own training history. We do not hold your history hostage to a subscription.",
        "The Valhalla software, interfaces, workout library, plan structures, coaching output and the methodology behind them are ours or licensed to us. You may use them to train. You may not copy, scrape or bulk-extract them, reverse engineer them, or use automated means to access the service beyond what we permit, except where the law expressly allows it.",
        "In particular you may not use the product or its outputs to build, train, evaluate or operate a competing product, or supply them to someone else for that purpose.",
        "You may not use Valhalla unlawfully, attempt to gain access to another person's account, or interfere with the service's operation or security.",
      ],
    },
    {
      heading: "14. Suspension, ending, and deleting your account",
      paragraphs: [
        "You can stop using Valhalla and delete your account at any time from within the product. Deleting your account is not the same as cancelling a subscription; if you have an active subscription, cancel it as well, and tell us if anything looks wrong afterwards.",
        "We may suspend or end your access if you seriously or repeatedly break these terms, or if we are required to by law. Where it is reasonable to do so we will tell you first and give you a chance to put it right. If we end your access and you have paid for a period you cannot now use, we will refund the unused part unless the reason was your own serious breach.",
        "What happens to your data on deletion is described in our Privacy Policy.",
      ],
    },
    {
      heading: "15. Changes to these terms, complaints, and the law that applies",
      paragraphs: [
        "We may update these terms. If a change materially affects you we will tell you before it takes effect, and you may cancel if you do not accept it. Changes will not apply retrospectively to a period you have already paid for.",
        `If something has gone wrong, tell us at ${legalEntity.contactEmail} and we will try to put it right. If you are not satisfied with how we have dealt with it, you may be able to use an alternative dispute resolution scheme, and you can always go to court.`,
        "These terms are governed by the law of England and Wales. If you live in Scotland or Northern Ireland you may bring proceedings in your own courts, and you keep the benefit of any mandatory consumer protections of the country you live in.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// COOKIE POLICY (draft)
// ---------------------------------------------------------------------------

export const cookiesDraft: LegalDocument = {
  eyebrow: "Velvet Viking",
  heading: "Cookies",
  sub: "What this website and the Valhalla app store on your device, and why there is so little of it.",
  preamble:
    "This page covers cookies and the other ways a site or app can store and read information on your device — local storage, session storage and similar. It is short because the inventory is short, and everything in it is listed because it is actually there, not because policies usually mention it.",
  lastUpdated: TBC("effective date, set on publication"),
  sections: [
    {
      heading: "This website sets no cookies at all",
      paragraphs: [
        "The Velvet Viking marketing website — the pages you are reading now — sets no cookies, writes nothing to local storage or session storage, and runs no analytics, advertising or tracking scripts. There is no consent banner because there is nothing to consent to.",
        "Our typefaces are served from our own domain rather than fetched from a font provider while you browse, so viewing these pages does not disclose your visit to a third party for that purpose. There are no embedded videos, social widgets, pixels or tags.",
        "This is a factual statement about the site as it stands, not a promise about the future. If we ever add anything that is not strictly necessary, we will ask for your consent before it is set, and refusing will be as easy as accepting.",
      ],
    },
    {
      heading: "The Valhalla app, once you have an account",
      paragraphs: [
        "Signing in to Valhalla is different, because an application that keeps you signed in has to remember something. What it stores falls into two groups.",
        "Authentication and security. When you sign in, the app stores a session token on your device so you stay signed in and so each request can be recognised as yours. It is set by us and by our authentication provider, it lasts until it expires or you sign out, and it is strictly necessary: without it there is no way to be signed in. Signing out or clearing the app's data removes it.",
        "Your plan and your preferences. The app keeps a copy of your current plan, your recent training and your settings — units, theme, whether reminders are on — on your own device, so the product still works when you are offline or on a poor connection. This is strictly necessary for the service you have asked for, is never read by anyone else, and is removed when you sign out, uninstall the app, or clear its data.",
        "Neither group is used to build a profile of you, to follow you between apps or websites, or for advertising.",
      ],
    },
    {
      heading: "Strictly necessary, and what that means for consent",
      paragraphs: [
        "Under UK law, storing or reading information on your device generally requires your consent, with an exception for storage that is strictly necessary to provide a service you have asked for. Everything listed above falls within that exception: it exists to sign you in, keep that session secure, and let the app you asked for actually run.",
        "That is why you are not asked to consent to it, and also why you cannot switch it off while continuing to use the product. You can always clear it through your browser or device settings, which will sign you out.",
        "We do not currently rely on any of the newer exceptions that permit limited low-risk measurement without consent. We do not carry out that measurement at all.",
      ],
    },
    {
      heading: "What we do not do",
      paragraphs: [
        "No advertising cookies. No cross-site or cross-app tracking. No third-party marketing analytics. No advertising identifiers. No sale or sharing of device identifiers.",
        "If any of that changes, this page will be updated before it happens, and any non-essential storage will be set only after you have agreed to it.",
      ],
    },
    {
      heading: "Questions",
      paragraphs: [
        `If you want to know exactly what is stored for your account, or you think something here is out of date, contact ${legalEntity.contactEmail}.`,
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// COMMERCIAL PRIVACY POLICY (draft — replaces privacyDraft at paid launch)
// ---------------------------------------------------------------------------
//
// Everything the live policy says that is still true is carried over unchanged.
// What is added is the processing that only exists once money and integrations
// do: subscription state, a payment processor, conditional device connections,
// and the retention of financial records after deletion.
//
// TWO THINGS ARE STATED CONDITIONALLY ON PURPOSE. Strava and Garmin are both
// behind environment flags in the app (VVV_STRAVA_ENABLED, VVV_GARMIN_ENABLED),
// so neither may be described as operating. A policy that claims processing
// which is switched off is as wrong as one that omits processing which is on.

export const privacyCommercialDraft: LegalDocument = {
  eyebrow: "Velvet Viking",
  heading: "Privacy",
  sub: "What Valhalla stores about your training, why, and what you can do about it.",
  preamble:
    "This policy explains what personal data we collect when you use Valhalla, what we use it for, who else is involved, how long we keep it, and the rights you have. It describes what the product actually does. Where something is switched off, it says so rather than describing it as if it were running.",
  lastUpdated: TBC("effective date, set on publication"),
  sections: [
    {
      heading: "Who is responsible for your data",
      paragraphs: [
        `Valhalla is operated by ${entityDescription()}. For data protection purposes we are the data controller for the personal data described here.`,
        `To exercise any of the rights below, or to ask a question about your data, contact ${legalEntity.contactEmail}.`,
      ],
    },
    {
      heading: "What we collect",
      paragraphs: [
        "Account data: your email address and the authentication records needed to sign you in. You sign in with a link we email you, so there is no password.",
        "Programme data: the answers you give when you set up a training block — your goal distance and date, your current weekly volume, the days you can run, your benchmark performance and your goal times — and the plan Valhalla builds from them.",
        "Completed sessions: for each session you log, the distance, the pace, your heart rate where it is recorded or imported, your rating of perceived effort, how the session felt, any splits you enter, and any notes you write.",
        "Daily check-in, where you record it: how you are feeling that day, how your legs feel, and how you slept. You can use Valhalla without providing this.",
        "Injury, pain and illness information where you supply it, through the check-in or in a session note. It is stored with the day it relates to and used to decide what to recommend next, including recommending that you do not run.",
        "Coaching output: what Valhalla produces about your training — execution reviews, athlete-state and readiness assessments, proposed plan changes, and whether you accepted or declined them. This accumulates into a longitudinal record of your training, which is what lets coaching decisions take your history into account.",
        "Subscription data: which plan you are on, your billing period, whether you are in a trial and when it ends, and the status of your payments. We do not receive or store your full card number, expiry or security code.",
        "Support correspondence: what you write to us and what we reply.",
        "Operational and security information: records needed to keep the service running and to detect and prevent abuse, such as authentication events and error diagnostics. This includes the date and time your account last received access, recorded no more than once an hour. It tells us an account is in use; it is not a behavioural analytics stream, and we deliberately do not build one. Our diagnostic logs are written so as not to contain email addresses, tokens, secrets, signatures or full provider error payloads.",
        "We do not use analytics, advertising or tracking technology, and we do not collect advertising identifiers.",
      ],
    },
    {
      heading: "Information that can indicate something about your health",
      paragraphs: [
        "Some of what Valhalla holds is ordinary training information — distance, pace, the days you can run. Some of it is not so easily categorised. Heart rate, how you slept, how your legs feel, an entry saying you are unwell or in pain, and the readiness assessments built from them can all say something about your physical condition.",
        "We do not treat everything as health data, because that would be inaccurate, and we do not pretend none of it is, because that would be worse. Where you tell Valhalla you are injured, in pain or ill, that is information about your health, and you are choosing to give it to us so the product can respond to it.",
        "You are never required to provide it. The check-in is optional, notes are optional, and Valhalla works without them, with less to go on.",
        TBC(
          "Article 9 condition for the health-indicating categories above — THE ONE SUBSTANTIVE LEGAL DECISION LEFT, and a solicitor's, not System's. The ordinary account, subscription and training processing rests on the contract between us. That does not by itself resolve Article 9, and this draft does not pretend it does. The likely answer for the optional inputs that can reveal health — heart rate, sleep, injury or pain, how you feel — is explicit consent, which would require the app to ask for it, and today the app does not. Decide the condition, then decide whether a consent step must ship before this policy is published. Confirmed by System: none of this information is sent to monday.com or to Stripe, none of it is used for advertising, and none of it feeds a secondary analytics warehouse.",
        ),
      ],
    },
    {
      heading: "What we use it for",
      paragraphs: [
        "To build and adjust your training plan, and to produce the coaching output that is the substance of the product.",
        "To decide what to recommend next, including holding you back or telling you not to run when what you have recorded says you should not.",
        "To keep your plan and history available across your devices, and to restore it when you sign in again.",
        "To take payment, manage your subscription and trial, and keep the financial records we are required to keep.",
        "To operate the service — signing you in, keeping it secure and available, and diagnosing faults.",
        "To answer your support requests.",
        "That is the complete list. We do not profile you for advertising, and we do not measure your behaviour in the product for marketing purposes.",
      ],
    },
    {
      heading: "What we will not do with it",
      paragraphs: [
        "We do not sell your personal data, and we do not share it with third parties for their own marketing.",
        "We do not use your individual training data to train or fine-tune machine learning models offered to anyone else, and we do not make it available to third parties for that purpose.",
      ],
    },
    {
      heading: "Who else is involved",
      paragraphs: [
        "We use a small number of service providers, each acting on our instructions under contract, and each with access only to what it needs.",
        "Hosting and database: our managed database is provided by Supabase and hosted in the European Union. Vercel hosts the website, the application and the server functions that talk to the database.",
        "Authentication and database: Supabase provides our authentication and our managed database. Signing in uses a link we email you rather than a password, so no password for Valhalla exists to be stored or stolen. Sending that link necessarily processes your email address, and the sign-in email is currently delivered through our authentication provider's own sending infrastructure.",
        "Payments: card payments for web subscriptions are handled by Stripe as our payment processor. Your card details go to Stripe and not to us. We receive the state of your subscription and its payments — whether you are in a trial, when it ends, whether a payment succeeded — and never your full card number, expiry or security code.",
        "Internal operations: we use monday.com as an operational mirror for commercial and lifecycle tasks. It receives operational state only, against a pseudonymous reference rather than your account identifier. It does not receive your training sessions, heart rate, pace, perceived effort, readiness or athlete-state information, your notes, your training history, any other coaching evidence about you, or your payment-provider customer identifier. It is not a source of truth about what you are entitled to.",
        "We do not otherwise disclose your data, except where we are legally required to.",
      ],
    },
    {
      heading: "Connected services, when you choose to use them",
      paragraphs: [
        "Valhalla supports optional connections to services you already use. Every one of them is off until you connect it, requires your authorisation through the other service, and can be disconnected at any time from your account settings.",
        "Strava. If you choose to connect it, we ask Strava only for permission to read your activities. We do not ask for permission to write anything back to Strava, and we do not ask for your Strava profile. The access credentials for the connection are held server-side in storage that is closed to direct access, and the activities we receive become part of your training record.",
        "Disconnecting is immediate and complete: we delete the stored credentials, delete the Strava activities we had staged, and tell Strava to revoke our access. If Strava stops accepting our credentials, we clear the connection rather than leave it looking connected when it is not.",
        "Strava is a separate company with its own privacy policy and terms, and it does not endorse Valhalla.",
        "Devices and watches, including Garmin. Garmin is not currently available. No Garmin connection exists, no Garmin data is received and none is sent. The groundwork is in place on our side, but until it is switched on there is nothing to describe. If that changes we will update this policy before any data flows, and connecting will remain your choice.",
        "If a connection is not enabled for your account, no data passes to or from it.",
      ],
    },
    {
      heading: "Where your data is stored, and transfers",
      paragraphs: [
        "Your account and training data are stored in a managed database hosted in the European Union.",
        "Some of our providers are established outside the UK or operate support functions elsewhere. Where personal data is transferred outside the UK, we rely on the safeguards UK data protection law requires, such as adequacy regulations or standard contractual clauses with the additional protections that go with them.",
        "The Valhalla application also keeps a copy of your current plan and recent activity on your own device so it works offline. That copy is under your control and is removed when you uninstall the app or clear its data.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "While your account is open we keep your training history, so it stays available to you and so coaching decisions can take it into account. We do not delete it routinely — losing your history would make the product worse for you.",
        "If you delete your account, we delete your account and the training data associated with it from our live systems. Copies can persist briefly in routine encrypted backups before those rotate out.",
        "Records of payments we have taken are not deleted with your account, because we are required to keep financial and tax records. When your account is deleted, those billing records are separated from it: the account and subscription identifiers are cleared from them, leaving a de-identified financial record. That record holds no email address, no name, no postal address, no card details, no IP address and no payment-provider payload. It exists for accounting, tax, fraud prevention and legal obligations, and it cannot be used to reconstruct your training.",
        `If you would rather we deleted your account for you, email ${legalEntity.contactEmail}.`,
      ],
    },
    {
      heading: "Cookies and storage on your device",
      paragraphs: [
        "The marketing website sets no cookies and stores nothing on your device. The application stores what it needs to keep you signed in and to work offline. Our Cookie Policy sets out the full inventory.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "Under UK data protection law you have the right to access a copy of your data, to have inaccurate data corrected, to have your data erased, to obtain it in a portable form, and to object to or restrict certain processing. Where we rely on your consent for anything, you can withdraw it at any time, and withdrawing it does not affect what was done before.",
        "You can delete your account from within the product at any time. For anything else, contact us and we will respond within the period the law requires.",
        "If you are unhappy with how we have handled your data, please tell us first so we can put it right. You also have the right to complain to the Information Commissioner's Office at ico.org.uk.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "If we make a material change to how we handle your data, we will tell you before it takes effect. The date at the top of this page shows when it was last updated.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// PRIVATE BETA TERMS (draft)
// ---------------------------------------------------------------------------
//
// Separate from termsDraft on purpose. The full Terms are written for a paid
// commercial relationship; these are for five invited, non-paying testers using
// pre-release software. Deliberately short — burying five people who are doing
// us a favour in a commercial contract would be both disproportionate and
// counterproductive. Replaced by termsDraft at commercial launch, not extended.

export const betaTermsDraft: LegalDocument = {
  eyebrow: "Velvet Viking",
  heading: "Private Beta Terms",
  sub: "The short version of what taking part in the Valhalla private beta means.",
  preamble: `You have been invited to test Valhalla before it is finished. These terms are deliberately brief, and cover what you can expect from us and what we ask of you. They are between you and ${entityDescription()}, and they apply to the invited private beta only — if Valhalla later becomes a paid product, different terms will apply and you will see them before anything changes.`,
  lastUpdated: BETA_LEGAL_EFFECTIVE_DATE,
  sections: [
    {
      heading: "1. This is pre-release software",
      paragraphs: [
        "Valhalla is not finished. It will contain defects. Expect bugs, rough edges, and changes between one week and the next: features may be added, altered or removed while you are testing, and a plan or a screen you got used to may not look the same next month.",
        "It is provided as it is, for testing, with no promise that it is fit for any particular purpose.",
        "We will do our best not to lose your training data, but you should not treat the beta as the only record of your training.",
      ],
    },
    {
      heading: "2. Taking part is voluntary and free",
      paragraphs: [
        "There is no charge for beta access, no subscription, no trial that turns into a payment, and no card details asked for or held. Nothing in this beta costs money.",
        "There is no obligation to continue. You can stop at any time, for any reason, without explaining why — just tell us, or delete your account in the app.",
        "Beta access is personal to you and tied to the email address we invited. Please do not share your access with anyone else.",
      ],
    },
    {
      heading: "3. What we ask of you",
      paragraphs: [
        "Use it as you would normally train, and tell us what you find — especially anything confusing, wrong, or that made you lose confidence in what the app was telling you.",
        "Please do not publicly share screenshots, coaching output or details of unreleased features while the beta is running. We are not asking you to keep the existence of Valhalla secret — just to hold off on publishing the inside of it.",
      ],
    },
    {
      heading: "4. Feedback",
      paragraphs: [
        "If you send us feedback, ideas or bug reports, we may use them to improve Valhalla without restriction and without owing you payment. You are not giving up anything else by taking part, and you keep ownership of your own training data.",
      ],
    },
    {
      heading: "5. Valhalla is a training tool, not a medical one",
      paragraphs: [
        "Valhalla makes training judgements from the training data you give it. It does not diagnose, treat or monitor injury or illness, it cannot tell whether you are injured, and nothing it says is medical advice or medical clearance.",
        "You are responsible for deciding whether you are well enough to train, and for stopping when you should. If you have a health condition, are coming back from injury, or are unsure whether training is safe for you, speak to a qualified professional. If something hurts, trust that over the app.",
      ],
    },
    {
      heading: "6. Availability, and ending access",
      paragraphs: [
        "The beta may be unavailable at times, and we may end it, or your access to it, at any point. If we end the beta we will tell you beforehand where we reasonably can, and explain what happens to your data.",
        "We do not exclude our liability for death or personal injury caused by our negligence, or for fraud, and nothing here affects your statutory rights. Beyond that, and because this is free pre-release software provided as-is, our liability to you is limited to the fullest extent the law allows.",
      ],
    },
    {
      heading: "7. Your data, and the law that applies",
      paragraphs: [
        "How we handle your data is set out in the Privacy Policy at /privacy, which forms part of these terms. In short: your training data is yours, you can export or delete it, and we do not sell it or use it to train models for anyone else.",
        `These terms are governed by the law of ${legalEntity.placeOfRegistration}, and its courts have jurisdiction. Nothing here affects your statutory rights, and if you live elsewhere in the UK you keep the protection of your local consumer law.`,
        `Questions, problems, or anything at all: ${legalEntity.contactEmail}.`,
      ],
    },
  ],
};
