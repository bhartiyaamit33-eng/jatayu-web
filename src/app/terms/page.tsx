import type { Metadata } from "next";
import { PageIntro } from "@/components/pages/PageIntro";
import { siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of jatayuhealth.com and trial signup flows.",
  alternates: { canonical: `${siteMeta.domain}/terms` },
};

export default function TermsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title="Terms of Service (draft scaffold)"
        conciseAnswer="Cover acceptable use, limitation of liability, governing law (India), medical disclaimer clarifying assistive AI role, and linkage to product agreements once countersigned."
      />
      <section className="container-page max-w-3xl pb-[var(--section-y)] text-sm text-slate">
        <p>CMS-managed legal copy pending.</p>
      </section>
    </>
  );
}
