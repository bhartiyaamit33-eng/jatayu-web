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
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
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
  partnerRowImages,
  patientConsentBlock,
  siteMeta,
  specialtiesFeatured,
  testimonials,
} from "@/content/site-config";
import { blogPosts } from "@/content/blog-posts";
import { trialDripEmails } from "@/content/trial-emails";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BRAND_DIR = path.join(process.cwd(), "public", "brand");

type Payload = Awaited<ReturnType<typeof getPayloadClient>>;
type CollectionSlug =
  | "home-faqs"
  | "specialties"
  | "case-studies"
  | "testimonials"
  | "awards"
  | "trial-emails"
  | "posts";

async function uploadMedia(
  payload: Payload,
  relativePath: string,
  alt: string,
  log: string[],
): Promise<string | number | null> {
  const absPath = path.join(BRAND_DIR, relativePath);
  try {
    const stats = await stat(absPath);
    if (!stats.isFile()) return null;
  } catch {
    log.push(`media-skip (missing): ${relativePath}`);
    return null;
  }
  const filename = path.basename(absPath);
  // Idempotent: if a media doc with this filename already exists, reuse it.
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  });
  if (existing.docs[0]) {
    log.push(`media-reuse: ${relativePath}`);
    return (existing.docs[0] as { id: string | number }).id;
  }
  const buffer = await readFile(absPath);
  const doc = await payload.create({
    collection: "media",
    data: { alt },
    file: {
      data: buffer,
      mimetype: "image/png",
      name: filename,
      size: buffer.length,
    },
  });
  log.push(`media-upload: ${relativePath}`);
  return (doc as { id: string | number }).id;
}

async function upsert<T extends Record<string, unknown>>(
  payload: Payload,
  collection: CollectionSlug,
  uniqueField: string,
  rows: T[],
  log: string[],
  prune = false,
) {
  const seededValues = new Set<string>();
  for (const row of rows) {
    const value = row[uniqueField];
    if (typeof value !== "string") continue;
    seededValues.add(value);
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

  // Opt-in pruning: delete rows whose unique key is no longer in the source
  // seed set. This removes stale content left behind by older seeds (the seed
  // is otherwise additive). Skipped by default so content authored directly in
  // the CMS is never destroyed on a routine re-seed.
  if (!prune) return;
  const all = await payload.find({ collection, limit: 500, depth: 0 });
  for (const doc of all.docs as Array<Record<string, unknown>>) {
    const value = doc[uniqueField];
    if (typeof value !== "string" || seededValues.has(value)) continue;
    await payload.delete({ collection, id: doc.id as string | number });
    log.push(`pruned ${collection}: ${value}`);
  }
}

export async function POST(req: Request) {
  const secret = req.headers.get("x-seed-secret");
  if (!secret || secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const log: string[] = [];
  // ?prune=1 also deletes seed-managed rows that are no longer in the source.
  const prune = new URL(req.url).searchParams.get("prune") === "1";

  try {
    const payload = await getPayloadClient();

    // ---------- Media uploads (idempotent) ----------
    const mediaIds: Record<string, string | number | null> = {};
    const mediaUploads: Array<{ key: string; path: string; alt: string }> = [
      { key: "supportersStrip", path: partnerRowImages.supporters, alt: "Jatayu supporter ecosystem strip: Google Cloud for Startups, BIRAC, MeitY, SINE IIT Bombay" },
      { key: "hospitalsRow", path: partnerRowImages.hospitals, alt: "Hospital partner row: Basavatarakam Cancer Centre Hyderabad, ILBS Delhi, MGM Medical College Kamothe" },
      { key: "ehrRow", path: partnerRowImages.ehrs, alt: "EHR / HMIS partner row: Akhil Systems, Dataman Computer Systems, Ohum Healthcare, Jeena Sikho" },
      { key: "howItWorksFlow", path: "product/how-it-works-flow.png", alt: "VoiceDocAI five-step flow: conversation, capture, structuring, doctor verification, HMIS integration" },
      { key: "voicedocaiWebApp", path: "product/voicedocai-web-app-clean.png", alt: "VoiceDocAI web app: Summary Data with structured clinical sections" },
      { key: "voicedocaiPdfReports", path: "product/voicedocai-pdf-reports.png", alt: "VoiceDocAI structured PDF reports for HMIS handoff" },
      { key: "kemTimeSavedBar", path: "case-studies/kem-time-saved-bar.png", alt: "KEM Hospital deployment: manual vs VoiceDocAI documentation time (5 min vs 1 min)" },
      { key: "kemSpecialtyDistribution", path: "case-studies/kem-specialty-distribution.png", alt: "KEM Hospital deployment: distribution of reports across specialties" },
      { key: "kemLanguageDistribution", path: "case-studies/kem-language-distribution.png", alt: "KEM Hospital deployment: distribution of languages used in patient encounters" },
      { key: "kemDoctorFeedback", path: "case-studies/kem-doctor-feedback-ratings.png", alt: "KEM Hospital deployment: average clinician ratings: adoption 4.7, multilingual 4.6, noise 4.2, speed 4.1" },
      { key: "mgmValidationLetter", path: "case-studies/mgm-validation-letter-clean.png", alt: "MGM Medical College, Kamothe: written validation letter for VoiceDocAI" },
      { key: "jatayuMark", path: "jatayu-mark.png", alt: "Jatayu Healthcare phoenix mark" },
    ];
    // Award images (one per award where we have one)
    for (const award of awards) {
      if (award.imagePath) {
        mediaUploads.push({ key: `award-${award.name}`, path: award.imagePath, alt: award.name });
      }
    }

    for (const item of mediaUploads) {
      mediaIds[item.key] = await uploadMedia(payload, item.path, item.alt, log);
    }

    // ---------- Globals ----------
    await payload.updateGlobal({
      slug: "site-meta",
      data: {
        productName: siteMeta.productName,
        legalName: siteMeta.legalName,
        domain: siteMeta.domain,
        salesEmail: siteMeta.salesEmail,
        supportEmail: siteMeta.founderEmail,
        addressLine: "6005A, 6th floor, SINE, Rahul Bajaj Technology Innovation Centre, IIT Bombay, Powai, Mumbai 400076",
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
        // portrait left null - founder to supply professional headshot
      },
    });
    log.push("global founder-note");

    await payload.updateGlobal({
      slug: "logo-wall",
      data: {
        logos: logoWall.map((l) => ({
          name: l.name,
          category: l.category ?? "hospital",
          consentOnFile: false,
          href: l.href ?? null,
        })),
        hospitalRowImage: mediaIds.hospitalsRow ?? null,
        ehrRowImage: mediaIds.ehrRow ?? null,
        supportersRowImage: mediaIds.supportersStrip ?? null,
      },
    });
    log.push("global logo-wall");

    await payload.updateGlobal({
      slug: "how-it-works-steps",
      data: {
        flowDiagram: mediaIds.howItWorksFlow ?? null,
        steps: howItWorksSteps,
      },
    });
    log.push("global how-it-works-steps");

    await payload.updateGlobal({
      slug: "homepage-concise-answer",
      data: { label: homeConciseAnswerLabel, body: homeConciseAnswer },
    });
    log.push("global homepage-concise-answer");

    // ---------- Collections ----------
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
      prune,
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
      prune,
    );

    await upsert(
      payload,
      "case-studies",
      "slug",
      caseStudiesIndex.map((c, i) => {
        const isSpotlight = c.slug === caseStudySpotlight.slug;
        const isKem = c.slug === "kem-hospital";
        const isMgm = c.slug === "mgm";
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
          coverImage: isKem
            ? mediaIds.kemTimeSavedBar
            : isMgm
              ? mediaIds.mgmValidationLetter
              : null,
          charts: isKem
            ? {
                timeSaved: mediaIds.kemTimeSavedBar ?? null,
                specialtyDistribution: mediaIds.kemSpecialtyDistribution ?? null,
                languageDistribution: mediaIds.kemLanguageDistribution ?? null,
                doctorRatings: mediaIds.kemDoctorFeedback ?? null,
                validationLetter: null,
              }
            : isMgm
              ? {
                  timeSaved: null,
                  specialtyDistribution: null,
                  languageDistribution: null,
                  doctorRatings: null,
                  validationLetter: mediaIds.mgmValidationLetter ?? null,
                }
              : {},
        };
      }),
      log,
      prune,
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
      prune,
    );

    await upsert(
      payload,
      "awards",
      "name",
      awards.map((a, i) => ({
        name: a.name,
        detail: a.detail ?? "",
        image: a.imagePath ? mediaIds[`award-${a.name}`] ?? null : null,
        sourceUrl: a.sourceUrl ?? null,
        order: (i + 1) * 10,
      })),
      log,
      prune,
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
      prune,
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
      prune,
    );

    // Bust the unstable_cache layer so the frontend re-reads fresh data.
    // Next 16 requires the profile argument; "max" matches the old default.
    revalidateTag("cms", "max");
    log.push("revalidated tag: cms");

    return NextResponse.json({ ok: true, prune, count: log.length, log });
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
