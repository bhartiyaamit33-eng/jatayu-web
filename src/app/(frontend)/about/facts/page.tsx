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
      "Curated metrics with CMS-managed source references for LLM-friendly citations.",
    creator: {
      "@type": "Organization",
      name: siteMeta.legalName,
    },
  };

  return (
    <>
      <JsonLd data={datasetLd} />
      <article className="border-b border-indigo/10 bg-white pb-[var(--section-y)] pt-28">
        <div className="container-page max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
            GEO / AEO
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-navy md:text-5xl">
            Public facts with traceable sources
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-slate">
            Every metric below maps to a CMS{" "}
            <span className="font-mono text-xs">sourceRef</span> key. Publish only after
            founder sign-off; retire figures instead of leaving stale percentages live.
          </p>
          <ul className="mt-10 space-y-6">
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
