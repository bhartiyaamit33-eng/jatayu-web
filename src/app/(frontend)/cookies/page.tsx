import type { Metadata } from "next";
import { PageIntro } from "@/components/pages/PageIntro";
import { siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie policy for jatayuhealth.com. We favour self-hosted analytics over third-party trackers.",
  alternates: { canonical: `${siteMeta.domain}/cookies` },
};

export default function CookiesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title="Cookie Policy (draft scaffold)"
        conciseAnswer="Document essential cookies, analytics (Plausible/Umami self-hosted), trial login cookies, and consent banners aligned with DPDP expectations."
      />
      <section className="container-page max-w-3xl pb-[var(--section-y)] text-sm text-slate">
        <p>CMS-managed legal copy pending.</p>
      </section>
    </>
  );
}
