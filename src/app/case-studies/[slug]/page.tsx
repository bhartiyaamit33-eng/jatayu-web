import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/pages/PageIntro";
import { caseStudiesIndex, siteMeta } from "@/content/site-config";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return caseStudiesIndex.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const cs = caseStudiesIndex.find((c) => c.slug === params.slug);
  if (!cs) return { title: "Case Study" };
  return {
    title: cs.title,
    description: cs.excerpt,
    alternates: {
      canonical: `${siteMeta.domain}/case-studies/${cs.slug}`,
    },
  };
}

export default function CaseStudyDetailPage({ params }: Props) {
  const cs = caseStudiesIndex.find((c) => c.slug === params.slug);
  if (!cs) {
    notFound();
  }

  const isKem = cs.slug === "kem-hospital";

  return (
    <>
      <PageIntro
        eyebrow={cs.institution}
        title={cs.title}
        conciseAnswer={
          isKem
            ? "The December 2025 KEM pilot evaluated VoiceDocAI across ~95 cases and ~18 clinicians in noisy clinical zones (around 70–90 dB), reporting substantial documentation time reduction and strong multilingual structuring performance—detail every figure only as approved in the published report."
            : "Populate this narrative from CMS with verified timelines, quotes under release, and sourcing suitable for procurement sharing."
        }
      />
      <section className="container-page py-[var(--section-y)] space-y-8">
        {isKem ? (
          <div className="rounded-2xl border border-indigo/10 bg-white p-8 shadow-card">
            <h2 className="font-display text-xl font-bold text-navy">
              Report-backed highlights
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate">
              <li>Pilot window: 03 Dec 2025 – 19 Dec 2025 (per submitted report).</li>
              <li>
                Coverage: Dermatology, Paediatrics, Surgical Gastroenterology,
                Orthopaedics, Radiology across OPD, ICU, and ward contexts.
              </li>
              <li>
                Noise conditions explicitly documented as challenging clinical
                environments—reference exact dB statements only after legal review.
              </li>
              <li>
                Multilingual Hindi–Marathi–English conversations consolidated into
                structured English documentation for clinician verification.
              </li>
            </ul>
          </div>
        ) : (
          <p className="max-w-3xl text-sm text-slate">
            CMS narrative pending—do not publish institution-specific metrics until
            founder approval is captured with sourcing metadata.
          </p>
        )}
        <Link href="/contact" className="inline-flex text-sm font-semibold text-magenta">
          Request the full procurement appendix →
        </Link>
      </section>
    </>
  );
}
