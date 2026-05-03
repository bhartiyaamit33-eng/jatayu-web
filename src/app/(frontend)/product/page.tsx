import type { Metadata } from "next";
import { PageIntro } from "@/components/pages/PageIntro";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { PatientConsentBlock } from "@/components/blocks/PatientConsentBlock";
import { deploymentModes, homeFaqs, siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Product overview",
  description:
    "VoiceDocAI modes: multilingual capture, structuring, clinician verification, and HMIS push. Available on web, desktop, mobile, on-prem, and API.",
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
        conciseAnswer="VoiceDocAI drafts structured English clinical documents from real multilingual encounters: consultation notes, discharge summaries, prescriptions, radiology narratives, and OT notes. Physicians review and approve instead of retyping."
      />
      <section className="container-page py-[var(--section-y)] space-y-12">
        <div className="max-w-3xl space-y-5 text-base leading-relaxed text-navy/85">
          <p>
            Built at IIT Bombay with Indian noise profiles and accents in mind, VoiceDocAI
            stays hands-free in pocket-friendly deployments for OPDs, wards, and procedure
            areas. We do not run a live microphone demo on this marketing site.
          </p>
          <p>
            HMIS and EHR partners integrate via documented APIs. Hospitals can evaluate
            on-prem deployment where residency and governance require it.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {deploymentModes.map((d) => (
            <div
              key={d.title}
              className="rounded-2xl border border-indigo/10 bg-white p-6 shadow-card"
            >
              <h2 className="font-display text-lg font-bold text-navy">{d.title}</h2>
              <p className="mt-2 text-sm text-slate">{d.body}</p>
            </div>
          ))}
        </div>

        <PatientConsentBlock />

        <div className="flex flex-wrap gap-4">
          <Button as="link" href="/trial" variant="primary" size="lg">
            Start 7-day trial
          </Button>
          <Button as="link" href="/contact" variant="secondary" size="lg">
            Talk to our team
          </Button>
        </div>
      </section>
    </>
  );
}
