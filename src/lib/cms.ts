/**
 * Server-only readers around Payload's Local API.
 *
 * Each getter merges the CMS result with a static fallback so the site renders
 * correctly even when the DB hasn't been seeded yet. Once you run /api/seed the
 * CMS values take over.
 */
import "server-only";
import { unstable_cache } from "next/cache";
import { getPayloadClient } from "./payload";
import {
  siteMeta as siteMetaFallback,
  homeHero as heroFallback,
  homeMetrics as metricsFallback,
  audienceSplit as audienceFallback,
  patientConsentBlock as consentFallback,
  complianceBand as complianceFallback,
  deploymentModes as deploymentFallback,
  founderNote as founderFallback,
  logoWall as logoWallFallback,
  howItWorksSteps as stepsFallback,
  homeConciseAnswer as conciseAnswerFallback,
  homeConciseAnswerLabel as conciseLabelFallback,
  homeSectionLabels as homeSectionLabelsFallback,
  homeFaqs as faqsFallback,
  specialtiesFeatured as specialtiesFallback,
  caseStudiesIndex as caseStudiesFallback,
  caseStudySpotlight as spotlightFallback,
  testimonials as testimonialsFallback,
  awards as awardsFallback,
  footerColumns as footerColumnsFallback,
} from "@/content/site-config";
import { blogPosts as blogFallback } from "@/content/blog-posts";

const TAG = "cms";

async function payload() {
  return await getPayloadClient();
}

// ---------- globals ----------

export const getSiteMeta = unstable_cache(
  async () => {
    const p = await payload();
    const row = (await p.findGlobal({ slug: "site-meta", depth: 1 })) as Record<string, unknown>;
    return {
      productName: (row.productName as string) ?? siteMetaFallback.productName,
      legalName: (row.legalName as string) ?? siteMetaFallback.legalName,
      domain: (row.domain as string) ?? siteMetaFallback.domain,
      salesEmail: (row.salesEmail as string) ?? siteMetaFallback.salesEmail,
      supportEmail: (row.supportEmail as string) ?? siteMetaFallback.founderEmail,
      defaultTitle: (row.defaultTitle as string) ?? siteMetaFallback.defaultTitle,
      defaultDescription: (row.defaultDescription as string) ?? siteMetaFallback.defaultDescription,
      founderEmail: siteMetaFallback.founderEmail,
      logoUrl: mediaUrl(row.logo),
      logoAlt: mediaAlt(row.logo, siteMetaFallback.legalName),
    };
  },
  ["global", "site-meta"],
  { tags: [TAG, "site-meta"] },
);

export const getHomeHero = unstable_cache(
  async () => {
    const p = await payload();
    const row = (await p.findGlobal({ slug: "home-hero", depth: 0 })) as Record<string, unknown>;
    // Group fields (primaryCta/secondaryCta) can come back as empty or partial
    // objects when the global is unseeded, so we merge field-by-field instead of
    // a shallow `?? fallback` (a truthy `{}` would otherwise leave href undefined).
    const rowPrimary = (row.primaryCta as { label?: string; href?: string } | null) ?? {};
    const rowSecondary = (row.secondaryCta as { label?: string; href?: string } | null) ?? {};
    return {
      badge: (row.badge as string) ?? heroFallback.badge,
      headline: (row.headline as string) ?? heroFallback.headline,
      subheadline: (row.subheadline as string) ?? heroFallback.subheadline,
      trustLine: (row.trustLine as string) ?? heroFallback.trustLine,
      primaryCta: {
        label: rowPrimary.label ?? heroFallback.primaryCta.label,
        href: rowPrimary.href ?? heroFallback.primaryCta.href,
      },
      secondaryCta: {
        label: rowSecondary.label ?? heroFallback.secondaryCta.label,
        href: rowSecondary.href ?? heroFallback.secondaryCta.href,
      },
    };
  },
  ["global", "home-hero"],
  { tags: [TAG, "home-hero"] },
);

export const getHomeMetrics = unstable_cache(
  async () => {
    const p = await payload();
    const row = await p.findGlobal({ slug: "home-metrics", depth: 0 });
    const cms = (row as Record<string, unknown>).metrics as typeof metricsFallback | undefined;
    if (cms && Array.isArray(cms) && cms.length > 0) return cms;
    return metricsFallback.map((m) => ({ key: m.id, value: m.value, label: m.label, sourceRef: m.sourceRef }));
  },
  ["global", "home-metrics"],
  { tags: [TAG, "home-metrics"] },
);

export const getAudienceSplit = unstable_cache(
  async () => {
    const p = await payload();
    const row = await p.findGlobal({ slug: "audience-split", depth: 0 }) as Record<string, unknown>;
    return {
      doctor: (row.doctor as typeof audienceFallback.doctor) ?? audienceFallback.doctor,
      hospital: (row.hospital as typeof audienceFallback.hospital) ?? audienceFallback.hospital,
    };
  },
  ["global", "audience-split"],
  { tags: [TAG, "audience-split"] },
);

export const getPatientConsent = unstable_cache(
  async () => {
    const p = await payload();
    const row = await p.findGlobal({ slug: "patient-consent", depth: 0 }) as Record<string, unknown>;
    return {
      title: row.title as string ?? consentFallback.title,
      body: row.body as string ?? consentFallback.body,
      bullets: (row.bullets as Array<{ text: string }> | undefined)?.map((b) => b.text)
        ?? consentFallback.bullets,
    };
  },
  ["global", "patient-consent"],
  { tags: [TAG, "patient-consent"] },
);

export const getComplianceBand = unstable_cache(
  async () => {
    const p = await payload();
    const row = await p.findGlobal({ slug: "compliance-band", depth: 0 }) as Record<string, unknown>;
    const items = row.items as typeof complianceFallback | undefined;
    return (items && Array.isArray(items) && items.length > 0) ? items : complianceFallback;
  },
  ["global", "compliance-band"],
  { tags: [TAG, "compliance-band"] },
);

export const getDeploymentModes = unstable_cache(
  async () => {
    const p = await payload();
    const row = await p.findGlobal({ slug: "deployment-modes", depth: 0 }) as Record<string, unknown>;
    const modes = row.modes as typeof deploymentFallback | undefined;
    return (modes && Array.isArray(modes) && modes.length > 0) ? modes : deploymentFallback;
  },
  ["global", "deployment-modes"],
  { tags: [TAG, "deployment-modes"] },
);

type MediaDoc = { id: string | number; url?: string; alt?: string };

function mediaUrl(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const m = value as MediaDoc;
  return typeof m.url === "string" ? m.url : null;
}
function mediaAlt(value: unknown, fallback = ""): string {
  if (!value || typeof value !== "object") return fallback;
  return (value as MediaDoc).alt ?? fallback;
}

export const getFounderNote = unstable_cache(
  async () => {
    const p = await payload();
    const row = await p.findGlobal({ slug: "founder-note", depth: 1 }) as Record<string, unknown>;
    return {
      name: row.name as string ?? founderFallback.name,
      role: row.role as string ?? founderFallback.role,
      quote: row.quote as string ?? founderFallback.quote,
      aboutHref: row.aboutHref as string ?? founderFallback.aboutHref,
      portraitUrl: mediaUrl(row.portrait),
      portraitAlt: mediaAlt(row.portrait, founderFallback.name),
    };
  },
  ["global", "founder-note"],
  { tags: [TAG, "founder-note"] },
);

export const getLogoWall = unstable_cache(
  async () => {
    const p = await payload();
    const row = await p.findGlobal({ slug: "logo-wall", depth: 1 }) as Record<string, unknown>;
    const rawLogos = row.logos as Array<{ name: string; category?: string; logo?: unknown; href?: string }> | undefined;
    const logos = (rawLogos && rawLogos.length > 0)
      ? rawLogos.map((l) => ({
          name: l.name,
          category: l.category ?? "hospital",
          href: l.href,
          imageUrl: mediaUrl(l.logo),
        }))
      : logoWallFallback.map((l) => ({ name: l.name, category: l.category ?? "hospital", href: l.href, imageUrl: null }));
    return {
      logos,
      hospitalRowUrl: mediaUrl(row.hospitalRowImage),
      hospitalRowAlt: mediaAlt(row.hospitalRowImage, "Hospital partner row"),
      ehrRowUrl: mediaUrl(row.ehrRowImage),
      ehrRowAlt: mediaAlt(row.ehrRowImage, "EHR / HMIS partner row"),
      supportersRowUrl: mediaUrl(row.supportersRowImage),
      supportersRowAlt: mediaAlt(row.supportersRowImage, "Supporter ecosystem strip"),
    };
  },
  ["global", "logo-wall"],
  { tags: [TAG, "logo-wall"] },
);

export const getHowItWorksSteps = unstable_cache(
  async () => {
    const p = await payload();
    const row = await p.findGlobal({ slug: "how-it-works-steps", depth: 1 }) as Record<string, unknown>;
    const rawSteps = row.steps as Array<{ title: string; body: string; visual?: unknown }> | undefined;
    const steps = (rawSteps && rawSteps.length > 0)
      ? rawSteps.map((s) => ({ title: s.title, body: s.body, visualUrl: mediaUrl(s.visual) }))
      : stepsFallback.map((s) => ({ title: s.title, body: s.body, visualUrl: null as string | null }));
    return {
      steps,
      flowDiagramUrl: mediaUrl(row.flowDiagram),
      flowDiagramAlt: mediaAlt(row.flowDiagram, "VoiceDocAI five-step flow diagram"),
    };
  },
  ["global", "how-it-works-steps"],
  { tags: [TAG, "how-it-works-steps"] },
);

export const getHomepageConciseAnswer = unstable_cache(
  async () => {
    const p = await payload();
    const row = await p.findGlobal({ slug: "homepage-concise-answer", depth: 0 }) as Record<string, unknown>;
    return {
      label: row.label as string ?? conciseLabelFallback,
      body: row.body as string ?? conciseAnswerFallback,
    };
  },
  ["global", "homepage-concise-answer"],
  { tags: [TAG, "homepage-concise-answer"] },
);

export const getHomeSections = unstable_cache(
  async () => {
    const fb = homeSectionLabelsFallback;
    try {
      const p = await payload();
      const row = (await p.findGlobal({ slug: "home-sections", depth: 0 })) as Record<string, unknown>;
      return {
        conciseHeading: (row.conciseHeading as string) ?? fb.conciseHeading,
        howItWorksEyebrow: (row.howItWorksEyebrow as string) ?? fb.howItWorksEyebrow,
        howItWorksHeading: (row.howItWorksHeading as string) ?? fb.howItWorksHeading,
        howItWorksIntro: (row.howItWorksIntro as string) ?? fb.howItWorksIntro,
        specialtiesEyebrow: (row.specialtiesEyebrow as string) ?? fb.specialtiesEyebrow,
        specialtiesHeading: (row.specialtiesHeading as string) ?? fb.specialtiesHeading,
        testimonialsEyebrow: (row.testimonialsEyebrow as string) ?? fb.testimonialsEyebrow,
        testimonialsHeading: (row.testimonialsHeading as string) ?? fb.testimonialsHeading,
        testimonialsSubtext: (row.testimonialsSubtext as string) ?? fb.testimonialsSubtext,
      };
    } catch {
      // The global's table may not exist yet (production runs with push:false
      // until `sync-prod-schema`). Fall back to static labels so the homepage
      // renders identically rather than erroring on a missing table.
      return { ...fb };
    }
  },
  ["global", "home-sections"],
  { tags: [TAG, "home-sections"] },
);

// ---------- collections ----------

export const getFaqs = unstable_cache(
  async () => {
    const p = await payload();
    const res = await p.find({ collection: "home-faqs", sort: "order", limit: 50, depth: 0 });
    if (res.docs.length > 0) return res.docs;
    return faqsFallback.map((f, i) => ({ question: f.question, answer: f.answer, order: (i + 1) * 10 }));
  },
  ["coll", "home-faqs"],
  { tags: [TAG, "home-faqs"] },
);

export const getSpecialties = unstable_cache(
  async () => {
    const p = await payload();
    const res = await p.find({ collection: "specialties", sort: "order", limit: 100, depth: 0 });
    if (res.docs.length > 0) return res.docs;
    return specialtiesFallback.map((s, i) => ({
      slug: s.slug, title: s.title, blurb: s.blurb, featuredOnHome: i < 4, order: (i + 1) * 10,
    }));
  },
  ["coll", "specialties"],
  { tags: [TAG, "specialties"] },
);

export const getFeaturedSpecialties = unstable_cache(
  async () => {
    const p = await payload();
    const res = await p.find({
      collection: "specialties",
      where: { featuredOnHome: { equals: true } },
      sort: "order",
      limit: 8,
      depth: 0,
    });
    if (res.docs.length > 0) return res.docs;
    return specialtiesFallback.slice(0, 4).map((s, i) => ({
      slug: s.slug, title: s.title, blurb: s.blurb, featuredOnHome: true, order: (i + 1) * 10,
    }));
  },
  ["coll", "specialties", "featured"],
  { tags: [TAG, "specialties"] },
);

export async function getSpecialtyBySlug(slug: string) {
  const p = await payload();
  const res = await p.find({ collection: "specialties", where: { slug: { equals: slug } }, limit: 1, depth: 0 });
  if (res.docs[0]) return res.docs[0];
  const fb = specialtiesFallback.find((s) => s.slug === slug);
  return fb ? { slug: fb.slug, title: fb.title, blurb: fb.blurb } : null;
}

export const getCaseStudies = unstable_cache(
  async () => {
    const p = await payload();
    const res = await p.find({ collection: "case-studies", sort: "order", limit: 100, depth: 0 });
    if (res.docs.length > 0) return res.docs;
    return caseStudiesFallback.map((c, i) => ({
      slug: c.slug, institution: c.institution, pullQuote: c.excerpt,
      metricsLine: "", spotlight: false, order: (i + 1) * 10,
    }));
  },
  ["coll", "case-studies"],
  { tags: [TAG, "case-studies"] },
);

export const getSpotlightCaseStudy = unstable_cache(
  async () => {
    const p = await payload();
    const res = await p.find({
      collection: "case-studies",
      where: { spotlight: { equals: true } },
      sort: "-publishedAt",
      limit: 1,
      depth: 2,
    });
    if (res.docs[0]) {
      const doc = res.docs[0] as Record<string, unknown>;
      const charts = (doc.charts as Record<string, unknown> | undefined) ?? {};
      return {
        slug: doc.slug as string,
        institution: doc.institution as string,
        pullQuote: doc.pullQuote as string,
        metricsLine: doc.metricsLine as string,
        linkLabel: doc.linkLabel as string,
        spotlight: true,
        coverImageUrl: mediaUrl(doc.coverImage),
        coverImageAlt: mediaAlt(doc.coverImage, (doc.institution as string) ?? ""),
        chartTimeSavedUrl: mediaUrl(charts.timeSaved),
        chartSpecialtyUrl: mediaUrl(charts.specialtyDistribution),
        chartLanguageUrl: mediaUrl(charts.languageDistribution),
        chartDoctorRatingsUrl: mediaUrl(charts.doctorRatings),
        validationLetterUrl: mediaUrl(charts.validationLetter),
      };
    }
    return {
      slug: spotlightFallback.slug,
      institution: spotlightFallback.institution,
      pullQuote: spotlightFallback.pullQuote,
      metricsLine: spotlightFallback.metricsLine,
      linkLabel: spotlightFallback.linkLabel,
      spotlight: true,
      coverImageUrl: null,
      coverImageAlt: "",
      chartTimeSavedUrl: null,
      chartSpecialtyUrl: null,
      chartLanguageUrl: null,
      chartDoctorRatingsUrl: null,
      validationLetterUrl: null,
    };
  },
  ["coll", "case-studies", "spotlight"],
  { tags: [TAG, "case-studies"] },
);

export async function getCaseStudyBySlug(slug: string) {
  const p = await payload();
  const res = await p.find({ collection: "case-studies", where: { slug: { equals: slug } }, limit: 1, depth: 0 });
  if (res.docs[0]) return res.docs[0];
  const fb = caseStudiesFallback.find((c) => c.slug === slug);
  return fb ? { slug: fb.slug, institution: fb.institution, pullQuote: fb.excerpt, metricsLine: "", spotlight: false } : null;
}

export const getPosts = unstable_cache(
  async () => {
    const p = await payload();
    const res = await p.find({ collection: "posts", sort: "-publishedAt", limit: 100, depth: 1 });
    if (res.docs.length > 0) return res.docs;
    return blogFallback.map((post) => ({
      slug: post.slug, title: post.title, excerpt: post.excerpt,
      category: post.category, readTimeMinutes: post.readMinutes,
      publishedAt: post.publishedAt,
    }));
  },
  ["coll", "posts"],
  { tags: [TAG, "posts"] },
);

export async function getPostBySlug(slug: string) {
  const p = await payload();
  const res = await p.find({ collection: "posts", where: { slug: { equals: slug } }, limit: 1, depth: 1 });
  if (res.docs[0]) return res.docs[0];
  const fb = blogFallback.find((p) => p.slug === slug);
  return fb ? { slug: fb.slug, title: fb.title, excerpt: fb.excerpt, category: fb.category, readTimeMinutes: fb.readMinutes, publishedAt: fb.publishedAt } : null;
}

export const getTestimonials = unstable_cache(
  async () => {
    const p = await payload();
    const res = await p.find({ collection: "testimonials", sort: "order", limit: 50, depth: 0 });
    if (res.docs.length > 0) return res.docs;
    return testimonialsFallback.map((t, i) => ({
      quote: t.quote, attribution: t.attribution, role: t.role ?? "", order: (i + 1) * 10,
    }));
  },
  ["coll", "testimonials"],
  { tags: [TAG, "testimonials"] },
);

export const getAwards = unstable_cache(
  async () => {
    const p = await payload();
    const res = await p.find({ collection: "awards", sort: "order", limit: 50, depth: 1 });
    if (res.docs.length > 0) {
      return res.docs.map((d) => {
        const doc = d as Record<string, unknown>;
        return {
          id: doc.id as string | number,
          name: doc.name as string,
          detail: (doc.detail as string) ?? "",
          imageUrl: mediaUrl(doc.image),
          imageAlt: mediaAlt(doc.image, doc.name as string),
          sourceUrl: (doc.sourceUrl as string) ?? null,
        };
      });
    }
    return awardsFallback.map((a, i) => ({
      id: i, name: a.name, detail: a.detail ?? "",
      imageUrl: null, imageAlt: a.name, sourceUrl: a.sourceUrl ?? null,
    }));
  },
  ["coll", "awards"],
  { tags: [TAG, "awards"] },
);

export const getTrialEmails = unstable_cache(
  async () => {
    const p = await payload();
    const res = await p.find({ collection: "trial-emails", sort: "sendOnDay", limit: 50, depth: 0 });
    return res.docs;
  },
  ["coll", "trial-emails"],
  { tags: [TAG, "trial-emails"] },
);

// ============================================================================
// Editable pages — /product, /for-doctors, /for-hospitals-and-hmis
// ============================================================================
//
// These three pages used to be hard-coded in their page.tsx files. They now
// read all of their copy from Payload. The readers below follow the same
// fallback-merge pattern as the rest of this file: if the DB row is empty or
// missing, the page still renders with sensible defaults so dev/CI/blank-DB
// environments never break.
//
// ----------------------------------------------------------------------------

/** Shape of one CTA button as authored in the CMS. */
type CtaShape = { label: string; href: string };

/** Shape of one product row returned to the frontend. */
export type ProductSummary = {
  id: string | number;
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  conciseAnswer: string;
  introParagraphs: string[];
  deploymentModes: Array<{ title: string; body: string }>;
  showPatientConsent: boolean;
  primaryCta: CtaShape;
  secondaryCta: CtaShape;
  order: number;
  featuredOnHome: boolean;
  seo: { title?: string; description?: string };
};

/** Normalise a raw Payload product doc into our flat ProductSummary. */
function normaliseProduct(doc: Record<string, unknown>): ProductSummary {
  const intros = (doc.introParagraphs as Array<{ text: string }> | undefined) ?? [];
  const modes = (doc.deploymentModes as Array<{ title: string; body: string }> | undefined) ?? [];
  const seo = (doc.seo as Record<string, string> | undefined) ?? {};
  return {
    id: doc.id as string | number,
    slug: doc.slug as string,
    name: doc.name as string,
    eyebrow: (doc.eyebrow as string) ?? "",
    tagline: (doc.tagline as string) ?? "",
    conciseAnswer: (doc.conciseAnswer as string) ?? "",
    introParagraphs: intros.map((p) => p.text).filter(Boolean),
    deploymentModes: modes,
    showPatientConsent: (doc.showPatientConsent as boolean | undefined) ?? true,
    primaryCta: (doc.primaryCta as CtaShape) ?? { label: "Start 7-day trial", href: "/trial" },
    secondaryCta: (doc.secondaryCta as CtaShape) ?? { label: "Talk to our team", href: "/contact" },
    order: (doc.order as number) ?? 100,
    featuredOnHome: (doc.featuredOnHome as boolean | undefined) ?? false,
    seo: { title: seo.title, description: seo.description },
  };
}

/**
 * The one product fallback we ship — VoiceDocAI.
 *
 * Used when the `products` collection is empty (fresh DB, CI, local dev
 * before seeding). The moment an editor adds a row in /admin, the real
 * collection takes over and this fallback drops out.
 */
const voiceDocAiFallback: ProductSummary = {
  id: "fallback-voicedocai",
  slug: "voicedocai",
  name: "VoiceDocAI",
  eyebrow: "Flagship product",
  tagline: "From conversation to structured report — verified before filing",
  conciseAnswer:
    "VoiceDocAI captures multilingual, multi-speaker conversations and drafts structured reports — clinical notes, qualitative research transcripts, interview summaries — for a human reviewer to approve. Noise-robust, accent-aware, and tuned for real-world environments.",
  introParagraphs: [
    "Engineered for high-noise, mixed-language conversations across clinics, OPDs, wards, research fieldwork, and procedure areas. We do not run a live microphone demo on this marketing site.",
    "Integrations available via documented APIs. Customers can deploy on-prem where residency and governance require it.",
  ],
  deploymentModes: [
    { title: "Web", body: "Browser app for clinics and outpatient flows." },
    { title: "Desktop", body: "Windows / macOS install for consult rooms." },
    { title: "Mobile", body: "Pocket-friendly Android client for wards and rounds." },
    { title: "On-prem", body: "Hospital-hosted deployment when residency or governance requires it." },
    { title: "API", body: "Documented endpoints for HMIS / EHR partners to embed capture and review." },
  ],
  showPatientConsent: true,
  primaryCta: { label: "Start 7-day trial", href: "/trial" },
  secondaryCta: { label: "Talk to our team", href: "/contact" },
  order: 10,
  featuredOnHome: true,
  seo: {
    title: "VoiceDocAI",
    description:
      "VoiceDocAI modes: multilingual capture, structuring, clinician verification, and HMIS push. Available on web, desktop, mobile, on-prem, and API.",
  },
};

// ---------------------------------------------------------------------------
// Page-level fallback defaults.
//
// These are the same shapes the readers below return. They are used when:
//   (a) the row exists in the CMS but has no copy yet, OR
//   (b) the DB call itself errors (e.g. fresh deploy where `push: true`
//       hasn't migrated the new globals/collection yet, or transient outage).
//
// Pulling them out as named constants means a try/catch in the reader can
// drop straight back to them without duplicating long copy blocks.
// ---------------------------------------------------------------------------

const productsPageDefaults = {
  eyebrow: "Our products",
  title: "AI-powered voice solutions for structured documentation",
  conciseAnswer:
    "Browse the Jatayu product line. Every product ships with human verification, multilingual multi-speaker capture, and deployment options that respect customer governance.",
  introParagraphs: [] as string[],
  seo: {
    title: "Products overview",
    description:
      "VoiceDocAI and the rest of the Jatayu product line: multilingual capture, structuring, human verification, and partner integration.",
  },
};

const forDoctorsPageDefaults = {
  eyebrow: "Clinician path",
  title: "Stay with patients, not the keyboard",
  conciseAnswer:
    "VoiceDocAI is built for practising physicians and clinics that need reliable multilingual capture, fast structured drafts, and a clear clinician approval step before anything is filed.",
  benefits: [
    "Speak any combination of languages — structured English output for the record.",
    "Hands-free workflows suited to busy OPDs. Pocket-friendly hardware footprint.",
    "Templates across 20+ specialties. The catalogue grows with each customer.",
    "You verify every note before filing. VoiceDocAI assists; you decide.",
  ],
  showPatientConsent: true,
  primaryCta: { label: "Start 7-day trial", href: "/trial" } as CtaShape,
  secondaryCta: { label: "Browse specialties", href: "/specialties" } as CtaShape,
  seo: {
    title: "Medical use case",
    description:
      "Hands-free, multilingual VoiceDocAI for clinicians. Real-world conversations turned into structured notes you approve.",
  },
};

const forHospitalsPageDefaults = {
  eyebrow: "Hospital IT & HMIS partners",
  title: "One clinical voice layer across your stack",
  conciseAnswer:
    "VoiceDocAI helps EMR, EHR, and HMIS vendors embed multilingual speech-to-note capabilities with governance-friendly audit trails, deployment flexibility (including API and on-prem), and documentation tuned for procurement reviewers.",
  integrationStory: {
    heading: "Integration story",
    steps: [
      "Authenticated ingest of encounter audio or partner-provided streams.",
      "Structured JSON + rendered clinical narrative aligned to templates.",
      "Clinician review events recorded for audit; exported via API or secure file patterns.",
      "Optional on-prem footprint — confirm reference architecture with engineering.",
    ],
  },
  procurementPack: {
    heading: "Procurement pack",
    body: "Send hospitals directly to the Security & Compliance page for HIPAA-aligned language, DPDP Act 2023 posture, ISO 27001 status, encryption, residency, and audit-log commitments — after founder and counsel sign every claim.",
    ctaLabel: "Open Security & Compliance",
    ctaHref: "/security",
  },
  primaryCta: { label: "Book integration workshop", href: "/contact" } as CtaShape,
  secondaryCta: { label: "Read case studies", href: "/case-studies" } as CtaShape,
  seo: {
    title: "For Hospitals & HMIS",
    description:
      "Integration models, latency SLAs, audit logs, data residency, and on-prem options for EMR/EHR/HMIS partners evaluating VoiceDocAI.",
  },
};

/** Centralised warn-and-fall-through so each catch block reads identically. */
function warnCmsRead(label: string, err: unknown) {
  // Don't crash the page — the DB might not have migrated yet (fresh deploy),
  // or there's a transient outage. Log and let the caller use defaults.
  console.warn(`[cms] ${label} read failed, falling back to defaults:`, (err as Error).message);
}

// ---------- Products collection ----------

export const getProducts = unstable_cache(
  async () => {
    try {
      const p = await payload();
      const res = await p.find({ collection: "products", sort: "order", limit: 50, depth: 0 });
      if (res.docs.length === 0) return [voiceDocAiFallback];
      return res.docs.map((d) => normaliseProduct(d as Record<string, unknown>));
    } catch (err) {
      warnCmsRead("getProducts", err);
      return [voiceDocAiFallback];
    }
  },
  ["coll", "products"],
  { tags: [TAG, "products"] },
);

export async function getProductBySlug(slug: string): Promise<ProductSummary | null> {
  try {
    const p = await payload();
    const res = await p.find({
      collection: "products",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    });
    if (res.docs[0]) return normaliseProduct(res.docs[0] as Record<string, unknown>);
  } catch (err) {
    warnCmsRead("getProductBySlug", err);
  }
  // No DB row (or DB unreachable) — fall back to the bundled product so dev /
  // fresh-deploy URLs keep working until an editor populates the collection.
  if (slug === voiceDocAiFallback.slug) return voiceDocAiFallback;
  return null;
}

// ---------- /product index header (ProductsPage global) ----------

export const getProductsPage = unstable_cache(
  async () => {
    try {
      const p = await payload();
      const row = (await p.findGlobal({ slug: "products-page", depth: 0 })) as
        | Record<string, unknown>
        | null
        | undefined;
      if (!row) return productsPageDefaults;
      const intros = (row.introParagraphs as Array<{ text: string }> | undefined) ?? [];
      const seo = (row.seo as Record<string, string> | undefined) ?? {};
      return {
        eyebrow: (row.eyebrow as string) ?? productsPageDefaults.eyebrow,
        title: (row.title as string) ?? productsPageDefaults.title,
        conciseAnswer: (row.conciseAnswer as string) ?? productsPageDefaults.conciseAnswer,
        introParagraphs: intros.map((p) => p.text).filter(Boolean),
        seo: {
          title: seo.title ?? productsPageDefaults.seo.title,
          description: seo.description ?? productsPageDefaults.seo.description,
        },
      };
    } catch (err) {
      warnCmsRead("getProductsPage", err);
      return productsPageDefaults;
    }
  },
  ["global", "products-page"],
  { tags: [TAG, "products-page"] },
);

// ---------- /for-doctors (ForDoctorsPage global) ----------

export const getForDoctorsPage = unstable_cache(
  async () => {
    try {
      const p = await payload();
      const row = (await p.findGlobal({ slug: "for-doctors-page", depth: 0 })) as
        | Record<string, unknown>
        | null
        | undefined;
      if (!row) return forDoctorsPageDefaults;
      const benefits = (row.benefits as Array<{ text: string }> | undefined) ?? [];
      const seo = (row.seo as Record<string, string> | undefined) ?? {};
      return {
        eyebrow: (row.eyebrow as string) ?? forDoctorsPageDefaults.eyebrow,
        title: (row.title as string) ?? forDoctorsPageDefaults.title,
        conciseAnswer:
          (row.conciseAnswer as string) ?? forDoctorsPageDefaults.conciseAnswer,
        benefits:
          benefits.length > 0
            ? benefits.map((b) => b.text).filter(Boolean)
            : forDoctorsPageDefaults.benefits,
        showPatientConsent:
          (row.showPatientConsent as boolean | undefined) ??
          forDoctorsPageDefaults.showPatientConsent,
        primaryCta: (row.primaryCta as CtaShape) ?? forDoctorsPageDefaults.primaryCta,
        secondaryCta: (row.secondaryCta as CtaShape) ?? forDoctorsPageDefaults.secondaryCta,
        seo: {
          title: seo.title ?? forDoctorsPageDefaults.seo.title,
          description: seo.description ?? forDoctorsPageDefaults.seo.description,
        },
      };
    } catch (err) {
      warnCmsRead("getForDoctorsPage", err);
      return forDoctorsPageDefaults;
    }
  },
  ["global", "for-doctors-page"],
  { tags: [TAG, "for-doctors-page"] },
);

// ---------- /for-hospitals-and-hmis (ForHospitalsPage global) ----------

export const getForHospitalsPage = unstable_cache(
  async () => {
    try {
      const p = await payload();
      const row = (await p.findGlobal({ slug: "for-hospitals-page", depth: 0 })) as
        | Record<string, unknown>
        | null
        | undefined;
      if (!row) return forHospitalsPageDefaults;
      const story = (row.integrationStory as Record<string, unknown> | undefined) ?? {};
      const procurement =
        (row.procurementPack as Record<string, unknown> | undefined) ?? {};
      const steps = (story.steps as Array<{ text: string }> | undefined) ?? [];
      const seo = (row.seo as Record<string, string> | undefined) ?? {};
      return {
        eyebrow: (row.eyebrow as string) ?? forHospitalsPageDefaults.eyebrow,
        title: (row.title as string) ?? forHospitalsPageDefaults.title,
        conciseAnswer:
          (row.conciseAnswer as string) ?? forHospitalsPageDefaults.conciseAnswer,
        integrationStory: {
          heading:
            (story.heading as string) ??
            forHospitalsPageDefaults.integrationStory.heading,
          steps:
            steps.length > 0
              ? steps.map((s) => s.text).filter(Boolean)
              : forHospitalsPageDefaults.integrationStory.steps,
        },
        procurementPack: {
          heading:
            (procurement.heading as string) ??
            forHospitalsPageDefaults.procurementPack.heading,
          body:
            (procurement.body as string) ?? forHospitalsPageDefaults.procurementPack.body,
          ctaLabel:
            (procurement.ctaLabel as string) ??
            forHospitalsPageDefaults.procurementPack.ctaLabel,
          ctaHref:
            (procurement.ctaHref as string) ??
            forHospitalsPageDefaults.procurementPack.ctaHref,
        },
        primaryCta: (row.primaryCta as CtaShape) ?? forHospitalsPageDefaults.primaryCta,
        secondaryCta:
          (row.secondaryCta as CtaShape) ?? forHospitalsPageDefaults.secondaryCta,
        seo: {
          title: seo.title ?? forHospitalsPageDefaults.seo.title,
          description: seo.description ?? forHospitalsPageDefaults.seo.description,
        },
      };
    } catch (err) {
      warnCmsRead("getForHospitalsPage", err);
      return forHospitalsPageDefaults;
    }
  },
  ["global", "for-hospitals-page"],
  { tags: [TAG, "for-hospitals-page"] },
);

// ---------- /SiteFooter (footer global) ----------
//
// Shape returned to the SiteFooter component. Designed to be the only thing
// the component reads, so the rest of the JSX is plain mapping.

export type FooterSocialPlatform =
  | "linkedin"
  | "instagram"
  | "x"
  | "youtube"
  | "facebook";

export type FooterLink = { label: string; href: string };
export type FooterSocialLink = { platform: FooterSocialPlatform; href: string };

export type SiteFooterContent = {
  tagline: string;
  productLinks: FooterLink[];
  companyLinks: FooterLink[];
  legalLinks: FooterLink[];
  socialLinks: FooterSocialLink[];
  bottomStrapline: string;
};

const siteFooterDefaults: SiteFooterContent = {
  tagline:
    "VoiceDocAI by Jatayu Healthcare: AI-powered voice solutions for structured documentation and insights. Multilingual. Multi-speaker. Built for verification before filing.",
  productLinks: footerColumnsFallback.product.map((l) => ({
    label: l.label,
    href: l.href,
  })),
  companyLinks: footerColumnsFallback.company.map((l) => ({
    label: l.label,
    href: l.href,
  })),
  legalLinks: footerColumnsFallback.legal.map((l) => ({
    label: l.label,
    href: l.href,
  })),
  // Defaults seeded from the URLs the founder shared on 2026-05-24. Editors
  // can change / add / remove these in /admin without code changes.
  socialLinks: [
    {
      platform: "linkedin",
      href: "https://www.linkedin.com/company/jatayu-healthcare-technologies",
    },
    { platform: "instagram", href: "https://www.instagram.com/jatayuhealth/" },
  ],
  bottomStrapline: "Built for clinicians, researchers, and analysts worldwide.",
};

/** Cheap runtime guard — only accept platforms the SocialIcon component knows. */
const KNOWN_PLATFORMS: FooterSocialPlatform[] = [
  "linkedin",
  "instagram",
  "x",
  "youtube",
  "facebook",
];
function isFooterSocialPlatform(value: unknown): value is FooterSocialPlatform {
  return typeof value === "string" && (KNOWN_PLATFORMS as string[]).includes(value);
}

export const getSiteFooter = unstable_cache(
  async (): Promise<SiteFooterContent> => {
    try {
      const p = await payload();
      const row = (await p.findGlobal({
        slug: "site-footer",
        depth: 0,
      })) as Record<string, unknown> | null | undefined;
      if (!row) return siteFooterDefaults;

      const productLinks = (row.productLinks as FooterLink[] | undefined) ?? [];
      const companyLinks = (row.companyLinks as FooterLink[] | undefined) ?? [];
      const legalLinks = (row.legalLinks as FooterLink[] | undefined) ?? [];
      const socialLinksRaw =
        (row.socialLinks as Array<{ platform: unknown; href: string }> | undefined) ?? [];

      return {
        tagline: (row.tagline as string) ?? siteFooterDefaults.tagline,
        productLinks:
          productLinks.length > 0 ? productLinks : siteFooterDefaults.productLinks,
        companyLinks:
          companyLinks.length > 0 ? companyLinks : siteFooterDefaults.companyLinks,
        legalLinks:
          legalLinks.length > 0 ? legalLinks : siteFooterDefaults.legalLinks,
        // Drop any rows whose platform value isn't in the SocialIcon switch —
        // otherwise we'd render a blank circle.
        socialLinks:
          socialLinksRaw.length > 0
            ? socialLinksRaw
                .filter((s) => isFooterSocialPlatform(s.platform) && !!s.href)
                .map((s) => ({
                  platform: s.platform as FooterSocialPlatform,
                  href: s.href,
                }))
            : siteFooterDefaults.socialLinks,
        bottomStrapline:
          (row.bottomStrapline as string) ?? siteFooterDefaults.bottomStrapline,
      };
    } catch (err) {
      warnCmsRead("getSiteFooter", err);
      return siteFooterDefaults;
    }
  },
  ["global", "site-footer"],
  { tags: [TAG, "site-footer"] },
);

// ============================================================================
// /about — AboutPage global + TeamMembers collection
// ============================================================================

/** Shape consumed by /about/page.tsx. */
export type TeamMemberSummary = {
  id: string | number;
  name: string;
  role: string;
  description: string;
  photoUrl: string | null;
  photoAlt: string;
  order: number;
  featuredOnHome: boolean;
};

const aboutPageDefaults = {
  eyebrow: "Our story",
  title: "Engineering rigour for any voice that needs to be heard, anywhere",
  conciseAnswer:
    "Jatayu Healthcare Technologies builds AI-powered voice solutions for structured documentation and insights. Co-founded by Dr. Aparna Oruganty Das (Director & CEO) and Sridhar Murthy, the team partners with clinicians, researchers, and analysts to remove documentation drag without compromising human oversight.",
  introParagraphs: [
    "VoiceDocAI emerged from repeated observations across busy clinics and qualitative research fieldwork: extraordinary throughput throttled by documentation latency and brittle transcription pathways. We are now in production across multiple verticals and expanding to new markets.",
  ] as string[],
  teamSectionHeading: "The team",
  teamSectionSubhead:
    "The clinicians, engineers, and operators building VoiceDocAI.",
  showFounderQuote: true,
  seo: {
    title: "About",
    description:
      "Jatayu Healthcare Technologies. VoiceDocAI founders, incubation story, and how the team partners with customers across clinical documentation, qualitative research, and beyond.",
  },
};

/**
 * Bundled fallback team. Keeps /about rendering before editors populate the
 * Team Members collection. Photos are null in the fallback (the card falls
 * back to a soft gradient block).
 */
const teamMembersFallback: TeamMemberSummary[] = [
  {
    id: "fallback-aparna",
    name: "Dr. Aparna Oruganty Das",
    role: "Director & CEO",
    description:
      "Practising clinician and co-founder. Drives clinical seriousness, validation methodology, and physician-in-the-loop guardrails across VoiceDocAI.",
    photoUrl: null,
    photoAlt: "Dr. Aparna Oruganty Das",
    order: 10,
    featuredOnHome: true,
  },
  {
    id: "fallback-sridhar",
    name: "Sridhar Murthy",
    role: "Co-founder",
    description:
      "Engineering co-founder. Leads the multilingual speech stack, deployment architecture, and integration partnerships with HMIS / EHR vendors.",
    photoUrl: null,
    photoAlt: "Sridhar Murthy",
    order: 20,
    featuredOnHome: true,
  },
];

/** Normalise a raw Payload team-member doc into TeamMemberSummary. */
function normaliseTeamMember(doc: Record<string, unknown>): TeamMemberSummary {
  return {
    id: doc.id as string | number,
    name: (doc.name as string) ?? "",
    role: (doc.role as string) ?? "",
    description: (doc.description as string) ?? "",
    photoUrl: mediaUrl(doc.photo),
    photoAlt: mediaAlt(doc.photo, (doc.name as string) ?? ""),
    order: (doc.order as number) ?? 100,
    featuredOnHome: (doc.featuredOnHome as boolean | undefined) ?? false,
  };
}

// ---------- TeamMembers collection ----------

export const getTeamMembers = unstable_cache(
  async (): Promise<TeamMemberSummary[]> => {
    try {
      const p = await payload();
      const res = await p.find({
        collection: "team-members",
        sort: "order",
        limit: 50,
        depth: 1, // resolve the photo upload
      });
      if (res.docs.length === 0) return teamMembersFallback;
      return res.docs.map((d) => normaliseTeamMember(d as Record<string, unknown>));
    } catch (err) {
      warnCmsRead("getTeamMembers", err);
      return teamMembersFallback;
    }
  },
  ["coll", "team-members"],
  { tags: [TAG, "team-members"] },
);

// ---------- /about (AboutPage global) ----------

export const getAboutPage = unstable_cache(
  async () => {
    try {
      const p = await payload();
      const row = (await p.findGlobal({ slug: "about-page", depth: 0 })) as
        | Record<string, unknown>
        | null
        | undefined;
      if (!row) return aboutPageDefaults;

      const intros = (row.introParagraphs as Array<{ text: string }> | undefined) ?? [];
      const seo = (row.seo as Record<string, string> | undefined) ?? {};

      return {
        eyebrow: (row.eyebrow as string) ?? aboutPageDefaults.eyebrow,
        title: (row.title as string) ?? aboutPageDefaults.title,
        conciseAnswer:
          (row.conciseAnswer as string) ?? aboutPageDefaults.conciseAnswer,
        introParagraphs:
          intros.length > 0
            ? intros.map((p) => p.text).filter(Boolean)
            : aboutPageDefaults.introParagraphs,
        teamSectionHeading:
          (row.teamSectionHeading as string) ?? aboutPageDefaults.teamSectionHeading,
        teamSectionSubhead:
          (row.teamSectionSubhead as string) ?? aboutPageDefaults.teamSectionSubhead,
        showFounderQuote:
          (row.showFounderQuote as boolean | undefined) ??
          aboutPageDefaults.showFounderQuote,
        seo: {
          title: seo.title ?? aboutPageDefaults.seo.title,
          description: seo.description ?? aboutPageDefaults.seo.description,
        },
      };
    } catch (err) {
      warnCmsRead("getAboutPage", err);
      return aboutPageDefaults;
    }
  },
  ["global", "about-page"],
  { tags: [TAG, "about-page"] },
);

// ============================================================================
// /use-cases — UseCasesPage global + UseCases collection
// ============================================================================

export type UseCaseSection = {
  eyebrow?: string;
  heading: string;
  body?: string;
  bullets: string[];
};

export type UseCaseSummary = {
  id: string | number;
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  shortPitch: string;
  iconUrl: string | null;
  iconAlt: string;
  introParagraphs: string[];
  sections: UseCaseSection[];
  primaryCta: CtaShape;
  secondaryCta: CtaShape;
  order: number;
  featuredOnHome: boolean;
  seo: { title?: string; description?: string };
};

const useCasesPageDefaults = {
  eyebrow: "Use cases",
  title: "Built for any conversation worth documenting",
  conciseAnswer:
    "VoiceDocAI captures multi-speaker conversations, identifies speakers, generates summaries, and produces ready-to-use reports. Tuned for multilingual, high-noise environments. Pick the workflow that matches your domain.",
  introParagraphs: [] as string[],
  seo: {
    title: "Use cases",
    description:
      "Domains where VoiceDocAI is in production today: clinical documentation, market research, and any workflow that turns voice into structured reports.",
  },
};

// Bundled fallback use cases. These render before any editor populates the
// collection. The Medical row consolidates everything that used to live on
// /for-doctors and /for-hospitals-and-hmis; the Market Research row reflects
// the company's second commercial vertical.
const useCasesFallback: UseCaseSummary[] = [
  {
    id: "fallback-medical",
    slug: "medical",
    name: "Medical & Healthcare",
    eyebrow: "Use case",
    tagline: "Voice-first documentation clinicians can verify",
    shortPitch:
      "VoiceDocAI drafts structured clinical documentation from real multilingual encounters: consultation notes, discharge summaries, prescriptions, radiology narratives, and OT notes. Clinicians review and approve instead of retyping.",
    iconUrl: null,
    iconAlt: "Medical use case",
    introParagraphs: [
      "Trusted by leading institutions including KEM Hospital (Mumbai), Basavatarakam Indo-American Cancer Centre (Hyderabad), ILBS Delhi, INHS Asvini, and Ohum Healthcare.",
      "Hands-free, pocket-friendly, and accent-aware. Multilingual capture stays robust in OPDs, wards, and procedure areas. Integration via documented APIs for HMIS / EHR partners; on-prem deployment available where data residency requires it.",
    ],
    sections: [
      {
        eyebrow: "For clinicians",
        heading: "Stay with patients, not the keyboard",
        body: "Designed for practising physicians and clinics that need reliable multilingual capture, fast structured drafts, and a clinician-in-the-loop approval step before anything is filed.",
        bullets: [
          "Speak any combination of languages — structured output for the record.",
          "Hands-free workflows suited to busy OPDs. Pocket-friendly hardware footprint.",
          "Templates across 20+ specialties — the catalogue grows with each customer.",
          "You verify every note before filing. VoiceDocAI assists; clinicians decide.",
        ],
      },
      {
        eyebrow: "For hospitals & HMIS partners",
        heading: "One clinical voice layer across your stack",
        body: "EMR, EHR, and HMIS vendors embed multilingual speech-to-note capabilities with governance-friendly audit trails, deployment flexibility (including API and on-prem), and documentation tuned for procurement reviewers.",
        bullets: [
          "Authenticated ingest of encounter audio or partner-provided streams.",
          "Structured JSON + rendered clinical narrative aligned to templates.",
          "Clinician review events recorded for audit; exported via API or secure file patterns.",
          "Optional on-prem footprint — confirm reference architecture with engineering.",
        ],
      },
      {
        eyebrow: "Procurement",
        heading: "Security & compliance posture",
        body: "HIPAA-aligned, DPDP-ready, data residency controls available per region. Visit the Security & Compliance page for the procurement appendix.",
        bullets: [],
      },
    ],
    primaryCta: { label: "Start 7-day trial", href: "/trial" },
    secondaryCta: { label: "Browse specialties", href: "/specialties" },
    order: 10,
    featuredOnHome: true,
    seo: {
      title: "Medical use case",
      description:
        "VoiceDocAI for clinics, hospitals, and HMIS partners. Multilingual capture, structured clinical documentation, clinician-in-the-loop review, and procurement-ready deployment.",
    },
  },
  {
    id: "fallback-market-research",
    slug: "market-research",
    name: "Market Research",
    eyebrow: "Use case",
    tagline: "AI-powered qualitative research intelligence",
    shortPitch:
      "Multilingual depth interviews, focus groups, ethnographies. VoiceDocAI transcribes, identifies themes and sentiments, and generates structured insight reports — eliminating manual transcription and translation cycles.",
    iconUrl: null,
    iconAlt: "Market research use case",
    introParagraphs: [
      "Used by qualitative research teams (including Priya Lobo Consults and Ormax Media) to compress the cycle from fieldwork to insight from weeks to days.",
    ],
    sections: [
      {
        eyebrow: "End-to-end pipeline",
        heading: "From raw conversation to structured insight",
        body: "Six stages, every one of them auditable: data capture, speech processing, contextual analysis, insight generation, quality assurance, and translation / transliteration.",
        bullets: [
          "Data capture — record multilingual conversations (in-person, virtual, hybrid).",
          "Speech processing — speaker-diarised, noise-robust transcription.",
          "Contextual analysis — NLP-driven themes, sentiments, and quoted context.",
          "Insight generation — structured patterns ready for the deck.",
          "Quality assurance — human-in-the-loop verification on every output.",
          "Translation & transliteration — local terminology preserved across markets.",
        ],
      },
      {
        eyebrow: "Why teams switch",
        heading: "Manual transcription is the bottleneck — not the analysis",
        body: "Traditional transcription and translation eat 60–70 % of the timeline. VoiceDocAI moves those steps to AI with reviewer oversight, freeing the team to focus on interpretation and storytelling.",
        bullets: [
          ">99 % thematic accuracy on real fieldwork (validated on Priya Lobo Consults data).",
          "Mixed-language conversations handled natively — no per-segment switching.",
          "Speaker-attributed quotes flow straight into report templates.",
          "Cuts insight turnaround time and frees analysts for higher-value work.",
        ],
      },
    ],
    primaryCta: { label: "Start 7-day trial", href: "/trial" },
    secondaryCta: { label: "Talk to our team", href: "/contact" },
    order: 20,
    featuredOnHome: true,
    seo: {
      title: "Market research use case",
      description:
        "AI-powered qualitative research intelligence. Multilingual transcription, theme analysis, sentiment, and structured insight reports — with human-in-the-loop verification.",
    },
  },
];

function normaliseUseCase(doc: Record<string, unknown>): UseCaseSummary {
  const intros = (doc.introParagraphs as Array<{ text: string }> | undefined) ?? [];
  const sections = (doc.sections as Array<Record<string, unknown>> | undefined) ?? [];
  const seo = (doc.seo as Record<string, string> | undefined) ?? {};
  return {
    id: doc.id as string | number,
    slug: doc.slug as string,
    name: doc.name as string,
    eyebrow: (doc.eyebrow as string) ?? "",
    tagline: (doc.tagline as string) ?? "",
    shortPitch: (doc.shortPitch as string) ?? "",
    iconUrl: mediaUrl(doc.icon),
    iconAlt: mediaAlt(doc.icon, (doc.name as string) ?? ""),
    introParagraphs: intros.map((p) => p.text).filter(Boolean),
    sections: sections.map((s) => {
      const bullets = (s.bullets as Array<{ text: string }> | undefined) ?? [];
      return {
        eyebrow: (s.eyebrow as string | undefined) || undefined,
        heading: (s.heading as string) ?? "",
        body: (s.body as string | undefined) || undefined,
        bullets: bullets.map((b) => b.text).filter(Boolean),
      };
    }),
    primaryCta: (doc.primaryCta as CtaShape) ?? { label: "Start 7-day trial", href: "/trial" },
    secondaryCta: (doc.secondaryCta as CtaShape) ?? { label: "Talk to our team", href: "/contact" },
    order: (doc.order as number) ?? 100,
    featuredOnHome: (doc.featuredOnHome as boolean | undefined) ?? false,
    seo: { title: seo.title, description: seo.description },
  };
}

export const getUseCases = unstable_cache(
  async (): Promise<UseCaseSummary[]> => {
    try {
      const p = await payload();
      const res = await p.find({ collection: "use-cases", sort: "order", limit: 50, depth: 1 });
      if (res.docs.length === 0) return useCasesFallback;
      return res.docs.map((d) => normaliseUseCase(d as Record<string, unknown>));
    } catch (err) {
      warnCmsRead("getUseCases", err);
      return useCasesFallback;
    }
  },
  ["coll", "use-cases"],
  { tags: [TAG, "use-cases"] },
);

export async function getUseCaseBySlug(slug: string): Promise<UseCaseSummary | null> {
  try {
    const p = await payload();
    const res = await p.find({
      collection: "use-cases",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    });
    if (res.docs[0]) return normaliseUseCase(res.docs[0] as Record<string, unknown>);
  } catch (err) {
    warnCmsRead("getUseCaseBySlug", err);
  }
  return useCasesFallback.find((u) => u.slug === slug) ?? null;
}

export const getUseCasesPage = unstable_cache(
  async () => {
    try {
      const p = await payload();
      const row = (await p.findGlobal({ slug: "use-cases-page", depth: 0 })) as
        | Record<string, unknown>
        | null
        | undefined;
      if (!row) return useCasesPageDefaults;
      const intros = (row.introParagraphs as Array<{ text: string }> | undefined) ?? [];
      const seo = (row.seo as Record<string, string> | undefined) ?? {};
      return {
        eyebrow: (row.eyebrow as string) ?? useCasesPageDefaults.eyebrow,
        title: (row.title as string) ?? useCasesPageDefaults.title,
        conciseAnswer:
          (row.conciseAnswer as string) ?? useCasesPageDefaults.conciseAnswer,
        introParagraphs:
          intros.length > 0 ? intros.map((p) => p.text).filter(Boolean) : useCasesPageDefaults.introParagraphs,
        seo: {
          title: seo.title ?? useCasesPageDefaults.seo.title,
          description: seo.description ?? useCasesPageDefaults.seo.description,
        },
      };
    } catch (err) {
      warnCmsRead("getUseCasesPage", err);
      return useCasesPageDefaults;
    }
  },
  ["global", "use-cases-page"],
  { tags: [TAG, "use-cases-page"] },
);
