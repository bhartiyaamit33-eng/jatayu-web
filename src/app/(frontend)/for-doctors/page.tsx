/**
 * /for-doctors — clinician-facing page.
 *
 * All copy is read from the `for-doctors-page` global.
 * Editors update everything in **Admin → Globals → Page — For Doctors**.
 */
import type { Metadata } from "next";

import { PageIntro } from "@/components/pages/PageIntro";
import { Button } from "@/components/ui/Button";
import { PatientConsentBlock } from "@/components/blocks/PatientConsentBlock";
import { getForDoctorsPage, getSiteMeta } from "@/lib/cms";

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------
export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([getForDoctorsPage(), getSiteMeta()]);
  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { canonical: `${site.domain}/for-doctors` },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function ForDoctorsPage() {
  const page = await getForDoctorsPage();

  return (
    <>
      <PageIntro eyebrow={page.eyebrow} title={page.title} conciseAnswer={page.conciseAnswer} />

      <section className="container-page py-[var(--section-y)] space-y-12">
        {/* Benefit grid */}
        <ul className="grid gap-6 md:grid-cols-2">
          {page.benefits.map((text) => (
            <li
              key={text}
              className="rounded-2xl border border-indigo/10 bg-white p-6 text-sm leading-relaxed text-navy/85 shadow-card"
            >
              {text}
            </li>
          ))}
        </ul>

        {/* Shared "patient consent" block — toggled by the editor */}
        {page.showPatientConsent && <PatientConsentBlock />}

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <Button as="link" href={page.primaryCta.href} variant="primary" size="lg">
            {page.primaryCta.label}
          </Button>
          <Button as="link" href={page.secondaryCta.href} variant="secondary" size="lg">
            {page.secondaryCta.label}
          </Button>
        </div>
      </section>
    </>
  );
}
