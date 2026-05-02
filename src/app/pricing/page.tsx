import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/pages/PageIntro";
import { JsonLd } from "@/components/seo/JsonLd";
import { homeFaqs, siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "VoiceDocAI pricing is customised per clinician count and hospital integrations—request a tailored quote rather than relying on outdated public numbers.",
  alternates: { canonical: `${siteMeta.domain}/pricing` },
};

const pricingFaqs = homeFaqs.filter((f) =>
  ["How long is the free trial?", "Can hospitals integrate via API?"].includes(
    f.question,
  ),
);

export default function PricingPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pricingFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <JsonLd data={faqLd} />
      <PageIntro
        eyebrow="Plans"
        title="Tailored pricing for clinicians and health systems"
        conciseAnswer="Public list pricing is intentionally omitted—founder-approved packaging now rolls up institution size, integration depth, SLAs, and support. Start with the trial or a procurement conversation so finance receives an accurate quote tied to clinical volume."
      />
      <section className="container-page py-[var(--section-y)] grid gap-10 lg:grid-cols-2">
        <div className="rounded-2xl border border-indigo/10 bg-white p-8 shadow-card">
          <h2 className="font-display text-xl font-bold text-navy">
            Individual & small clinic cohorts
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate">
            Pocket-friendly plans focus on per-seat ergonomics, multilingual coverage,
            and mobile/desktop availability. Commercial numbers live in proposals—not
            on this page—per latest founder guidance.
          </p>
          <Link
            href="/trial"
            className="mt-6 inline-flex rounded-xl bg-grad-accent px-6 py-3 font-display text-sm font-semibold text-white"
          >
            Start the 7-day trial
          </Link>
        </div>
        <div className="rounded-2xl border border-indigo/10 bg-navy p-8 text-white shadow-card">
          <h2 className="font-display text-xl font-bold">Hospitals & HMIS partners</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            Enterprise-grade agreements bundle API throughput, on-prem options,
            audit logging, training, and integration support. Security reviewers should
            pair finance discussions with the compliance appendix.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-xl border border-white/30 px-6 py-3 font-display text-sm font-semibold text-white hover:bg-white/10"
          >
            Request a hospital quote
          </Link>
        </div>
      </section>
    </>
  );
}
