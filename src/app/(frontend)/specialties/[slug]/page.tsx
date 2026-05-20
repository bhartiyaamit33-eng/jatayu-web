import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/pages/PageIntro";
import { Button } from "@/components/ui/Button";
import { getSiteMeta, getSpecialties, getSpecialtyBySlug } from "@/lib/cms";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const specialties = await getSpecialties();
    return specialties.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [spec, siteMeta] = await Promise.all([
    getSpecialtyBySlug(slug),
    getSiteMeta(),
  ]);
  if (!spec) return { title: "Specialty" };
  return {
    title: spec.title,
    description: spec.blurb,
    alternates: {
      canonical: `${siteMeta.domain}/specialties/${spec.slug}`,
    },
  };
}

export default async function SpecialtyPage({ params }: Props) {
  const { slug } = await params;
  const spec = await getSpecialtyBySlug(slug);
  if (!spec) {
    notFound();
  }

  return (
    <>
      <PageIntro
        eyebrow="Specialty"
        title={`VoiceDocAI for ${spec.title}`}
        conciseAnswer={`Template-driven drafts for ${spec.title.toLowerCase()} encounters. Pair this page in /admin with sample anonymised notes, related pilots, and tagged articles for SEO and AEO.`}
      />
      <section className="container-page py-[var(--section-y)] space-y-10">
        <div className="max-w-3xl space-y-4 text-base leading-relaxed text-navy/85">
          <p>{spec.blurb}</p>
          <p className="text-sm text-slate">
            Replace this scaffold with rich blocks from /admin: two-column layouts,
            calls to action, downloadable PDF samples, and embedded HowTo schema where
            appropriate.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button as="link" href="/case-studies" variant="primary" size="lg">
            Matching case studies
          </Button>
          <Button as="link" href="/blog" variant="secondary" size="lg">
            Related articles
          </Button>
        </div>
      </section>
    </>
  );
}
