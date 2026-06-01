import Image from "next/image";
import Link from "next/link";
import {
  getAudienceSplit,
  getAwards,
  getComplianceBand,
  getDeploymentModes,
  getFaqs,
  getFeaturedSpecialties,
  getFounderNote,
  getHomeHero,
  getHomeMetrics,
  getHomepageConciseAnswer,
  getLogoWall,
  getSiteMeta,
  getTestimonials,
} from "@/lib/cms";
import { HeroVisual } from "@/components/home/HeroVisual";
import { FlowDiagram } from "@/components/home/FlowDiagram";
import { PARTNER_SECTIONS, PartnerSection } from "@/components/home/PartnerWalls";
import { AudienceCards } from "@/components/home/AudienceCards";
import { Reveal } from "@/components/home/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";

export async function HomeSections() {
  const [
    siteMeta,
    homeHero,
    homeMetrics,
    audienceSplit,
    homepageConcise,
    faqs,
    featuredSpecialties,
    testimonials,
    deploymentModes,
    complianceBand,
    founderNote,
    awards,
    logoWall,
  ] = await Promise.all([
    getSiteMeta(),
    getHomeHero(),
    getHomeMetrics(),
    getAudienceSplit(),
    getHomepageConciseAnswer(),
    getFaqs(),
    getFeaturedSpecialties(),
    getTestimonials(),
    getDeploymentModes(),
    getComplianceBand(),
    getFounderNote(),
    getAwards(),
    getLogoWall(),
  ]);

  // Match a hardcoded partner name against CMS-uploaded logos using a
  // case-insensitive prefix match — handles "BIRAC" ↔ "BIRAC, Department of
  // Biotechnology, Govt of India" without forcing exact-name parity between
  // PartnerWalls' editorial labels and the CMS logo wall entries.
  const cmsLogoFor = (partnerName: string): string | null => {
    const needle = partnerName.toLowerCase().trim();
    const hit = logoWall.logos.find((l) => {
      if (!l.imageUrl) return false;
      const hay = l.name.toLowerCase().trim();
      return hay === needle || hay.startsWith(needle);
    });
    return hit?.imageUrl ?? null;
  };

  const enrichSection = <T extends { partners: Array<{ name: string }> }>(
    section: T,
  ): T => ({
    ...section,
    partners: section.partners.map((p) => ({
      ...p,
      imageUrl: cmsLogoFor(p.name),
    })),
  });

  const supportersSection = enrichSection(PARTNER_SECTIONS.SUPPORTERS);
  const hospitalSection = enrichSection(PARTNER_SECTIONS.HOSPITAL_PARTNERS);
  const ehrSection = enrichSection(PARTNER_SECTIONS.EHR_PARTNERS);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteMeta.productName,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web, Desktop, Mobile",
    description: siteMeta.defaultDescription,
    publisher: { "@type": "Organization", name: siteMeta.legalName, url: siteMeta.domain },
  };

  const metrics = (homeMetrics ?? []) as Array<{
    key: string; value: string; label: string; sourceRef: string;
  }>;

  return (
    <>
      <JsonLd data={faqLd} />
      <JsonLd data={softwareLd} />

      {/* ---------- HERO ----------
       *
       * Two-column layout (Nov 2025 redesign):
       *   - LEFT  → badge, headline, subheadline, CTAs, trust line.
       *   - RIGHT → animated waveform + clinical-note console (HeroVisual).
       *
       * The old centered single column left huge empty bands on either side of
       * 1440px+ monitors. The product film was also removed from this section.
       */}
      <section className="relative overflow-hidden border-b border-indigo/10 bg-grad-hero pb-16 pt-24 md:pb-20 md:pt-28">
        {/* Decorative gradient blobs (purely visual, not in the document outline). */}
        <div className="pointer-events-none absolute -left-24 top-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(52,86,164,0.12)_0%,transparent_70%)] motion-reduce:hidden" aria-hidden />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(124,68,129,0.1)_0%,transparent_70%)] motion-reduce:hidden" aria-hidden />

        <div className="container-page grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          {/* LEFT — copy block */}
          <div className="min-w-0 text-center lg:text-left">
            <div className="mb-5 flex items-center justify-center gap-3 lg:justify-start">
              <Logo
                size={48}
                decorative
                src={siteMeta.logoUrl}
                alt={siteMeta.logoAlt}
                className="rounded-full bg-white p-1 shadow-sm"
              />
              <span className="font-display text-sm font-semibold text-indigo">
                Jatayu Healthcare
              </span>
            </div>

            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo/15 bg-white px-4 py-1.5 text-xs font-medium text-navy shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
              {homeHero.badge}
            </p>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-navy md:text-5xl xl:text-[3.75rem] text-balance">
              {(() => {
                // Headline is split on the first ". " so the second sentence
                // can render with the brand gradient — keeps editors free to
                // write naturally in the CMS without inline HTML.
                const parts = homeHero.headline.split(". ");
                if (parts.length < 2) return homeHero.headline;
                const [first, ...rest] = parts;
                return (
                  <>
                    {first}.
                    <br />
                    <span className="bg-grad-accent bg-clip-text text-transparent">
                      {rest.join(". ").trim()}
                    </span>
                  </>
                );
              })()}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate lg:max-w-none">
              {homeHero.subheadline}
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3.5 lg:justify-start">
              <Button as="link" href={homeHero.primaryCta.href} variant="primary" size="lg">
                {homeHero.primaryCta.label}
              </Button>
              <Button as="link" href={homeHero.secondaryCta.href} variant="secondary" size="lg">
                {homeHero.secondaryCta.label}
              </Button>
            </div>

            <p className="mt-7 max-w-xl text-sm font-medium text-navy/80 lg:max-w-none">
              {homeHero.trustLine}
            </p>
          </div>

          {/* RIGHT — animated console (waveform + clinical note) */}
          <div className="relative min-w-0">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ---------- SUPPORTER STRIP (per brief §5.3) ---------- */}
      <section className="border-b border-indigo/10 bg-white py-14 md:py-16" aria-labelledby="supporters-heading">
        <div className="container-page">
          <h2 id="supporters-heading" className="sr-only">Supporters</h2>
          <PartnerSection section={supportersSection} columns={3} />
        </div>
      </section>

      {/* ---------- AUDIENCE SPLITTER ---------- */}
      <section className="border-y border-[#eaecf5] bg-white py-12 md:py-16" aria-labelledby="audience-split-heading">
        <div className="container-page">
          <h2 id="audience-split-heading" className="sr-only">Choose your path</h2>
          <AudienceCards audienceSplit={audienceSplit} />
        </div>
      </section>

      {/* ---------- METRICS ---------- */}
      <section className="bg-white pb-12 md:pb-16" aria-labelledby="metrics-heading">
        <div className="container-page">
          <h2 id="metrics-heading" className="sr-only">Key outcomes</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {metrics.map((m) => (
              <div key={m.key} className="text-center lg:border-r lg:border-[#eaecf5] lg:px-3 lg:last:border-r-0" title={`Source: ${m.sourceRef}`}>
                <p className="font-display text-3xl font-extrabold tracking-tight bg-grad-accent bg-clip-text text-transparent md:text-4xl">
                  {m.value}
                </p>
                <p className="mt-1 text-sm font-medium text-navy/80">{m.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-slate">
            All metrics are sourced and reviewed.{" "}
            <Link href="/about/facts" className="font-semibold text-indigo hover:underline">See the citations</Link>.
          </p>
        </div>
      </section>

      {/* ---------- CONCISE ANSWER (AEO) ----------
       *
       * Two-column magazine layout: eyebrow + headline on the left, body
       * paragraph on the right. Replaces the narrow centered text block that
       * used to leave big empty bands on either side at the new 1440 width.
       */}
      <section className="bg-canvas py-[var(--section-y)]" aria-labelledby="answer-heading">
        <div className="container-page grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
              {homepageConcise.label}
            </p>
            <h2
              id="answer-heading"
              className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl"
            >
              VoiceDocAI in plain language
            </h2>
          </div>
          <p className="text-base leading-relaxed text-navy/85 lg:text-lg">
            {homepageConcise.body}
          </p>
        </div>
      </section>

      {/* ---------- HOSPITAL + EHR PARTNER WALLS ---------- */}
      <section className="bg-white py-[var(--section-y)]" aria-labelledby="logos-heading">
        <div className="container-page space-y-16">
          <h2 id="logos-heading" className="sr-only">Hospital and HMIS partners</h2>
          <PartnerSection section={hospitalSection} columns={3} />
          <PartnerSection section={ehrSection} columns={4} />
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="border-t border-indigo/10 bg-canvas py-[var(--section-y)]" id="how-it-works">
        <div className="container-page">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">How it works</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              From conversation to verified note
            </h2>
            <p className="mt-4 text-slate">
              Conversation captured. Multilingual speech filtered for real-world noise. Sections structured for the report you need. You verify before anything is filed.
            </p>
          </div>

          <div className="mt-12">
            <FlowDiagram />
          </div>
        </div>
      </section>

      {/* ---------- SPECIALTIES ---------- */}
      <section className="bg-white py-[var(--section-y)]" aria-labelledby="specialties-heading">
        <div className="container-page">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">Inside the Medical use case</p>
            <h2 id="specialties-heading" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              20+ clinical specialties, ready to use
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredSpecialties.map((s) => (
              <Link
                key={s.slug}
                href={`/specialties/${s.slug}`}
                className="group rounded-2xl border border-indigo/10 bg-canvas p-6 shadow-card transition-transform duration-200 ease-clinical hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2"
              >
                <h3 className="font-display text-lg font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm text-slate">{s.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-magenta group-hover:text-purple">
                  Open {s.title.toLowerCase()}
                  <span aria-hidden>→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section className="bg-gradient-to-b from-white to-pale-blue py-[var(--section-y)]" aria-labelledby="testimonials-heading">
        <div className="container-page">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">Evidence from real deployments</p>
            <h2 id="testimonials-heading" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              Feedback we can stand behind
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-navy/80">
              Named testimonials and video reels ship only with signed releases. Until then this section stays factual.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <figure key={t.attribution} className="rounded-[18px] border border-indigo/10 bg-white p-7 shadow-card">
                <span className="font-display text-5xl leading-none text-lavender" aria-hidden>&ldquo;</span>
                <blockquote className="-mt-3 text-base leading-relaxed text-navy/85">{t.quote}</blockquote>
                <figcaption className="mt-6 text-sm font-bold text-navy">{t.attribution}</figcaption>
                {t.role ? <p className="mt-1 text-xs text-slate">{t.role}</p> : null}
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- DEPLOYMENT MODES ---------- */}
      <section className="bg-canvas py-[var(--section-y)]" aria-labelledby="deploy-heading">
        <div className="container-page">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">Modes of deployment</p>
            <h2 id="deploy-heading" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              Meet hospitals where they operate
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(deploymentModes ?? []).map((d: { title: string; body: string }) => (
              <div key={d.title} className="rounded-2xl border border-indigo/10 bg-white p-6 shadow-card">
                <h3 className="font-display text-lg font-bold text-navy">{d.title}</h3>
                <p className="mt-2 text-sm text-slate">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- COMPLIANCE BAND ---------- */}
      <section className="border-y border-indigo/10 bg-pale-blue py-[var(--section-y)]">
        <div className="container-page">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">Compliance and trust</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              Procurement-ready posture
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-navy/85">
              Each statement links to the Security &amp; Compliance page. Language stays legally precise: HIPAA-aligned, not HIPAA-certified.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {(complianceBand ?? []).map((c: { title: string; body: string; href: string }) => (
              <Link
                key={c.title}
                href={c.href}
                className="rounded-2xl border border-indigo/15 bg-white p-6 text-center shadow-card transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2"
              >
                <h3 className="font-display text-base font-bold text-navy">{c.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-navy/75">{c.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FOUNDER NOTE ---------- */}
      <section className="bg-white py-[var(--section-y)]">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            {founderNote.portraitUrl ? (
              <Image
                src={founderNote.portraitUrl}
                alt={founderNote.portraitAlt}
                width={900}
                height={1200}
                sizes="(min-width: 1024px) 480px, 100vw"
                className="aspect-[4/5] w-full rounded-2xl object-cover shadow-card"
              />
            ) : (
              <div className="aspect-[4/5] w-full rounded-2xl bg-gradient-to-br from-indigo/15 via-purple/10 to-magenta/15 ring-1 ring-indigo/10" aria-hidden />
            )}
            {/* Caption rendered only when a portrait is uploaded — otherwise
                the placeholder gradient stands on its own. */}
            {founderNote.portraitUrl ? (
              <p className="mt-3 text-xs text-slate">
                {founderNote.name} · {founderNote.role}
              </p>
            ) : null}
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">Founder note</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              {founderNote.name}
            </h2>
            <p className="mt-1 text-sm text-slate">{founderNote.role}</p>
            <p className="mt-6 text-lg leading-relaxed text-navy">&ldquo;{founderNote.quote}&rdquo;</p>
            <Button as="link" href={founderNote.aboutHref} variant="link" size="md" className="mt-6">
              Read our story →
            </Button>
          </div>
        </div>
      </section>

      {/* ---------- AWARDS ---------- */}
      <section className="border-t border-indigo/10 bg-canvas py-[var(--section-y)]">
        <div className="container-page">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">Awards and recognition</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              Incubation and ecosystem partners
            </h2>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {awards.map((a) => (
              <li
                key={a.id}
                className="overflow-hidden rounded-2xl border border-indigo/10 bg-white shadow-card transition-transform duration-200 ease-clinical hover:-translate-y-1"
              >
                {a.imageUrl ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-pale-blue">
                    <Image
                      src={a.imageUrl}
                      alt={a.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 320px, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] w-full bg-gradient-to-br from-indigo/10 via-purple/8 to-magenta/10" aria-hidden />
                )}
                <div className="p-5">
                  <h3 className="font-display text-sm font-bold text-navy">{a.name}</h3>
                  {a.detail ? <p className="mt-2 text-xs leading-relaxed text-slate">{a.detail}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- FAQ ----------
       *
       * Two-column layout: sticky heading on the left, accordion on the right.
       * The sticky heading keeps the section identity visible while the user
       * scrolls through long answers.
       */}
      <section className="bg-white py-[var(--section-y)]" aria-labelledby="faq-heading">
        <div className="container-page grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">FAQ</p>
            <h2
              id="faq-heading"
              className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy md:text-4xl"
            >
              Answers procurement teams ask first
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate">
              Quick reference for buyers, integrators, and clinical reviewers.
              Click any question to expand.
            </p>
          </div>

          <div className="divide-y divide-indigo/10 rounded-2xl border border-indigo/10 bg-canvas">
            {faqs.map((f) => (
              <details key={f.question} className="group px-5 py-4">
                <summary className="cursor-pointer list-none font-display text-base font-semibold text-navy [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {f.question}
                    <span
                      className="text-magenta transition-transform group-open:rotate-45"
                      aria-hidden
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-navy/80">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section className="relative overflow-hidden bg-grad-cta px-6 py-24 text-center md:px-12">
        <div className="relative z-[2] mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white md:text-5xl text-balance">
            Start your 7-day trial or book a walkthrough
          </h2>
          <p className="mt-4 text-lg text-white/75">
            Hands-free capture, multilingual clinics, HMIS-ready outputs. Confirm trial mechanics with our team before publishing deadlines.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3.5">
            <Button as="link" href="/trial" variant="primary" size="lg">
              Start your 7-day free trial
            </Button>
            <Button as="link" href="/contact" variant="ghost" size="lg">
              Book a 20-minute walkthrough
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
