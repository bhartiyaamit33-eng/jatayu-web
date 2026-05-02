import type { Metadata } from "next";
import { PageIntro } from "@/components/pages/PageIntro";
import { siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Careers",
  description: "Careers at Jatayu Healthcare Technologies — VoiceDocAI hiring updates.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteMeta.domain}/careers` },
};

export default function CareersPage() {
  return (
    <>
      <PageIntro
        eyebrow="Careers"
        title="Build clinical-grade voice AI with us"
        conciseAnswer="Publish open roles from CMS—each listing should include mission alignment, location flexibility, and compliance expectations for handling sensitive healthcare workloads."
      />
      <section className="container-page pb-[var(--section-y)] text-sm text-slate">
        <p>No live openings mirrored yet—sync ATS or Notion embed via CMS block.</p>
      </section>
    </>
  );
}
