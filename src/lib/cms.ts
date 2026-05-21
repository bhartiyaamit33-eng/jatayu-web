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
  homeFaqs as faqsFallback,
  specialtiesFeatured as specialtiesFallback,
  caseStudiesIndex as caseStudiesFallback,
  caseStudySpotlight as spotlightFallback,
  testimonials as testimonialsFallback,
  awards as awardsFallback,
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
    const row = await p.findGlobal({ slug: "site-meta", depth: 0 });
    return {
      productName: row.productName ?? siteMetaFallback.productName,
      legalName: row.legalName ?? siteMetaFallback.legalName,
      domain: row.domain ?? siteMetaFallback.domain,
      salesEmail: row.salesEmail ?? siteMetaFallback.salesEmail,
      supportEmail: (row as Record<string, unknown>).supportEmail as string ?? siteMetaFallback.founderEmail,
      defaultTitle: row.defaultTitle ?? siteMetaFallback.defaultTitle,
      defaultDescription: row.defaultDescription ?? siteMetaFallback.defaultDescription,
      founderEmail: siteMetaFallback.founderEmail,
    };
  },
  ["global", "site-meta"],
  { tags: [TAG, "site-meta"] },
);

export const getHomeHero = unstable_cache(
  async () => {
    const p = await payload();
    const row = await p.findGlobal({ slug: "home-hero", depth: 0 });
    return {
      badge: (row as Record<string, unknown>).badge as string ?? heroFallback.badge,
      headline: (row as Record<string, unknown>).headline as string ?? heroFallback.headline,
      subheadline: (row as Record<string, unknown>).subheadline as string ?? heroFallback.subheadline,
      trustLine: (row as Record<string, unknown>).trustLine as string ?? heroFallback.trustLine,
      primaryCta: (row as Record<string, unknown>).primaryCta as typeof heroFallback.primaryCta ?? heroFallback.primaryCta,
      secondaryCta: (row as Record<string, unknown>).secondaryCta as typeof heroFallback.secondaryCta ?? heroFallback.secondaryCta,
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

export const getFounderNote = unstable_cache(
  async () => {
    const p = await payload();
    const row = await p.findGlobal({ slug: "founder-note", depth: 1 }) as Record<string, unknown>;
    return {
      name: row.name as string ?? founderFallback.name,
      role: row.role as string ?? founderFallback.role,
      quote: row.quote as string ?? founderFallback.quote,
      aboutHref: row.aboutHref as string ?? founderFallback.aboutHref,
    };
  },
  ["global", "founder-note"],
  { tags: [TAG, "founder-note"] },
);

export const getLogoWall = unstable_cache(
  async () => {
    const p = await payload();
    const row = await p.findGlobal({ slug: "logo-wall", depth: 0 }) as Record<string, unknown>;
    const logos = row.logos as Array<{ name: string }> | undefined;
    if (logos && Array.isArray(logos) && logos.length > 0) return logos;
    return logoWallFallback.map((l) => ({ name: l.name }));
  },
  ["global", "logo-wall"],
  { tags: [TAG, "logo-wall"] },
);

export const getHowItWorksSteps = unstable_cache(
  async () => {
    const p = await payload();
    const row = await p.findGlobal({ slug: "how-it-works-steps", depth: 0 }) as Record<string, unknown>;
    const steps = row.steps as typeof stepsFallback | undefined;
    return (steps && Array.isArray(steps) && steps.length > 0) ? steps : stepsFallback;
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
      depth: 0,
    });
    if (res.docs[0]) return res.docs[0];
    return {
      slug: spotlightFallback.slug,
      institution: spotlightFallback.institution,
      pullQuote: spotlightFallback.pullQuote,
      metricsLine: spotlightFallback.metricsLine,
      linkLabel: spotlightFallback.linkLabel,
      spotlight: true,
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
    const res = await p.find({ collection: "awards", sort: "order", limit: 50, depth: 0 });
    if (res.docs.length > 0) return res.docs;
    return awardsFallback.map((a, i) => ({ name: a.name, detail: a.detail ?? "", order: (i + 1) * 10 }));
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
