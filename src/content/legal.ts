// ---------------------------------------------------------------------------
// DRAFT LEGAL CONTENT — NOT LEGALLY REVIEWED — NOT PUBLISHED
// ---------------------------------------------------------------------------
//
// This file holds a working first draft of the Privacy Policy, Terms of Use and
// Cookie Policy, written from the product's actual observed behaviour so that a
// qualified solicitor has something concrete to review, edit and sign off
// rather than starting from a blank page.
//
// It is NOT live. `LEGAL_CONTENT_APPROVED` below is `false`, so /privacy,
// /terms and /cookies continue to render their existing "to be confirmed"
// placeholders. Publishing is a deliberate one-line act: flip the flag to
// `true` AFTER a solicitor has reviewed and amended this content. Merging this
// file alone publishes nothing.
//
// Bracketed [TO BE CONFIRMED: ...] strings are genuinely unknown business facts
// (legal entity, company number, registered address, support address). They are
// deliberately NOT invented — see the audit report accompanying this branch.
// Every one must be filled before the flag is flipped.
//
// Known gaps a solicitor must resolve, not guess at:
//   - lawful basis wording for each processing purpose under UK GDPR
//   - whether ICO registration is required for this processing
//   - enforceability/scope of the IP and anti-scraping provisions in Terms §7
//   - liability caps and consumer-law carve-outs (Terms §9)
//   - whether the cancellation/refund terms satisfy the Consumer Contracts
//     (Information, Cancellation and Additional Charges) Regulations 2013, and
//     the DMCC Act 2024 subscription regime once it commences (expected 2027)
// ---------------------------------------------------------------------------

/**
 * Publication gate. While `false`, the legal pages render their existing
 * placeholder state and none of the draft content below is served. Do not flip
 * this without completed legal review — the draft is written in good faith from
 * product behaviour, but it is not legal advice and has not been checked by a
 * qualified person.
 */
export const LEGAL_CONTENT_APPROVED = false;

/** Placeholder token, so unresolved business facts are greppable before launch. */
const TBC = (what: string) => `[TO BE CONFIRMED: ${what}]`;

export const legalEntity = {
  name: TBC("registered legal entity name"),
  companyNumber: TBC("company registration number, if incorporated"),
  registeredAddress: TBC("registered business address"),
  contactEmail: TBC("support/privacy contact email address"),
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
    "This policy explains what personal data Valhalla collects when you use the product, what it is used for, how long it is kept, and the rights you have over it. It is written to describe what the product actually does, not what it might do in future.",
  lastUpdated: TBC("effective date"),
  sections: [
    {
      heading: "Who is responsible for your data",
      paragraphs: [
        `Valhalla is operated by ${legalEntity.name} (company number ${legalEntity.companyNumber}), registered at ${legalEntity.registeredAddress}. For data protection purposes, we are the data controller for the personal data described in this policy.`,
        `If you have a question about your data, or want to exercise any of the rights set out below, contact us at ${legalEntity.contactEmail}.`,
      ],
    },
    {
      heading: "What we collect",
      paragraphs: [
        "Account data: your email address, and the authentication records needed to sign you in. Valhalla uses passwordless email sign-in, so we do not store a password for your account.",
        "Training data: the plan generated for you, the sessions you log, and the details you record against them — including pace, heart rate, perceived effort, how a session felt, and any notes you add.",
        "Coaching data: the outputs Valhalla produces about your training, including execution reviews, proposed plan changes, and the record of whether you accepted or declined them.",
        "Connected services: if you choose to connect a third-party service such as Strava, we store the access credentials for that connection and the activity data it returns. You can disconnect at any time.",
        "We do not collect advertising identifiers, and we do not track your behaviour across other websites or apps.",
      ],
    },
    {
      heading: "What we use it for",
      paragraphs: [
        "To create and adjust your training plan, and to produce the coaching output that is the substance of the product. Without your training data, Valhalla cannot do the thing you are paying it to do.",
        "To keep your plan and history available across your devices, and to restore it if you sign in again later.",
        "To operate the service — authenticating you, keeping the service secure and available, and diagnosing faults.",
        "To handle your support requests, and to manage your subscription and entitlement if and when paid access is enabled.",
        "We use aggregate, non-identifying counts of ordinary product events — such as how often proposed plan changes are accepted or declined — to understand whether the coaching is working. We do not build advertising or behavioural profiles from this.",
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
        "Your account and training data are stored in a managed database hosted in the European Union, operated on our behalf by our infrastructure providers. Those providers process the data only to provide the service to us and under contract.",
        "The Valhalla application also stores a copy of your current plan and recent activity on your own device, so the product remains usable when you are offline or have a poor connection. Data held on your device is under your control and is removed when you uninstall the application or clear its data.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "While your account is open, we keep your training history so that it remains available to you and so that coaching decisions can take your history into account. Losing your history would degrade the product for you, so we do not delete it routinely.",
        "If your paid access ends, your data is retained and your history remains available to you — access to new coaching output stops, but your record of your own training does not disappear because a payment stopped.",
        `If you delete your account, we delete your account and associated training data from our systems. Backups may take up to ${TBC("backup retention window, e.g. 30 days")} to cycle out, and we may retain a minimal record where we are legally required to.`,
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
