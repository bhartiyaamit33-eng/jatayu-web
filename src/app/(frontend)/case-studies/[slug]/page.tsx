import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/pages/PageIntro";
import { getCaseStudies, getCaseStudyBySlug, getSiteMeta } from "@/lib/cms";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const studies = await getCaseStudies();
    return studies.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [cs, siteMeta] = await Promise.all([
    getCaseStudyBySlug(slug),
    getSiteMeta(),
  ]);
  if (!cs) return { title: "Case Study" };
  return {
    title: cs.institution,
    description: cs.pullQuote,
    alternates: {
      canonical: `${siteMeta.domain}/case-studies/${cs.slug}`,
    },
  };
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) {
    notFound();
  }

  const isKem = cs.slug === "kem-hospital";

  return (
    <>
      <PageIntro
        eyebrow={cs.institution}
        title={cs.institution}
        conciseAnswer={
          isKem
            ? "The December 2025 KEM Hospital deployment evaluated VoiceDocAI across 95 cases and 18 clinicians in noisy clinical zones (around 70 to 90 dB), reporting substantial documentation time reduction and strong multilingual structuring performance."
            : "Populate this narrative in /admin with verified timelines, quotes under release, and sourcing suitable for procurement sharing."
        }
      />
      <section className="container-page py-[var(--section-y)] space-y-8">
        <blockquote className="max-w-3xl border-l-4 border-indigo/40 pl-5 text-lg leading-relaxed text-navy/85">
          &ldquo;{cs.pullQuote}&rdquo;
        </blockquote>
        <p className="max-w-3xl text-sm text-slate">{cs.metricsLine}</p>
        {isKem ? (
          <div className="rounded-2xl border border-indigo/10 bg-white p-8 shadow-card">
            <h2 className="font-display text-xl font-bold text-navy">
              Report-backed highlights
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate">
              <li>Pilot window: 03 Dec 2025 to 19 Dec 2025 (per submitted report).</li>
              <li>
                Coverage: Dermatology, Paediatrics, Surgical Gastroenterology,
                Orthopaedics, Radiology across OPD, ICU, and ward contexts.
              </li>
              <li>
                Noise conditions documented as challenging clinical environments.
                Reference exact dB statements only after legal review.
              </li>
              <li>
                Multilingual Hindi, Marathi, and English conversations consolidated
                into structured English documentation for clinician verification.
              </li>
            </ul>
          </div>
        ) : null}
        <Link
          href="/contact"
          className="inline-flex text-sm font-semibold text-magenta hover:text-purple"
        >
          Request the full procurement appendix →
        </Link>
      </section>
    </>
  );
}
