/**
 * CMS-ready site configuration.
 * Wire Payload/Strapi collections to replace this module at build or request time.
 */

export type NavItem = {
  label: string;
  href: string;
  showInMainNav: boolean;
  order: number;
};

export type MetricItem = {
  id: string;
  value: string;
  label: string;
  /** Citation key for GEO - surface on /about/facts */
  sourceRef: string;
};

export type LogoItem = {
  name: string;
  /** Greyscale treatment in UI; consent tracked in CMS */
  href?: string;
  category?: "hospital" | "ehr" | "strategic" | "supporter";
  imagePath?: string;
};

export type SpecialtySummary = {
  title: string;
  slug: string;
  blurb: string;
};

export type CaseStudySummary = {
  title: string;
  slug: string;
  institution: string;
  excerpt: string;
};

export type Testimonial = {
  quote: string;
  attribution: string;
  role?: string;
  /** Set false until photo release is signed */
  photoUrl?: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type AwardItem = {
  name: string;
  detail?: string;
  imagePath?: string;
  sourceUrl?: string;
};

export const siteMeta = {
  legalName: "Jatayu Healthcare Technologies Pvt. Ltd.",
  productName: "VoiceDocAI",
  domain: "https://jatayuhealth.com",
  defaultTitle: "VoiceDocAI by Jatayu Healthcare · Voice-first clinical documentation",
  defaultDescription:
    "Voice-first medical AI built for Indian doctors. From conversation to structured English clinical note in under a minute, in 50+ languages. IIT Bombay incubated.",
  positioningLine:
    "Voice-first medical AI built for Indian doctors. From conversation to clinical note in under a minute, in 50+ languages.",
  salesEmail: "sales@jatayuhealth.com",
  founderEmail: "aparnaoruganty.das@jatayuhealth.com",
};

/** Primary navigation - toggling showInMainNav simulates CMS “show in nav” */
export const navigationMain: NavItem[] = [
  { label: "Home", href: "/", showInMainNav: true, order: 0 },
  { label: "Product", href: "/product", showInMainNav: true, order: 10 },
  { label: "For Doctors", href: "/for-doctors", showInMainNav: true, order: 20 },
  {
    label: "For Hospitals & HMIS",
    href: "/for-hospitals-and-hmis",
    showInMainNav: true,
    order: 30,
  },
  { label: "Specialties", href: "/specialties", showInMainNav: true, order: 40 },
  {
    label: "Case Studies",
    href: "/case-studies",
    showInMainNav: true,
    order: 50,
  },
  { label: "Pricing", href: "/pricing", showInMainNav: true, order: 55 },
  { label: "Blog", href: "/blog", showInMainNav: true, order: 60 },
  { label: "About", href: "/about", showInMainNav: true, order: 70 },
  {
    label: "Security & Compliance",
    href: "/security",
    showInMainNav: true,
    order: 80,
  },
  { label: "Contact", href: "/contact", showInMainNav: true, order: 90 },
].sort((a, b) => a.order - b.order);

export const homeHero = {
  badge: "Pocket-friendly. Hands-free. Built at IIT Bombay.",
  headline: "From the conversation, to the clinical note. In under a minute.",
  subheadline:
    "Hindi, Marathi, English, or all three at once. VoiceDocAI drafts the structured note. You verify and file it.",
  trustLine:
    "Pilots at KEM Hospital, MGM, ILBS Delhi, and DY Patil Navi Mumbai. Reviewed by clinicians, not autopilots.",
  primaryCta: { label: "Start 7-day free trial", href: "/trial" },
  secondaryCta: { label: "Book a 20-minute walkthrough", href: "/contact" },
};

export const audienceSplit = {
  doctor: {
    title: "I am a doctor",
    body: "Time saved per day, multilingual clinics, pocket-friendly workflows.",
    cta: "Show me what is relevant",
    href: "/for-doctors",
  },
  hospital: {
    title: "I am a hospital or HMIS partner",
    body: "APIs, India-resident data, SLAs, on-prem options, audit logs.",
    chip: "Data resident in India",
    cta: "Take me to integrations",
    href: "/for-hospitals-and-hmis",
  },
};

export const patientConsentBlock = {
  title: "Patient consent, kept simple",
  body: "Capture begins only after the clinician confirms the patient has agreed. Consent state is logged with the encounter so audit and clinical governance teams can review it later.",
  bullets: [
    "Doctor confirms verbal consent before recording starts.",
    "Capture indicator stays visible on the doctor's device throughout.",
    "Consent metadata is stored with the encounter, separate from the audio.",
  ],
};

/** 40-60 word concise answer for AEO (editable per page in CMS) */
export const homeConciseAnswer =
  "VoiceDocAI is an Indian, IIT Bombay incubated voice assistant for medicine. It captures multilingual clinic conversations, reduces background noise, and drafts structured English notes (consultation notes, discharge summaries, OT notes, radiology reports, and prescriptions) for clinician review before filing or HMIS push.";

/** Plain-language label paired with the concise answer block (was "In one minute:") */
export const homeConciseAnswerLabel = "What it is";

export const homeMetrics: MetricItem[] = [
  {
    id: "doc-time",
    value: "~80%",
    label: "Documentation time saved (KEM pilot)",
    sourceRef: "kem-pilot-report-dec-2025",
  },
  {
    id: "accuracy",
    value: "~95%",
    label: "Accuracy on pilot cases",
    sourceRef: "kem-pilot-report-dec-2025",
  },
  {
    id: "languages",
    value: "50+",
    label: "Languages supported",
    sourceRef: "product-capabilities-cms",
  },
  {
    id: "specialties",
    value: "20+",
    label: "Medical specialties",
    sourceRef: "product-capabilities-cms",
  },
  {
    id: "doctors",
    value: "~100",
    label: "Doctors in active pilots",
    sourceRef: "founder-confirmed-count-cms",
  },
];

export const logoWall: LogoItem[] = [
  { name: "Seth G.S. Medical College & KEM Hospital", category: "hospital" },
  { name: "MGM Medical College & Hospital, Kamothe", category: "hospital" },
  { name: "ILBS, Delhi", category: "hospital" },
  { name: "DY Patil Hospital, Navi Mumbai", category: "hospital" },
  { name: "Basavatarakam Indo-American Cancer Centre, Hyderabad", category: "hospital" },
  { name: "Souter Street Dispensary, BMC Mumbai", category: "hospital" },
  { name: "Akhil Systems Pvt. Ltd.", category: "ehr" },
  { name: "Dataman Computer Systems Pvt. Ltd.", category: "ehr" },
  { name: "Ohum Healthcare", category: "ehr" },
  { name: "Jeena Sikho", category: "ehr" },
  { name: "Koita Foundation (V2DD Leadership)", category: "strategic" },
  { name: "Google Cloud for Startups", category: "supporter" },
  { name: "BIRAC, Department of Biotechnology, Govt of India", category: "supporter" },
  { name: "MeitY, Ministry of Electronics and IT", category: "supporter" },
  { name: "SINE, IIT Bombay", category: "supporter" },
  { name: "IIT Bombay", category: "supporter" },
  { name: "IIT Kanpur", category: "supporter" },
];

/** Combined-row supporter / partner band image paths (rendered via media uploads, see seed). */
export const partnerRowImages = {
  supporters: "supporters/supporters-strip.png",
  hospitals: "hospitals/hospital-row.png",
  ehrs: "ehr/ehr-row.png",
};

export const howItWorksSteps = [
  {
    title: "Capture the conversation",
    body: "Hands-free capture in noisy OPDs and wards. Multilingual speech, not templated scripts.",
  },
  {
    title: "Process and structure",
    body: "Noise-aware processing converts speech into structured fields aligned to your templates.",
  },
  {
    title: "Review and verify",
    body: "You edit, approve, and sign off-clinical responsibility stays with the treating physician.",
  },
  {
    title: "Push or copy",
    body: "Export, API push, or HMIS integration-avoid re-keying into legacy systems.",
  },
];

export const specialtiesFeatured: SpecialtySummary[] = [
  {
    slug: "radiology",
    title: "Radiology",
    blurb: "Structured imaging narratives and reporting workflows.",
  },
  {
    slug: "gastroenterology",
    title: "Gastroenterology",
    blurb: "Procedure-forward notes and consultation documentation.",
  },
  {
    slug: "dermatology",
    title: "Dermatology",
    blurb: "Lesion descriptors and treatment plans in structured English.",
  },
  {
    slug: "paediatrics",
    title: "Paediatrics",
    blurb: "Guardian-inclusive encounters with age-appropriate structure.",
  },
  {
    slug: "orthopaedics",
    title: "Orthopaedics",
    blurb: "Injury mechanics, exam findings, and operative planning fields.",
  },
  {
    slug: "ot-surgery",
    title: "OT / Surgery",
    blurb: "Operative notes tuned to institutional formats.",
  },
  {
    slug: "discharge-summaries",
    title: "Discharge summaries",
    blurb: "Admission-to-discharge continuity in one verified document.",
  },
  {
    slug: "general-medicine",
    title: "General Medicine",
    blurb: "High-volume OPD documentation with fast review loops.",
  },
];

export const caseStudySpotlight = {
  slug: "kem-hospital",
  institution: "KEM Hospital",
  headline: "Multi-department pilot across real-world noise and volume",
  pullQuote:
    "Significant reduction in documentation time, improved workflow efficiency, and accurate conversion of multilingual conversations into structured English records.",
  metricsLine:
    "95 cases, 18 clinicians, 5 departments, 70 to 90 dB ambient noise. See the published pilot summary for methodology.",
  linkLabel: "Read the full pilot report",
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Across the pilot, clinicians reported faster turnaround from encounter to filed note, with multilingual Hindi-Marathi-English conversations consolidated into English records suitable for HMIS workflows.",
    attribution: "VoiceDocAI pilot evaluation",
    role: "Seth G.S. Medical College and KEM Hospital, aggregate clinician feedback (Dec 2025)",
  },
];

export const deploymentModes = [
  {
    title: "Web",
    body: "Browser-based workflows for clinics that prefer zero install.",
  },
  {
    title: "Desktop",
    body: "Standalone capture and structuring for busy OPD desktops.",
  },
  {
    title: "Mobile",
    body: "On-call documentation from handheld devices where permitted.",
  },
  {
    title: "On-premise",
    body: "Deployment models for hospitals that require private infrastructure.",
  },
  {
    title: "API",
    body: "HMIS and EHR partners integrate structured note generation directly.",
  },
];

export const complianceBand = [
  {
    title: "HIPAA-aligned posture",
    body: "We use HIPAA-aligned, not HIPAA-compliant. The Security page explains the exact scope.",
    href: "/security",
  },
  {
    title: "DPDP Act 2023",
    body: "Indian privacy obligations reviewed with counsel. Status detailed on Security.",
    href: "/security",
  },
  {
    title: "ISO 27001",
    body: "Certification status is founder-confirmed and published, with no aspirational language.",
    href: "/security",
  },
  {
    title: "Encryption and residency",
    body: "TLS in transit, AES-256 at rest, and India-resident data by default.",
    href: "/security",
  },
];

export const founderNote = {
  name: "Dr. Aparna Oruganty Das",
  role: "Director & CEO, Jatayu Healthcare Technologies",
  quote:
    "We built VoiceDocAI so Indian physicians can stay present with patients. Hands-free, pocket-friendly, and rigorous about clinical verification.",
  aboutHref: "/about",
};

export const awards: AwardItem[] = [
  {
    name: "BIG-19 grant — BIRAC, Govt. of India",
    detail: "One of 10 final awardees in the Diagnostics category.",
  },
  {
    name: "TIDE grant — MeitY · Hack & Reboot 2.0 winner",
    detail: "Recognised at Hack & Reboot 2.0 for clinical voice AI.",
    imagePath: "awards/tide-meity-hack-reboot.png",
  },
  {
    name: "Startup India Seed grant",
    detail: "Department for Promotion of Industry and Internal Trade.",
  },
  {
    name: "Shark Tank winner — CHERS Pilot, BITS Hyderabad",
    detail: "Winner of the CHERS Pilot Shark Tank event, BITS Hyderabad.",
    imagePath: "awards/chers-pilot-shark-tank.png",
  },
  {
    name: "Healthtech Business Meet-Up speakership",
    detail: "Featured panellist on AI in clinical workflows.",
    imagePath: "awards/healthtech-meetup.png",
  },
  {
    name: "Member of V2DD Leadership team — Koita Foundation",
    detail: "Driving Voice AI adoption frameworks for Indian healthcare.",
    imagePath: "awards/v2dd-koita-foundation.png",
  },
  {
    name: "Top Woman Entrepreneur Award — Dr. Aparna Das",
    detail: "Awarded for AI-led healthcare entrepreneurship.",
    imagePath: "awards/top-woman-entrepreneur.png",
  },
  {
    name: "Medicircle feature — Dr. Aparna Das",
    detail: "Magazine feature on Jatayu's AI for Indian clinics.",
    imagePath: "awards/medicircle-feature.png",
  },
  {
    name: "IIT Bombay — equity stakeholder",
    detail: "IIT Bombay holds equity in Jatayu Healthcare Technologies.",
  },
  {
    name: "IIT Kanpur — equity stakeholder",
    detail: "IIT Kanpur holds equity in Jatayu Healthcare Technologies.",
  },
];

export const homeFaqs: FAQItem[] = [
  {
    question: "What is VoiceDocAI?",
    answer:
      "VoiceDocAI captures doctor-patient conversations and drafts structured English clinical documentation (consult notes, discharge summaries, prescriptions, radiology narratives, and OT notes) for clinician review before filing or HMIS integration.",
  },
  {
    question: "Which languages does VoiceDocAI support?",
    answer:
      "VoiceDocAI is built for Indian multilingual practice (including Hindi, Marathi, English, and mixed conversations) with broader language coverage managed per deployment; publish the exact supported list only after founder confirmation.",
  },
  {
    question: "Is audio stored?",
    answer:
      "Retention and processing posture must match your hospital agreement and applicable law. Use the Security & Compliance page for the definitive statement after legal review-never guess on procurement calls.",
  },
  {
    question: "Can hospitals integrate via API?",
    answer:
      "Yes-HMIS and EHR partners can integrate using documented APIs and deployment models including on-premise where required; integration timelines depend on your environment and governance.",
  },
  {
    question: "How long is the free trial?",
    answer:
      "The public site promotes a 7-day trial-confirm what the trial unlocks (web account, desktop client, or license key) before advertising specifics.",
  },
];

export const caseStudiesIndex: CaseStudySummary[] = [
  {
    slug: "kem-hospital",
    title: "KEM Hospital pilot",
    institution: "Seth G.S. Medical College & KEM Hospital",
    excerpt: "Multi-specialty pilot with measurable documentation time reduction.",
  },
  {
    slug: "mgm",
    title: "MGM",
    institution: "MGM",
    excerpt: "Deployment narrative pending. Load the final copy from CMS.",
  },
  {
    slug: "ilbs-delhi",
    title: "ILBS Delhi",
    institution: "ILBS Delhi",
    excerpt: "Deployment narrative pending. Load the final copy from CMS.",
  },
  {
    slug: "dy-patil-navi-mumbai",
    title: "DY Patil Navi Mumbai",
    institution: "DY Patil Navi Mumbai",
    excerpt: "Deployment narrative pending. Load the final copy from CMS.",
  },
  {
    slug: "souter-street-dispensary",
    title: "Souter Street Dispensary",
    institution: "BMC / Mumbai",
    excerpt: "Early municipal pilot preceding expanded hospital rollout.",
  },
];

export const footerColumns = {
  product: [
    { label: "VoiceDocAI overview", href: "/product" },
    { label: "For Doctors", href: "/for-doctors" },
    { label: "For Hospitals & HMIS", href: "/for-hospitals-and-hmis" },
    { label: "Specialties", href: "/specialties" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Pricing", href: "/pricing" },
    { label: "Trial signup", href: "/trial" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press / Awards", href: "/press" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Sitemap", href: "/sitemap-page" },
    { label: "Security & Compliance", href: "/security" },
  ],
};
