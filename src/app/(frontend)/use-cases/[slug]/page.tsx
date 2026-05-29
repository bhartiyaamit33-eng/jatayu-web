/**
 * /use-cases/[slug] — detail page for one vertical (Medical, Market Research, …).
 *
 * Pulls from the `use-cases` collection. Editors add a row and the page is live.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageIntro } from "@/components/pages/PageIntro";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteMeta, getUseCaseBySlug, getUseCases } from "@/lib/cms";

type RouteProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const cases = await getUseCases();
    return cases.map((c) => ({ slug: c.slug }));
  } catch {
    // Build-time DB unreachable → empty list, every request renders on demand.
    return [];
  }
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const [useCase, site] = await Promise.all([getUseCaseBySlug(slug), getSiteMeta()]);
  if (!useCase) return { title: "Use case not found" };
  return {
    title: useCase.seo.title ?? useCase.name,
    description: useCase.seo.description ?? useCase.shortPitch,
    alternates: { canonical: `${site.domain}/use-cases/${useCase.slug}` },
  };
}

export default async function UseCaseDetailPage({ params }: RouteProps) {
  const { slug } = await params;
  const useCase = await getUseCaseBySlug(slug);
  if (!useCase) notFound();

  // schema.org Service node — helps search engines see this as a vertical offering.
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: useCase.name,
    description: useCase.shortPitch,
    serviceType: useCase.tagline,
    provider: { "@type": "Organization", name: "Jatayu Healthcare Technologies" },
  };

  return (
    <>
      <JsonLd data={serviceLd} />

      <PageIntro eyebrow={useCase.eyebrow} title={useCase.tagline} conciseAnswer={useCase.shortPitch} />

      <section className="container-page py-[var(--section-y)] space-y-16">
        {useCase.introParagraphs.length > 0 && (
          <div className="max-w-3xl space-y-5 text-base leading-relaxed text-navy/85">
            {useCase.introParagraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        )}

        {/* Content sections — each row of the CMS `sections` array becomes one block */}
        {useCase.sections.length > 0 && (
          <div className="space-y-12">
            {useCase.sections.map((section, idx) => (
              <article
                key={idx}
                className="rounded-2xl border border-indigo/10 bg-white p-7 shadow-card md:p-9"
              >
                {section.eyebrow && (
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
                    {section.eyebrow}
                  </p>
                )}
                <h2 className="mt-2 font-display text-2xl font-bold text-navy md:text-3xl">
                  {section.heading}
                </h2>
                {section.body && (
                  <p className="mt-4 max-w-3xl text-base leading-relaxed text-navy/85">
                    {section.body}
                  </p>
                )}
                {section.bullets.length > 0 && (
                  <ul className="mt-6 space-y-3">
                    {section.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-navy/85">
                        <span
                          className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-magenta"
                          aria-hidden
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          <Button as="link" href={useCase.primaryCta.href} variant="primary" size="lg">
            {useCase.primaryCta.label}
          </Button>
          <Button as="link" href={useCase.secondaryCta.href} variant="secondary" size="lg">
            {useCase.secondaryCta.label}
          </Button>
        </div>
      </section>
    </>
  );
}
