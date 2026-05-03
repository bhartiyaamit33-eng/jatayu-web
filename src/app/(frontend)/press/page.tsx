import type { Metadata } from "next";
import { PageIntro } from "@/components/pages/PageIntro";
import { awards, siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Press & Awards",
  description:
    "Press kit, awards, and recognition for Jatayu Healthcare Technologies and VoiceDocAI.",
  alternates: { canonical: `${siteMeta.domain}/press` },
};

export default function PressPage() {
  return (
    <>
      <PageIntro
        eyebrow="Press"
        title="Recognition, incubation milestones, media inquiries"
        conciseAnswer="Centralise awards, logos, boilerplate, leadership bios, and download-approved imagery. Journalists should cite metrics only from the sourced facts page."
      />
      <section className="container-page pb-[var(--section-y)]">
        <ul className="grid gap-4 md:grid-cols-2">
          {awards.map((a) => (
            <li
              key={a.name}
              className="rounded-2xl border border-indigo/10 bg-white p-6 text-sm font-semibold text-navy shadow-card"
            >
              {a.name}
              {a.detail ? (
                <p className="mt-2 text-xs font-normal text-slate">{a.detail}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
