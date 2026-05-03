/**
 * Server-only readers around Payload's Local API.
 *
 * Pages should call these instead of importing from `src/content/*` directly.
 * The `src/content/*` files remain in the repo only as the SEED source — once
 * production has been seeded, they can be deleted.
 */
import "server-only";
import { unstable_cache } from "next/cache";
import { getPayloadClient } from "./payload";

const TAG = "cms";

async function payload() {
  return await getPayloadClient();
}

export const getSiteMeta = unstable_cache(
  async () => {
    const p = await payload();
    return await p.findGlobal({ slug: "site-meta", depth: 0 });
  },
  ["global", "site-meta"],
  { tags: [TAG, "site-meta"] },
);

export const getHomeHero = unstable_cache(
  async () => {
    const p = await payload();
    return await p.findGlobal({ slug: "home-hero", depth: 0 });
  },
  ["global", "home-hero"],
  { tags: [TAG, "home-hero"] },
);

export const getHomeMetrics = unstable_cache(
  async () => {
    const p = await payload();
    return await p.findGlobal({ slug: "home-metrics", depth: 0 });
  },
  ["global", "home-metrics"],
  { tags: [TAG, "home-metrics"] },
);

export const getAudienceSplit = unstable_cache(
  async () => {
    const p = await payload();
    return await p.findGlobal({ slug: "audience-split", depth: 0 });
  },
  ["global", "audience-split"],
  { tags: [TAG, "audience-split"] },
);

export const getPatientConsent = unstable_cache(
  async () => {
    const p = await payload();
    return await p.findGlobal({ slug: "patient-consent", depth: 0 });
  },
  ["global", "patient-consent"],
  { tags: [TAG, "patient-consent"] },
);

export const getComplianceBand = unstable_cache(
  async () => {
    const p = await payload();
    return await p.findGlobal({ slug: "compliance-band", depth: 0 });
  },
  ["global", "compliance-band"],
  { tags: [TAG, "compliance-band"] },
);

export const getDeploymentModes = unstable_cache(
  async () => {
    const p = await payload();
    return await p.findGlobal({ slug: "deployment-modes", depth: 0 });
  },
  ["global", "deployment-modes"],
  { tags: [TAG, "deployment-modes"] },
);

export const getFounderNote = unstable_cache(
  async () => {
    const p = await payload();
    return await p.findGlobal({ slug: "founder-note", depth: 1 });
  },
  ["global", "founder-note"],
  { tags: [TAG, "founder-note"] },
);

export const getLogoWall = unstable_cache(
  async () => {
    const p = await payload();
    return await p.findGlobal({ slug: "logo-wall", depth: 0 });
  },
  ["global", "logo-wall"],
  { tags: [TAG, "logo-wall"] },
);

export const getHowItWorksSteps = unstable_cache(
  async () => {
    const p = await payload();
    return await p.findGlobal({ slug: "how-it-works-steps", depth: 0 });
  },
  ["global", "how-it-works-steps"],
  { tags: [TAG, "how-it-works-steps"] },
);

export const getHomepageConciseAnswer = unstable_cache(
  async () => {
    const p = await payload();
    return await p.findGlobal({ slug: "homepage-concise-answer", depth: 0 });
  },
  ["global", "homepage-concise-answer"],
  { tags: [TAG, "homepage-concise-answer"] },
);

export const getFaqs = unstable_cache(
  async () => {
    const p = await payload();
    const res = await p.find({
      collection: "home-faqs",
      sort: "order",
      limit: 50,
      depth: 0,
    });
    return res.docs;
  },
  ["coll", "home-faqs"],
  { tags: [TAG, "home-faqs"] },
);

export const getSpecialties = unstable_cache(
  async () => {
    const p = await payload();
    const res = await p.find({
      collection: "specialties",
      sort: "order",
      limit: 100,
      depth: 0,
    });
    return res.docs;
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
    return res.docs;
  },
  ["coll", "specialties", "featured"],
  { tags: [TAG, "specialties"] },
);

export async function getSpecialtyBySlug(slug: string) {
  const p = await payload();
  const res = await p.find({
    collection: "specialties",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });
  return res.docs[0] ?? null;
}

export const getCaseStudies = unstable_cache(
  async () => {
    const p = await payload();
    const res = await p.find({
      collection: "case-studies",
      sort: "order",
      limit: 100,
      depth: 0,
    });
    return res.docs;
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
    return res.docs[0] ?? null;
  },
  ["coll", "case-studies", "spotlight"],
  { tags: [TAG, "case-studies"] },
);

export async function getCaseStudyBySlug(slug: string) {
  const p = await payload();
  const res = await p.find({
    collection: "case-studies",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });
  return res.docs[0] ?? null;
}

export const getPosts = unstable_cache(
  async () => {
    const p = await payload();
    const res = await p.find({
      collection: "posts",
      sort: "-publishedAt",
      limit: 100,
      depth: 1,
    });
    return res.docs;
  },
  ["coll", "posts"],
  { tags: [TAG, "posts"] },
);

export async function getPostBySlug(slug: string) {
  const p = await payload();
  const res = await p.find({
    collection: "posts",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  });
  return res.docs[0] ?? null;
}

export const getTestimonials = unstable_cache(
  async () => {
    const p = await payload();
    const res = await p.find({
      collection: "testimonials",
      sort: "order",
      limit: 50,
      depth: 0,
    });
    return res.docs;
  },
  ["coll", "testimonials"],
  { tags: [TAG, "testimonials"] },
);

export const getAwards = unstable_cache(
  async () => {
    const p = await payload();
    const res = await p.find({
      collection: "awards",
      sort: "order",
      limit: 50,
      depth: 0,
    });
    return res.docs;
  },
  ["coll", "awards"],
  { tags: [TAG, "awards"] },
);

export const getTrialEmails = unstable_cache(
  async () => {
    const p = await payload();
    const res = await p.find({
      collection: "trial-emails",
      sort: "sendOnDay",
      limit: 50,
      depth: 0,
    });
    return res.docs;
  },
  ["coll", "trial-emails"],
  { tags: [TAG, "trial-emails"] },
);
