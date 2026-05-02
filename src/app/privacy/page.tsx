import type { Metadata } from "next";
import { PageIntro } from "@/components/pages/PageIntro";
import { siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for jatayuhealth.com and VoiceDocAI marketing properties.",
  alternates: { canonical: `${siteMeta.domain}/privacy` },
};

export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title="Privacy Policy (draft scaffold)"
        conciseAnswer="Replace with counsel-approved policy referencing DPDP Act 2023 obligations, processor vs controller roles, cookie inventory, and cross-border transfers if any."
      />
      <section className="container-page max-w-3xl pb-[var(--section-y)] text-sm text-slate">
        <p>CMS-managed legal copy pending.</p>
      </section>
    </>
  );
}
