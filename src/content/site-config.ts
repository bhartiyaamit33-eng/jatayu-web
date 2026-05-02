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
  /** Citation key for GEO — surface on /about/facts */
  sourceRef: string;
};

export type LogoItem = {
  name: string;
  /** Greyscale treatment in UI; consent tracked in CMS */
  href?: string;
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
};

export const siteMeta = {
  legalName: "Jatayu Healthcare Technologies Pvt. Ltd.",
  productName: "VoiceDocAI",
  domain: "https://jatayuhealth.com",
  defaultTitle: "VoiceDocAI by Jatayu Healthcare — Voice-first clinical documentation",
  defaultDescription:
    "Voice-first medical AI built for Indian doctors. From conversation to structured English clinical note in under a minute, in 50+ languages. IIT Bombay incubated.",
  positioningLine:
    "Voice-first medical AI built for Indian doctors. From conversation to clinical note in under a minute, in 50+ languages.",
  salesEmail: "sales@jatayuhealth.com",
  founderEmail: "aparnaoruganty.das@jatayuhealth.com",
};

/** Primary navigation — toggling showInMainNav simulates CMS “show in nav” */
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
  badge:
    "Built for Indian clinics, hospitals, and HMIS partners — pocket-friendly and hands-free.",
  headline: "Spend less time typing. More time with patients.",
  subheadline:
    "VoiceDocAI listens to real doctor–patient conversations in Hindi, Marathi, English, or any mix, and turns them into structured English clinical notes you can verify and file.",
  trustLine:
    "IIT Bombay incubated. Piloted at KEM Hospital, MGM, ILBS Delhi, and DY Patil Navi Mumbai.",
  primaryCta: { label: "Start 7-day free trial", href: "/trial" },
  secondaryCta: { label: "Talk to our team", href: "/contact" },
};

/** 40–60 word concise answer for AEO (editable per page in CMS) */
export const homeConciseAnswer =
  "VoiceDocAI is an Indian, IIT Bombay–incubated voice assistant for medicine. It captures multilingual clinic conversations, reduces background noise, and drafts structured English notes—consultation notes, discharge summaries, OT notes, radiology reports, and prescriptions—for clinician review before filing or HMIS push.";

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
  { name: "KEM Hospital" },
  { name: "MGM" },
  { name: "ILBS Delhi" },
  { name: "DY Patil Navi Mumbai" },
  { name: "Souter Street Dispensary" },
  { name: "HMIS / EHR partners (named with consent)" },
];

export const howItWorksSteps = [
  {
    title: "Capture the conversation",
    body: "Hands-free capture in noisy OPDs and wards—multilingual speech, not templated scripts.",
  },
  {
    title: "Process and structure",
    body: "Noise-aware processing converts speech into structured fields aligned to your templates.",
  },
  {
    title: "Review and verify",
    body: "You edit, approve, and sign off—clinical responsibility stays with the treating physician.",
  },
  {
    title: "Push or copy",
    body: "Export, API push, or HMIS integration—avoid re-keying into legacy systems.",
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
    "95 cases · 18 clinicians · 5 departments · 70–90 dB ambient noise — see the published pilot summary for methodology.",
  linkLabel: "Read the full pilot report",
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Across the pilot, clinicians reported faster turnaround from encounter to filed note, with multilingual Hindi–Marathi–English conversations consolidated into English records suitable for HMIS workflows.",
    attribution: "VoiceDocAI pilot evaluation",
    role: "Seth G.S. Medical College & KEM Hospital — aggregate clinician feedback (Dec 2025)",
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
    body: "Security page documents our alignment scope—confirm exact claims before procurement.",
    href: "/security",
  },
  {
    title: "DPDP Act 2023",
    body: "Indian privacy obligations reviewed with counsel—status detailed on Security.",
    href: "/security",
  },
  {
    title: "ISO 27001",
    body: "Certification status is founder-confirmed and published—no aspirational language.",
    href: "/security",
  },
  {
    title: "Encryption & residency",
    body: "TLS in transit, AES-256 at rest, India-focused residency story.",
    href: "/security",
  },
];

export const founderNote = {
  name: "Dr. Aparna Oruganty Das",
  role: "Director & CEO, Jatayu Healthcare Technologies",
  quote:
    "We built VoiceDocAI so Indian physicians can stay present with patients—hands-free, pocket-friendly, and rigorous about clinical verification.",
  aboutHref: "/about",
};

export const awards: AwardItem[] = [
  { name: "BIRAC-supported innovation pathway", detail: "Confirm listing copy in CMS" },
  { name: "MIT WPU engagement", detail: "Confirm listing copy in CMS" },
  { name: "BITS Hyderabad collaboration", detail: "Confirm listing copy in CMS" },
  { name: "Koita Foundation — Virtual Venture Development Dialogues (V2DD)", detail: "Confirm listing copy in CMS" },
];

export const homeFaqs: FAQItem[] = [
  {
    question: "What is VoiceDocAI?",
    answer:
      "VoiceDocAI captures doctor–patient conversations and drafts structured English clinical documentation—consult notes, discharge summaries, prescriptions, radiology narratives, and OT notes—for clinician review before filing or HMIS integration.",
  },
  {
    question: "Which languages does VoiceDocAI support?",
    answer:
      "VoiceDocAI is built for Indian multilingual practice—including Hindi, Marathi, English, and mixed conversations—with broader language coverage managed per deployment; publish the exact supported list only after founder confirmation.",
  },
  {
    question: "Is audio stored?",
    answer:
      "Retention and processing posture must match your hospital agreement and applicable law. Use the Security & Compliance page for the definitive statement after legal review—never guess on procurement calls.",
  },
  {
    question: "Can hospitals integrate via API?",
    answer:
      "Yes—HMIS and EHR partners can integrate using documented APIs and deployment models including on-premise where required; integration timelines depend on your environment and governance.",
  },
  {
    question: "How long is the free trial?",
    answer:
      "The public site promotes a 7-day trial—confirm what the trial unlocks (web account, desktop client, or license key) before advertising specifics.",
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
    excerpt: "Deployment narrative — load final copy from CMS.",
  },
  {
    slug: "ilbs-delhi",
    title: "ILBS Delhi",
    institution: "ILBS Delhi",
    excerpt: "Deployment narrative — load final copy from CMS.",
  },
  {
    slug: "dy-patil-navi-mumbai",
    title: "DY Patil Navi Mumbai",
    institution: "DY Patil Navi Mumbai",
    excerpt: "Deployment narrative — load final copy from CMS.",
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
