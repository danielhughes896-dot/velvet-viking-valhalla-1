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

/** Placeholder token, so unresolved business facts are greppable before launch. */
const TBC = (what: string) => `[TO BE CONFIRMED: ${what}]`;

// SUPPLIED BY HQ: the registered name, the company number and the place of
// registration. The registered office address has NOT been supplied and is not
// guessed — the Companies (Trading Disclosures) Regulations want the address as
// filed, and a nearly-right address is worse than an absent one. It is the single
// outstanding disclosure fact; see the report accompanying this change.
export const legalEntity = {
  name: "Velvet Viking Ltd",
  companyNumber: "17404255",
  placeOfRegistration: "England and Wales",
  registeredAddress: TBC("registered office address, exactly as filed at Companies House"),
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
    "These terms set out what you can expect from Valhalla, what we expect from you, and the limits of both. By creating an account you agree to them.",
  lastUpdated: TBC("effective date"),
  sections: [
    {
      heading: "1. Who we are, and who these terms are with",
      paragraphs: [
        `Valhalla is a training product operated by ${legalEntity.name} (company number ${legalEntity.companyNumber}), registered at ${legalEntity.registeredAddress}. In these terms, "we" and "us" means that company, and "you" means the person using the product.`,
        "You must be at least 18 years old to create an account.",
      ],
    },
    {
      heading: "2. What Valhalla is",
      paragraphs: [
        "Valhalla builds an endurance training plan from the information you give it, reviews the sessions you log against that plan, and proposes changes to your future training when the evidence supports it. You decide whether to accept any proposed change.",
        "Valhalla is a training tool. It is not a substitute for a qualified coach, and it is not a medical service — see section 5.",
      ],
    },
    {
      heading: "3. Your account",
      paragraphs: [
        "You are responsible for the email address associated with your account and for anything done through it. Tell us promptly if you think someone else has gained access.",
        "The information you give Valhalla about your fitness and availability shapes the plan it produces. If that information is inaccurate, the plan will be too.",
        "You may delete your account at any time from within the product.",
      ],
    },
    {
      heading: "4. Subscription, trial, cancellation and refunds",
      paragraphs: [
        "Paid access is sold as a subscription. Where a free trial is offered, the price you will be charged, and the date the first charge will be taken, are shown to you before you start the trial. You may cancel at any time before that date and you will not be charged.",
        "If you cancel a paid subscription, your access continues until the end of the period you have already paid for, and then stops. We do not cut short a period you have paid for.",
        "Your statutory cancellation rights as a consumer are unaffected by these terms.",
        "When your paid access ends, you keep access to your own training history. What stops is the generation of new coaching output — see section 6.",
        TBC(
          "refund policy — whether discretionary or fixed, and how it interacts with the statutory 14-day cancellation right",
        ),
      ],
    },
    {
      heading: "5. Valhalla is not medical advice",
      paragraphs: [
        "Valhalla does not diagnose, treat or monitor illness or injury, and nothing it produces is medical advice or medical clearance. It cannot tell whether you are injured, and it does not try to.",
        "Endurance training carries risk. You are responsible for deciding whether you are well enough to train, and for stopping when you should. If you have a health condition, are returning from injury, or are unsure whether training is safe for you, speak to a qualified medical professional.",
        "Where Valhalla suggests easing off or recovering, it is making a training judgement from the data you have given it — not a clinical one. Treat it as one input, not as permission or prohibition.",
      ],
    },
    {
      heading: "6. Your training data belongs to you",
      paragraphs: [
        "You keep ownership of the training data you put into Valhalla. We do not claim ownership of it.",
        "Whether or not you are currently paying, you can view, edit and export your own training history, and you can delete it. We do not hold your history hostage to a subscription.",
        "We grant you a licence to use the coaching output Valhalla produces for you, for your own training. That licence does not extend to the uses described in section 7.",
      ],
    },
    {
      heading: "7. Our material, and what you may not do with it",
      paragraphs: [
        "The Valhalla software, interfaces, workout library, training-plan structures, coaching content and the methodology by which plans are produced and adapted are our property or licensed to us, and are protected by intellectual property rights.",
        "You may use them to train. You may not, to the extent permitted by law: copy, scrape, harvest or bulk-extract the workout library, plan structures or coaching output; reverse engineer, decompile or attempt to derive the underlying methodology; use automated means to access the service other than as we expressly permit; or resell, sublicense or redistribute any part of it.",
        "In particular, you may not use the product, its outputs or any data extracted from it to build, train, evaluate, benchmark, operate or support a competing or substantially similar product or service, whether directly or by supplying it to someone else for that purpose.",
        "These restrictions do not limit anything you are entitled to do by law, and do not apply to your own training data, which is covered by section 6.",
      ],
    },
    {
      heading: "8. Availability",
      paragraphs: [
        "We aim to keep Valhalla available and working, but we do not guarantee uninterrupted service. We may need to suspend access for maintenance, and we may change or withdraw features.",
        "If we make a change that materially reduces what you are paying for, we will tell you, and you may cancel.",
      ],
    },
    {
      heading: "9. Our responsibility to you",
      paragraphs: [
        "We do not exclude or limit our liability where it would be unlawful to do so — including for death or personal injury caused by our negligence, or for fraud.",
        TBC(
          "liability cap and exclusions — must be drafted and checked against the Consumer Rights Act 2015 before publication",
        ),
        "Nothing in these terms affects your statutory rights as a consumer.",
      ],
    },
    {
      heading: "10. Ending this agreement",
      paragraphs: [
        "You can stop using Valhalla and delete your account at any time.",
        "We may suspend or end your access if you breach these terms — in particular section 7 — or if we are required to by law. Where it is reasonable to do so, we will tell you first.",
      ],
    },
    {
      heading: "11. Changes, and the law that applies",
      paragraphs: [
        "We may update these terms. If a change materially affects you, we will tell you before it takes effect, and you may cancel if you do not accept it.",
        TBC("governing law and jurisdiction — expected England and Wales; to be confirmed"),
        `Questions about these terms: ${legalEntity.contactEmail}.`,
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
  sub: "What Valhalla stores in your browser, and why there is not much of it.",
  preamble:
    "This page describes the cookies and similar local storage Valhalla uses. It is short because the product deliberately does not use advertising or cross-site tracking technology.",
  lastUpdated: TBC("effective date"),
  sections: [
    {
      heading: "Essential cookies",
      paragraphs: [
        "We use cookies that are strictly necessary to operate the service: keeping you signed in, keeping your session secure, and remembering essential preferences.",
        "These are required for the product to function. They do not require consent under UK law, and you cannot turn them off while continuing to use the service — but you can clear them through your browser at any time, which will sign you out.",
      ],
    },
    {
      heading: "Local storage on your device",
      paragraphs: [
        "The application stores a copy of your current plan and recent training on your device so it remains usable offline. This is not used for tracking, and it is removed when you uninstall the application or clear its data.",
      ],
    },
    {
      heading: "What we do not use",
      paragraphs: [
        "We do not use advertising cookies, cross-site tracking pixels, or third-party marketing analytics.",
        "If that ever changes, we will update this page and ask for your consent before setting any non-essential cookie — not after.",
      ],
    },
    {
      heading: "Questions",
      paragraphs: [`Contact us at ${legalEntity.contactEmail}.`],
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
