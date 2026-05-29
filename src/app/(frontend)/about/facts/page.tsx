import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { homeMetrics, siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Sourced facts",
  description:
    "Citation-backed metrics and deployment facts about VoiceDocAI, maintained for GEO/AEO and procurement sharing.",
  alternates: { canonical: `${siteMeta.domain}/about/facts` },
};

export default function FactsPage() {
  const datasetLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${siteMeta.productName} public metrics`,
    description:
      "Curated metrics with traceable source references.",
    creator: {
      "@type": "Organization",
      name: siteMeta.legalName,
    },
  };

  return (
    <>
      <JsonLd data={datasetLd} />
      <article className="border-b border-indigo/10 bg-white pb-[var(--section-y)] pt-28">
        <div className="container-page">
          {/* Narrative header stays narrow for readability; the metric grid below
              spans the full container so the page doesn't feel sparse on wide screens. */}
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
              GEO / AEO
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-navy md:text-5xl">
              Public facts with traceable sources
            </h1>
            <p className="mt-6 text-sm leading-relaxed text-slate">
              Every metric below carries a traceable source so journalists,
              procurement reviewers, and generative engines can cite us
              accurately. Numbers shown are signed-off and current.
            </p>
          </div>

          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {homeMetrics.map((m) => (
              <li
                key={m.id}
                className="rounded-2xl border border-indigo/10 bg-pale-blue p-6"
              >
                <p className="font-display text-3xl font-extrabold text-navy">
                  {m.value}
                </p>
                <p className="mt-2 text-sm font-medium text-slate">{m.label}</p>
                <p className="mt-3 font-mono text-xs text-indigo">
                  sourceRef: {m.sourceRef}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </>
  );
}
