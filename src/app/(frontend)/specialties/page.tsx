import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/pages/PageIntro";
import { getSiteMeta, getSpecialties } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const siteMeta = await getSiteMeta();
  return {
    title: "Specialties",
    description:
      "VoiceDocAI specialty templates: radiology, gastroenterology, dermatology, paediatrics, orthopaedics, OT notes, discharge summaries, and more.",
    alternates: { canonical: `${siteMeta.domain}/specialties` },
  };
}

export default async function SpecialtiesIndexPage() {
  const specialties = await getSpecialties();

  return (
    <>
      <PageIntro
        eyebrow="Clinical breadth"
        title="Specialty templates spanning 20+ medical disciplines"
        conciseAnswer="Each specialty page deep-links to anonymised sample outputs, matching case studies, and tagged blog posts. The grid below is managed entirely in /admin."
      />
      <section className="container-page py-[var(--section-y)]">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {specialties.map((s) => (
            <Link
              key={s.slug}
              href={`/specialties/${s.slug}`}
              className="rounded-2xl border border-indigo/10 bg-white p-6 shadow-card transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2"
            >
              <h2 className="font-display text-lg font-bold text-navy">{s.title}</h2>
              <p className="mt-2 text-sm text-slate">{s.blurb}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
