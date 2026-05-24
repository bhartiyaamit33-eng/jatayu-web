import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/pages/PageIntro";
import { getCaseStudies, getSiteMeta } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const siteMeta = await getSiteMeta();
  return {
    title: "Case Studies",
    description:
      "Hospital pilots and deployments featuring VoiceDocAI, starting with the KEM Hospital evaluation and municipal dispensary rollout.",
    alternates: { canonical: `${siteMeta.domain}/case-studies` },
  };
}

export default async function CaseStudiesPage() {
  const studies = await getCaseStudies();

  return (
    <>
      <PageIntro
        eyebrow="Evidence"
        title="Independent clinicians, noisy wards, measurable outcomes"
        conciseAnswer="Each case study cites methodology, dates, departments, sample sizes, and accuracy metrics exactly as approved. Suitable for procurement forwarding and generative engine citations."
      />
      <section className="container-page py-[var(--section-y)]">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studies.map((c) => (
            <Link
              key={c.slug}
              href={`/case-studies/${c.slug}`}
              className="rounded-2xl border border-indigo/10 bg-white p-8 shadow-card transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2"
            >
              <p className="text-[11px] font-bold uppercase tracking-widest text-indigo">
                {c.institution}
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-navy">
                {c.institution}
              </h2>
              <p className="mt-3 text-sm text-slate">{c.pullQuote}</p>
              <span className="mt-5 inline-block text-sm font-semibold text-magenta">
                Read study →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
