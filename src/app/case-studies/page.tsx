import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/pages/PageIntro";
import { caseStudiesIndex, siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Hospital pilots and deployments featuring VoiceDocAI—starting with the KEM Hospital evaluation and municipal dispensary rollout.",
  alternates: { canonical: `${siteMeta.domain}/case-studies` },
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Evidence"
        title="Independent clinicians, noisy wards, measurable outcomes"
        conciseAnswer="Each case study page should cite methodology, dates, departments, sample sizes, and accuracy metrics exactly as approved—ideal for procurement forwarding and generative engine citations."
      />
      <section className="container-page py-[var(--section-y)]">
        <div className="grid gap-6 md:grid-cols-2">
          {caseStudiesIndex.map((c) => (
            <Link
              key={c.slug}
              href={`/case-studies/${c.slug}`}
              className="rounded-2xl border border-indigo/10 bg-white p-8 shadow-card transition-transform hover:-translate-y-1"
            >
              <p className="font-mono text-[11px] uppercase tracking-widest text-indigo">
                {c.institution}
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-navy">
                {c.title}
              </h2>
              <p className="mt-3 text-sm text-slate">{c.excerpt}</p>
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
