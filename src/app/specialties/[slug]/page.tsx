import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/pages/PageIntro";
import { specialtiesFeatured, siteMeta } from "@/content/site-config";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return specialtiesFeatured.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const spec = specialtiesFeatured.find((s) => s.slug === params.slug);
  if (!spec) {
    return { title: "Specialty" };
  }
  return {
    title: spec.title,
    description: spec.blurb,
    alternates: {
      canonical: `${siteMeta.domain}/specialties/${spec.slug}`,
    },
  };
}

export default function SpecialtyPage({ params }: Props) {
  const spec = specialtiesFeatured.find((s) => s.slug === params.slug);
  if (!spec) {
    notFound();
  }

  return (
    <>
      <PageIntro
        eyebrow="Specialty"
        title={`VoiceDocAI for ${spec.title}`}
        conciseAnswer={`Template-driven drafts for ${spec.title.toLowerCase()} encounters—pair this page in CMS with sample anonymised notes, related pilots, and tagged articles for SEO + GEO.`}
      />
      <section className="container-page py-[var(--section-y)] space-y-10">
        <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-slate">
          <p>{spec.blurb}</p>
          <p>
            Replace this scaffold with rich blocks from Payload/Strapi—two-column
            layouts, calls to action, downloadable PDF samples, and embedded{" "}
            <span className="font-mono text-xs text-indigo">HowTo</span> schema where appropriate.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/case-studies"
            className="rounded-xl bg-grad-accent px-6 py-3 font-display text-sm font-semibold text-white"
          >
            Matching case studies
          </Link>
          <Link
            href="/blog"
            className="rounded-xl border border-indigo/20 px-6 py-3 font-display text-sm font-semibold text-navy"
          >
            Related articles
          </Link>
        </div>
      </section>
    </>
  );
}
