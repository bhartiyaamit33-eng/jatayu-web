import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/pages/PageIntro";
import { JsonLd } from "@/components/seo/JsonLd";
import { deploymentModes, homeFaqs, siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Product overview",
  description:
    "VoiceDocAI modes: multilingual capture, structuring, clinician verification, HMIS push—web, desktop, mobile, on-prem, and API.",
  alternates: { canonical: `${siteMeta.domain}/product` },
};

const productFaqs = homeFaqs.slice(0, 4);

export default function ProductPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: productFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <JsonLd data={faqLd} />
      <PageIntro
        eyebrow={siteMeta.productName}
        title="Voice-first documentation your clinicians can verify"
        conciseAnswer="VoiceDocAI drafts structured English clinical documents from real multilingual encounters—consultation notes, discharge summaries, prescriptions, radiology narratives, and OT notes—so physicians review and approve instead of retyping."
      />
      <section className="container-page py-[var(--section-y)]">
        <div className="max-w-3xl space-y-6 text-slate">
          <p>
            Built at IIT Bombay with Indian noise profiles and accents in mind,
            VoiceDocAI stays hands-free in pocket-friendly deployments for OPDs,
            wards, and procedure areas—without exposing a browser microphone demo
            on this marketing site.
          </p>
          <p>
            HMIS and EHR partners integrate via documented APIs; hospitals can
            evaluate on-prem models where residency and governance require it.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {deploymentModes.map((d) => (
            <div
              key={d.title}
              className="rounded-2xl border border-indigo/10 bg-white p-6 shadow-card"
            >
              <h2 className="font-display text-lg font-bold text-navy">
                {d.title}
              </h2>
              <p className="mt-2 text-sm text-slate">{d.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap gap-4">
          <Link
            href="/trial"
            className="rounded-xl bg-grad-accent px-6 py-3 font-display text-sm font-semibold text-white"
          >
            Start 7-day trial
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-indigo/20 px-6 py-3 font-display text-sm font-semibold text-navy"
          >
            Talk to our team
          </Link>
        </div>
      </section>
    </>
  );
}
