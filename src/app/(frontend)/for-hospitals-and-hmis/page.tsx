/**
 * /for-hospitals-and-hmis — hospital IT & HMIS partner page.
 *
 * All copy is read from the `for-hospitals-page` global.
 * Editors update everything in **Admin → Globals → Page — For Hospitals & HMIS**.
 */
import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/pages/PageIntro";
import { getForHospitalsPage, getSiteMeta } from "@/lib/cms";

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------
export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([getForHospitalsPage(), getSiteMeta()]);
  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { canonical: `${site.domain}/for-hospitals-and-hmis` },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function ForHospitalsPage() {
  const page = await getForHospitalsPage();

  return (
    <>
      <PageIntro eyebrow={page.eyebrow} title={page.title} conciseAnswer={page.conciseAnswer} />

      <section className="container-page py-[var(--section-y)]">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Card 1 — Integration story (ordered list) */}
          <div className="rounded-2xl border border-indigo/10 bg-white p-8 shadow-card">
            <h2 className="font-display text-xl font-bold text-navy">
              {page.integrationStory.heading}
            </h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-slate">
              {page.integrationStory.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Card 2 — Procurement pack (dark) */}
          <div className="rounded-2xl border border-indigo/10 bg-navy p-8 text-white shadow-card">
            <h2 className="font-display text-xl font-bold">{page.procurementPack.heading}</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              {page.procurementPack.body}
            </p>
            <Link
              href={page.procurementPack.ctaHref}
              className="mt-6 inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-navy"
            >
              {page.procurementPack.ctaLabel}
            </Link>
          </div>
        </div>

        {/* Bottom CTAs */}
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href={page.primaryCta.href}
            className="rounded-xl bg-grad-accent px-6 py-3 font-display text-sm font-semibold text-white"
          >
            {page.primaryCta.label}
          </Link>
          <Link
            href={page.secondaryCta.href}
            className="rounded-xl border border-indigo/20 px-6 py-3 font-display text-sm font-semibold text-navy"
          >
            {page.secondaryCta.label}
          </Link>
        </div>
      </section>
    </>
  );
}
