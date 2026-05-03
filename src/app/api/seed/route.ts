/**
 * One-shot seed endpoint.
 *
 * POST http://localhost:3000/api/seed with header `x-seed-secret: <PAYLOAD_SECRET>`.
 *
 * Runs inside the Next.js context where Payload is already happy. Idempotent:
 * globals are overwritten, collection rows are upserted by their unique field.
 *
 * For production: bump PAYLOAD_SECRET, then call once after deploy. Do not expose.
 */
import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";
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
} from "@/content/site-config";
import { blogPosts } from "@/content/blog-posts";
import { trialDripEmails } from "@/content/trial-emails";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CollectionSlug =
  | "home-faqs"
  | "specialties"
  | "case-studies"
  | "testimonials"
  | "awards"
  | "trial-emails"
  | "posts";

async function upsert<T extends Record<string, unknown>>(
  payload: Awaited<ReturnType<typeof getPayloadClient>>,
  collection: CollectionSlug,
  uniqueField: string,
  rows: T[],
  log: string[],
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: row as any,
      });
      log.push(`updated ${collection}: ${value}`);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.create({ collection, data: row as any });
      log.push(`created ${collection}: ${value}`);
    }
  }
}

export async function POST(req: Request) {
  const secret = req.headers.get("x-seed-secret");
  if (!secret || secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const log: string[] = [];

  try {
    const payload = await getPayloadClient();

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
    log.push("global site-meta");

    await payload.updateGlobal({ slug: "home-hero", data: homeHero });
    log.push("global home-hero");

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
    log.push("global home-metrics");

    await payload.updateGlobal({ slug: "audience-split", data: audienceSplit });
    log.push("global audience-split");

    await payload.updateGlobal({
      slug: "patient-consent",
      data: {
        title: patientConsentBlock.title,
        body: patientConsentBlock.body,
        bullets: patientConsentBlock.bullets.map((text) => ({ text })),
      },
    });
    log.push("global patient-consent");

    await payload.updateGlobal({
      slug: "compliance-band",
      data: { items: complianceBand },
    });
    log.push("global compliance-band");

    await payload.updateGlobal({
      slug: "deployment-modes",
      data: { modes: deploymentModes },
    });
    log.push("global deployment-modes");

    await payload.updateGlobal({
      slug: "founder-note",
      data: {
        name: founderNote.name,
        role: founderNote.role,
        quote: founderNote.quote,
        aboutHref: founderNote.aboutHref,
      },
    });
    log.push("global founder-note");

    await payload.updateGlobal({
      slug: "logo-wall",
      data: { logos: logoWall.map((l) => ({ name: l.name, consentOnFile: false })) },
    });
    log.push("global logo-wall");

    await payload.updateGlobal({
      slug: "how-it-works-steps",
      data: { steps: howItWorksSteps },
    });
    log.push("global how-it-works-steps");

    await payload.updateGlobal({
      slug: "homepage-concise-answer",
      data: { label: homeConciseAnswerLabel, body: homeConciseAnswer },
    });
    log.push("global homepage-concise-answer");

    await upsert(
      payload,
      "home-faqs",
      "question",
      homeFaqs.map((f, i) => ({
        question: f.question,
        answer: f.answer,
        order: (i + 1) * 10,
      })),
      log,
    );

    await upsert(
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
      log,
    );

    await upsert(
      payload,
      "case-studies",
      "slug",
      caseStudiesIndex.map((c, i) => {
        const isSpotlight = c.slug === caseStudySpotlight.slug;
        return {
          slug: c.slug,
          institution: c.institution,
          pullQuote: isSpotlight ? caseStudySpotlight.pullQuote : c.excerpt,
          metricsLine: isSpotlight
            ? caseStudySpotlight.metricsLine
            : "Metrics pending publication.",
          linkLabel: isSpotlight ? caseStudySpotlight.linkLabel : "Read more",
          spotlight: isSpotlight,
          publishedAt: isSpotlight
            ? "2025-12-19T00:00:00.000Z"
            : new Date().toISOString(),
          order: (i + 1) * 10,
          _status: "published",
        };
      }),
      log,
    );

    await upsert(
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
      log,
    );

    await upsert(
      payload,
      "awards",
      "name",
      awards.map((a, i) => ({
        name: a.name,
        detail: a.detail ?? "",
        order: (i + 1) * 10,
      })),
      log,
    );

    await upsert(
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
      log,
    );

    await upsert(
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
      log,
    );

    return NextResponse.json({ ok: true, count: log.length, log });
  } catch (err) {
    console.error("Seed failed", err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Unknown",
        log,
      },
      { status: 500 },
    );
  }
}
