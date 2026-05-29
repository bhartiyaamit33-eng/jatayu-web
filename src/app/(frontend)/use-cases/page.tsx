/**
 * /use-cases — index of every vertical we serve.
 *
 * Header chrome lives in the `use-cases-page` global. The card list comes
 * from the `use-cases` collection.
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageIntro } from "@/components/pages/PageIntro";
import { Button } from "@/components/ui/Button";
import { getSiteMeta, getUseCases, getUseCasesPage } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([getUseCasesPage(), getSiteMeta()]);
  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { canonical: `${site.domain}/use-cases` },
  };
}

export default async function UseCasesIndexPage() {
  const [page, cases] = await Promise.all([getUseCasesPage(), getUseCases()]);

  return (
    <>
      <PageIntro eyebrow={page.eyebrow} title={page.title} conciseAnswer={page.conciseAnswer} />

      <section className="container-page py-[var(--section-y)] space-y-12">
        {page.introParagraphs.length > 0 && (
          <div className="max-w-3xl space-y-5 text-base leading-relaxed text-navy/85">
            {page.introParagraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        )}

        <ul className="grid gap-6 md:grid-cols-2">
          {cases.map((useCase) => (
            <li key={useCase.slug}>
              <Link
                href={`/use-cases/${useCase.slug}`}
                className="group flex h-full flex-col gap-5 rounded-2xl border border-indigo/10 bg-white p-7 shadow-card transition hover:border-indigo/30 hover:shadow-lg"
              >
                {useCase.iconUrl ? (
                  <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-pale-blue">
                    <Image
                      src={useCase.iconUrl}
                      alt={useCase.iconAlt}
                      fill
                      sizes="56px"
                      className="object-contain p-2"
                    />
                  </div>
                ) : (
                  <div
                    aria-hidden
                    className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo/15 via-purple/10 to-magenta/15 font-display text-xl font-bold text-navy/40"
                  >
                    {useCase.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-indigo">
                    {useCase.eyebrow}
                  </p>
                  <h2 className="mt-2 font-display text-xl font-bold text-navy">{useCase.name}</h2>
                  <p className="mt-2 text-sm font-medium text-navy/80">{useCase.tagline}</p>
                </div>
                <p className="text-sm leading-relaxed text-slate">{useCase.shortPitch}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-magenta transition group-hover:gap-2">
                  Explore use case
                  <span aria-hidden>→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

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
