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
  defaultTitle: "VoiceDocAI by Jatayu Healthcare · Talk More, Type Less",
  defaultDescription:
    "AI-powered voice solutions for structured documentation and insights. Multilingual, multi-speaker, noise-robust — built for clinical, qualitative research, and any conversation worth documenting.",
  positioningLine:
    "Talk more, type less. VoiceDocAI turns multilingual multi-speaker conversations into structured documentation — clinical notes, research transcripts, and the reports your team actually needs.",
  salesEmail: "sales@jatayuhealth.com",
  founderEmail: "aparnaoruganty.das@jatayuhealth.com",
  phone: "+91 75060 60955",
  /** Company office addresses — surfaced on /contact and the footer. */
  offices: [
    {
      city: "Mumbai",
      lines: [
        "6005A, 6th Floor, SINE",
        "IIT Bombay, Powai",
        "Mumbai – 400076",
      ],
      label: "Registered / R&D office",
    },
    {
      city: "Thane",
      lines: [
        "B 703, Urbano, Sector 4",
        "Palava City, Kalyan",
        "Thane – 421204",
      ],
      label: "Corporate office",
    },
  ],
};

/** Primary navigation - toggling showInMainNav simulates CMS “show in nav” */
export const navigationMain: NavItem[] = [
  { label: "Home", href: "/", showInMainNav: true, order: 0 },
  { label: "Product", href: "/product", showInMainNav: true, order: 10 },
  { label: "Use Cases", href: "/use-cases", showInMainNav: true, order: 20 },
  { label: "Specialties", href: "/specialties", showInMainNav: false, order: 40 },
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
  badge: "Multilingual. Multi-speaker. Noise-robust.",
  headline: "Talk more, type less. From conversation to structured report.",
  subheadline:
    "VoiceDocAI captures multi-speaker conversations, identifies speakers, and generates ready-to-use reports. Tuned for multilingual, high-noise environments.",
  trustLine:
    "Trusted by KEM Hospital, ILBS Delhi, INHS Asvini, Basavatarakam Indo-American Cancer Centre, Priya Lobo Consults, Ohum Healthcare, and more.",
  primaryCta: { label: "Start 7-day free trial", href: "/trial" },
  secondaryCta: { label: "Book a 20-minute walkthrough", href: "/contact" },
};

export const audienceSplit = {
  doctor: {
    title: "Clinical documentation",
    body: "Consultation notes, discharge summaries, prescriptions, radiology and OT narratives — multilingual capture with clinician-in-the-loop review.",
    cta: "See the Medical use case",
    href: "/use-cases/medical",
  },
  hospital: {
    title: "Qualitative research",
    body: "Depth interviews, focus groups, ethnographies. Speaker-diarised transcripts, theme analysis, and structured insight reports.",
    chip: ">99% thematic accuracy",
    cta: "See the Market Research use case",
    href: "/use-cases/market-research",
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
  "VoiceDocAI is an AI-powered voice solution for structured documentation and insights. It captures multi-speaker, multilingual conversations, filters background noise, and drafts structured reports — clinical notes, qualitative research transcripts, interview summaries — with a human reviewer always in the loop.";

/** Plain-language label paired with the concise answer block (was "In one minute:") */
export const homeConciseAnswerLabel = "What it is";

export const homeMetrics: MetricItem[] = [
  {
    id: "doc-time",
    value: "~80%",
    label: "Documentation time saved",
    sourceRef: "customer-deployment-dec-2025",
  },
  {
    id: "accuracy",
    value: "95%+",
    label: "Accuracy on real-world conversations",
    sourceRef: "customer-deployment-dec-2025",
  },
  {
    id: "thematic",
    value: ">99%",
    label: "AI thematic accuracy (research)",
    sourceRef: "qualitative-research-validation-dec-2025",
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
    label: "Medical specialties covered",
    sourceRef: "product-capabilities-cms",
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

/**
 * 20+ medical specialties (as confirmed by the founder). The CMS overrides
 * this list once seeded; the seeded entries here ship as defaults so /specialties
 * has real content out of the box.
 */
export const specialtiesFeatured: SpecialtySummary[] = [
  { slug: "radiology", title: "Radiology", blurb: "Structured imaging narratives and reporting workflows." },
  { slug: "cardiology", title: "Cardiology", blurb: "ECG and echo findings, risk stratification, and follow-up plans." },
  { slug: "oncology", title: "Oncology", blurb: "Tumour-board discussions, chemo regimens, and surveillance notes." },
  { slug: "gastroenterology", title: "Gastroenterology", blurb: "Procedure-forward notes and consultation documentation." },
  { slug: "pulmonology", title: "Pulmonology", blurb: "Respiratory exam, imaging correlation, and treatment plans." },
  { slug: "nephrology", title: "Nephrology", blurb: "Dialysis charts, lab interpretation, and CKD staging notes." },
  { slug: "endocrinology", title: "Endocrinology", blurb: "Diabetes, thyroid, and hormone-axis follow-ups." },
  { slug: "neurology", title: "Neurology", blurb: "Neurological exam findings, imaging review, and seizure logs." },
  { slug: "psychiatry", title: "Psychiatry", blurb: "Structured mental-state exam and longitudinal therapy notes." },
  { slug: "dermatology", title: "Dermatology", blurb: "Lesion descriptors and treatment plans in structured form." },
  { slug: "ent", title: "ENT", blurb: "Otoscopy, endoscopy, and audiometry findings." },
  { slug: "ophthalmology", title: "Ophthalmology", blurb: "Refraction, fundus, and surgical planning notes." },
  { slug: "paediatrics", title: "Paediatrics", blurb: "Guardian-inclusive encounters with age-appropriate structure." },
  { slug: "obstetrics-gynaecology", title: "Obstetrics & Gynaecology", blurb: "Antenatal visits, ultrasound notes, and operative summaries." },
  { slug: "orthopaedics", title: "Orthopaedics", blurb: "Injury mechanics, exam findings, and operative planning fields." },
  { slug: "general-medicine", title: "General Medicine", blurb: "High-volume OPD documentation with fast review loops." },
  { slug: "general-surgery", title: "General Surgery", blurb: "Pre-op assessments and consent documentation." },
  { slug: "emergency-medicine", title: "Emergency Medicine", blurb: "Time-stamped triage, intervention, and disposition notes." },
  { slug: "intensive-care", title: "Intensive Care", blurb: "Daily ICU progress notes, sedation logs, and family briefings." },
  { slug: "anaesthesiology", title: "Anaesthesiology", blurb: "Pre-op evaluation, intra-op events, and recovery notes." },
  { slug: "ot-surgery", title: "OT / Surgery notes", blurb: "Operative notes tuned to institutional formats." },
  { slug: "discharge-summaries", title: "Discharge summaries", blurb: "Admission-to-discharge continuity in one verified document." },
  { slug: "family-medicine", title: "Family Medicine", blurb: "Continuity-of-care notes across the household." },
];

export const caseStudySpotlight = {
  slug: "kem-hospital",
  institution: "KEM Hospital",
  headline: "Multi-department deployment across real-world noise and volume",
  pullQuote:
    "Significant reduction in documentation time, improved workflow efficiency, and accurate conversion of multilingual conversations into structured English records.",
  metricsLine:
    "95 cases, 18 clinicians, 5 departments, 70 to 90 dB ambient noise. See the published evaluation summary for methodology.",
  linkLabel: "Read the full evaluation report",
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "We found the solution highly relevant for the Radiology Department considering our current workload and reporting volume. The software uses AI-based voice-to-text technology with automatic summarization, making report generation significantly faster and easier for doctors.",
    attribution: "Dr. Hemangini Thakkar",
    role: "Prof. & Head, Dept. of Radiology, K.E.M. Hospital",
  },
  {
    quote:
      "What started as an experiment has truly become a cornerstone of our journey. In the market research field, we were tethered to traditional, manual transcription and translation — processes that were notoriously time-consuming and labour-intensive. Switching to Jatayu has been a game-changer.",
    attribution: "Chithra Parthasarathi",
    role: "Associate Research Director, Priya Lobo Consults",
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
    body: "Privacy obligations reviewed with counsel for our home market; regional reviews underway for new geographies.",
    href: "/security",
  },
  {
    title: "ISO 27001",
    body: "Certification status is founder-confirmed and published, with no aspirational language.",
    href: "/security",
  },
  {
    title: "Encryption and residency",
    body: "TLS in transit, AES-256 at rest. Regional data residency controls available per customer.",
    href: "/security",
  },
];

export const founderNote = {
  name: "Dr. Aparna Oruganty Das",
  role: "Director & CEO, Jatayu Healthcare Technologies",
  quote:
    "We built VoiceDocAI so people stay present with the conversation. Hands-free, multilingual, multi-speaker, and rigorous about human verification — whether it's a clinical encounter or a depth interview.",
  aboutHref: "/about",
};

// Awards in the home-page grid all require a photo. Text-only recognitions
// (BIG-19 grant, Startup India Seed grant, IIT Bombay / IIT Kanpur equity)
// are surfaced via the Supporters strip subtitles, where they fit the
// "ecosystem partner" framing better than a card without imagery.
export const awards: AwardItem[] = [
  {
    name: "TIDE grant, MeitY · Hack & Reboot 2.0 winner",
    detail: "Recognised at Hack & Reboot 2.0 for clinical voice AI.",
    imagePath: "awards/tide-meity-hack-reboot.png",
  },
  {
    name: "Shark Tank winner: CHERS Pilot, BITS Hyderabad",
    detail: "Winner of the CHERS Pilot Shark Tank event, BITS Hyderabad.",
    imagePath: "awards/chers-pilot-shark-tank.png",
  },
  {
    name: "Healthtech Business Meet-Up speakership",
    detail: "Featured panellist on AI in clinical workflows.",
    imagePath: "awards/healthtech-meetup.png",
  },
  {
    name: "V2DD Leadership team, Koita Foundation",
    detail: "Driving Voice AI adoption frameworks across healthcare.",
    imagePath: "awards/v2dd-koita-foundation.png",
  },
  {
    name: "Top Woman Entrepreneur Award, Dr. Aparna Das",
    detail: "Awarded for AI-led healthcare entrepreneurship.",
    imagePath: "awards/top-woman-entrepreneur.png",
  },
  {
    name: "Medicircle feature on Dr. Aparna Das",
    detail: "Magazine feature on Jatayu's AI in clinical practice.",
    imagePath: "awards/medicircle-feature.png",
  },
];

export const homeFaqs: FAQItem[] = [
  {
    question: "What is VoiceDocAI?",
    answer:
      "VoiceDocAI is an AI-powered voice solution for structured documentation and insights. It captures multi-speaker, multilingual conversations, identifies speakers, filters noise, and drafts ready-to-use reports — clinical notes, qualitative research transcripts, interview summaries — with a human reviewer always in the loop.",
  },
  {
    question: "Which languages does VoiceDocAI support?",
    answer:
      "VoiceDocAI supports 50+ languages with native mixed-language handling (no per-segment switching). Production deployments include Hindi, Marathi, English, Arabic, and French; the exact catalogue per customer is confirmed during onboarding.",
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
    title: "KEM Hospital deployment",
    institution: "Seth G.S. Medical College & KEM Hospital",
    excerpt: "Multi-specialty deployment with measurable documentation time reduction.",
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
    { label: "Use cases", href: "/use-cases" },
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
    { label: "Terms of Use", href: "/terms" },
    { label: "Cancellation Policy", href: "/cancellation" },
    { label: "Sitemap", href: "/sitemap-page" },
    { label: "Security & Compliance", href: "/security" },
  ],
};
