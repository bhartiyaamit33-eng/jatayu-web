import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageIntro } from "@/components/pages/PageIntro";
import {
  getAboutPage,
  getFounderNote,
  getSiteMeta,
  getTeamMembers,
} from "@/lib/cms";

/**
 * /about — CMS-driven.
 *
 * Reads three sources:
 *   1. `about-page` global       → header, narrative, team-section copy
 *   2. `team-members` collection → one card per person
 *   3. `founder-note` global     → founder quote sidebar (optional, toggled
 *                                  by the about-page global)
 *
 * Editors:
 *   - To add a team member: Admin → Collections → Team Members → Create.
 *     Upload a photo, fill name/role/description, save.
 *   - To edit the page header / intro / team-heading copy: Admin → Globals
 *     → Page — About.
 */
export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([getAboutPage(), getSiteMeta()]);
  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { canonical: `${site.domain}/about` },
  };
}

export default async function AboutPage() {
  const [page, team, founderNote] = await Promise.all([
    getAboutPage(),
    getTeamMembers(),
    getFounderNote(),
  ]);

  return (
    <>
      <PageIntro
        eyebrow={page.eyebrow}
        title={page.title}
        conciseAnswer={page.conciseAnswer}
      />

      <section className="container-page py-[var(--section-y)] space-y-16">
        {/* Body grid: narrative + team on the left, founder sidebar on the right */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          {/* LEFT — narrative + team grid */}
          <div className="space-y-12">
            {page.introParagraphs.length > 0 && (
              <div className="space-y-5 text-base leading-relaxed text-navy/85">
                {page.introParagraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            )}

            {/* Team section */}
            <div>
              <h2 className="font-display text-2xl font-bold text-navy md:text-3xl">
                {page.teamSectionHeading}
              </h2>
              {page.teamSectionSubhead && (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate">
                  {page.teamSectionSubhead}
                </p>
              )}

              <ul className="mt-8 grid gap-6 md:grid-cols-2">
                {team.map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </ul>
            </div>

            <Link
              href="/about/facts"
              className="inline-flex text-sm font-semibold text-magenta hover:underline"
            >
              View sourced facts for GEO →
            </Link>
          </div>

          {/* RIGHT — founder quote sidebar (toggleable) */}
          {page.showFounderQuote && (
            <aside className="rounded-2xl border border-indigo/15 bg-pale-blue p-8 shadow-card lg:sticky lg:top-28">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
                From the founder
              </p>
              <blockquote className="mt-4 font-display text-xl leading-snug text-navy">
                &ldquo;{founderNote.quote}&rdquo;
              </blockquote>
              <p className="mt-6 text-sm font-semibold text-navy">{founderNote.name}</p>
              <p className="text-xs text-slate">{founderNote.role}</p>
            </aside>
          )}
        </div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// TeamMemberCard
//
// Kept inline (vs. a separate file) because this page is the only consumer
// today. If a second surface needs it (e.g. a homepage team strip later),
// promote it to src/components/pages/.
// ---------------------------------------------------------------------------
type TeamMemberCardProps = {
  member: Awaited<ReturnType<typeof getTeamMembers>>[number];
};

function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <li className="overflow-hidden rounded-2xl border border-indigo/10 bg-white shadow-card transition-transform duration-200 ease-clinical hover:-translate-y-1">
      {member.photoUrl ? (
        <div className="relative aspect-square w-full overflow-hidden bg-pale-blue">
          <Image
            src={member.photoUrl}
            alt={member.photoAlt}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        // Placeholder when no portrait is uploaded yet. Soft gradient with the
        // person's initials, so the grid still reads cleanly.
        <div className="flex aspect-square w-full items-center justify-center bg-gradient-to-br from-indigo/15 via-purple/10 to-magenta/15">
          <span
            aria-hidden
            className="font-display text-4xl font-bold text-navy/30"
          >
            {member.name
              .split(/\s+/)
              .map((part) => part[0]?.toUpperCase() ?? "")
              .join("")
              .slice(0, 2)}
          </span>
        </div>
      )}

      <div className="p-6">
        <h3 className="font-display text-lg font-bold text-navy">{member.name}</h3>
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-indigo">
          {member.role}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate">
          {member.description}
        </p>
      </div>
    </li>
  );
}
