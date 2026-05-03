/**
 * Seed Payload from the file-based content modules.
 *
 * Run with: npm run seed
 *
 * Idempotent — safe to re-run. Uses upsert semantics:
 *  - Globals: always overwritten with the latest source values.
 *  - Collections: rows with matching unique fields (slug, key, name) are updated; others created.
 *
 * After seeding the first time, you can edit content in /admin and the database
 * becomes the source of truth. Re-running the seed will OVERWRITE your /admin edits
 * for any field defined in src/content/*.ts — so don't blindly re-run in prod.
 */
import { getPayload } from "payload";
import config from "../src/payload.config";

import {
  audienceSplit,
  awards,
  caseStudiesIndex,
  caseStudySpotlight,
  complianceBand,
  deploymentModes,
  founderNote,
  homeConciseAnswer,
  homeConciseAnswerLabel,
  homeFaqs,
  homeHero,
  homeMetrics,
  howItWorksSteps,
  logoWall,
  patientConsentBlock,
  siteMeta,
  specialtiesFeatured,
  testimonials,
} from "../src/content/site-config";
import { blogPosts } from "../src/content/blog-posts";
import { trialDripEmails } from "../src/content/trial-emails";

async function upsertCollection<T extends Record<string, unknown>>(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: Parameters<Awaited<ReturnType<typeof getPayload>>["find"]>[0]["collection"],
  uniqueField: string,
  rows: T[],
) {
  for (const row of rows) {
    const value = row[uniqueField];
    if (typeof value !== "string") continue;
    const existing = await payload.find({
      collection,
      where: { [uniqueField]: { equals: value } },
      limit: 1,
      depth: 0,
    });
    if (existing.docs[0]) {
      await payload.update({
        collection,
        id: (existing.docs[0] as { id: string | number }).id,
        data: row as never,
      });
      console.log(`  ↻ ${String(collection)}: updated ${value}`);
    } else {
      await payload.create({ collection, data: row as never });
      console.log(`  + ${String(collection)}: created ${value}`);
    }
  }
}

async function main() {
  console.log("Initializing Payload…");
  const payload = await getPayload({ config });

  console.log("\nUpdating globals…");

  await payload.updateGlobal({
    slug: "site-meta",
    data: {
      productName: siteMeta.productName,
      legalName: siteMeta.legalName,
      domain: siteMeta.domain,
      salesEmail: siteMeta.salesEmail,
      supportEmail: siteMeta.founderEmail,
      addressLine: "Mumbai, India",
      defaultTitle: siteMeta.defaultTitle,
      defaultDescription: siteMeta.defaultDescription,
    },
  });
  console.log("  ↻ site-meta");

  await payload.updateGlobal({ slug: "home-hero", data: homeHero });
  console.log("  ↻ home-hero");

  await payload.updateGlobal({
    slug: "home-metrics",
    data: {
      metrics: homeMetrics.map((m) => ({
        key: m.id,
        value: m.value,
        label: m.label,
        sourceRef: m.sourceRef,
      })),
    },
  });
  console.log("  ↻ home-metrics");

  await payload.updateGlobal({ slug: "audience-split", data: audienceSplit });
  console.log("  ↻ audience-split");

  await payload.updateGlobal({
    slug: "patient-consent",
    data: {
      title: patientConsentBlock.title,
      body: patientConsentBlock.body,
      bullets: patientConsentBlock.bullets.map((text) => ({ text })),
    },
  });
  console.log("  ↻ patient-consent");

  await payload.updateGlobal({
    slug: "compliance-band",
    data: { items: complianceBand },
  });
  console.log("  ↻ compliance-band");

  await payload.updateGlobal({
    slug: "deployment-modes",
    data: { modes: deploymentModes },
  });
  console.log("  ↻ deployment-modes");

  await payload.updateGlobal({
    slug: "founder-note",
    data: {
      name: founderNote.name,
      role: founderNote.role,
      quote: founderNote.quote,
      aboutHref: founderNote.aboutHref,
    },
  });
  console.log("  ↻ founder-note");

  await payload.updateGlobal({
    slug: "logo-wall",
    data: { logos: logoWall.map((l) => ({ name: l.name, consentOnFile: false })) },
  });
  console.log("  ↻ logo-wall");

  await payload.updateGlobal({
    slug: "how-it-works-steps",
    data: { steps: howItWorksSteps },
  });
  console.log("  ↻ how-it-works-steps");

  await payload.updateGlobal({
    slug: "homepage-concise-answer",
    data: { label: homeConciseAnswerLabel, body: homeConciseAnswer },
  });
  console.log("  ↻ homepage-concise-answer");

  console.log("\nUpserting collections…");

  // FAQ
  await upsertCollection(
    payload,
    "home-faqs",
    "question",
    homeFaqs.map((f, i) => ({ question: f.question, answer: f.answer, order: (i + 1) * 10 })),
  );

  // Specialties
  await upsertCollection(
    payload,
    "specialties",
    "slug",
    specialtiesFeatured.map((s, i) => ({
      slug: s.slug,
      title: s.title,
      blurb: s.blurb,
      featuredOnHome: i < 4,
      order: (i + 1) * 10,
    })),
  );

  // Case studies
  await upsertCollection(
    payload,
    "case-studies",
    "slug",
    caseStudiesIndex.map((c, i) => {
      const isSpotlight = c.slug === caseStudySpotlight.slug;
      return {
        slug: c.slug,
        institution: c.institution,
        pullQuote: isSpotlight ? caseStudySpotlight.pullQuote : c.excerpt,
        metricsLine: isSpotlight ? caseStudySpotlight.metricsLine : "Metrics pending publication.",
        linkLabel: isSpotlight ? caseStudySpotlight.linkLabel : "Read more",
        spotlight: isSpotlight,
        publishedAt: isSpotlight ? "2025-12-19" : new Date().toISOString().slice(0, 10),
        order: (i + 1) * 10,
        _status: "published",
      };
    }),
  );

  // Testimonials (use first 12 chars of attribution as a stable handle)
  await upsertCollection(
    payload,
    "testimonials",
    "attribution",
    testimonials.map((t, i) => ({
      quote: t.quote,
      attribution: t.attribution,
      role: t.role ?? "",
      consentOnFile: false,
      order: (i + 1) * 10,
    })),
  );

  // Awards
  await upsertCollection(
    payload,
    "awards",
    "name",
    awards.map((a, i) => ({
      name: a.name,
      detail: a.detail ?? "",
      order: (i + 1) * 10,
    })),
  );

  // Trial drip emails
  await upsertCollection(
    payload,
    "trial-emails",
    "key",
    trialDripEmails.map((e) => ({
      key: e.id,
      sendOnDay: e.sendOnDay,
      subject: e.subject,
      preheader: e.preheader,
      body: e.body.map((text) => ({ text })),
      cta: e.cta,
    })),
  );

  // Blog posts (slugs)
  await upsertCollection(
    payload,
    "posts",
    "slug",
    blogPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      readTimeMinutes: p.readMinutes,
      publishedAt: p.publishedAt,
      _status: "published",
    })),
  );

  console.log("\nSeed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
