/**
 * Branded partner cards. Renders an uploaded logo (via CMS → Globals → Logo
 * Wall) when one matches the partner by name; falls back to a category-
 * coloured monogram glyph otherwise.
 */
import Image from "next/image";
import { type ReactNode } from "react";
import { Reveal } from "@/components/home/Reveal";

type Partner = {
  name: string;
  detail?: string;
  /** override the auto-generated glyph */
  monogram?: string;
  /** CMS-supplied logo URL. When set, shown instead of the monogram. */
  imageUrl?: string | null;
};

type Section = {
  eyebrow: string;
  title: string;
  description?: string;
  category: "hospital" | "ehr" | "supporter";
  partners: Partner[];
};

const HOSPITAL_PARTNERS: Section = {
  eyebrow: "Hospital customers",
  title: "Trusted in real OPDs, wards, and radiology departments",
  description: "Live in multi-specialty hospitals, cancer centres, ICUs, and dispensaries. Logos shown with written consent on file.",
  category: "hospital",
  partners: [
    { name: "Seth G.S. Medical College & KEM Hospital", detail: "Mumbai · Multi-department deployment" },
    { name: "MGM Medical College & Hospital", detail: "Kamothe · Validation letter on file" },
    { name: "ILBS", detail: "Delhi · 95 to 96% accuracy on 25 cases" },
    { name: "DY Patil Hospital", detail: "Navi Mumbai · Multi-specialty rollout" },
    { name: "Basavatarakam Indo-American Cancer Centre", detail: "Hyderabad · Cancer-care reports" },
    { name: "Souter Street Dispensary, BMC", detail: "~95% accuracy, ~60% time saved" },
  ],
};

const EHR_PARTNERS: Section = {
  eyebrow: "EHR & HMIS partners",
  title: "Integrated with the systems hospitals already run",
  description: "API integration, on-prem deployment, and HMIS empanelment. Reach across 1000+ hospitals.",
  category: "ehr",
  partners: [
    { name: "Akhil Systems Pvt. Ltd.", detail: "Healthcare IT integration partner" },
    { name: "Dataman Computer Systems", detail: "HMIS · empaneled with the National Cancer Grid" },
    { name: "Ohum Healthcare", detail: "Hospital information systems" },
    { name: "Jeena Sikho", detail: "Wellness and clinic network" },
  ],
};

const SUPPORTERS: Section = {
  eyebrow: "Supported by an ecosystem built in India",
  title: "Backed by India's innovation and research engine",
  description: "Grant programs, public-cloud credits, and academic equity. No paid SaaS subscriptions for the brand site.",
  category: "supporter",
  partners: [
    { name: "Google Cloud for Startups", detail: "Public-cloud partner program" },
    { name: "BIRAC", detail: "Dept. of Biotechnology, Govt. of India · BIG-19 grantee" },
    { name: "MeitY", detail: "Ministry of Electronics and IT · TIDE grantee" },
    { name: "SINE", detail: "Society for Innovation and Entrepreneurship, IIT Bombay" },
    { name: "IIT Bombay", detail: "Incubation and equity stakeholder" },
    { name: "IIT Kanpur", detail: "Equity stakeholder" },
  ],
};

/** Build a 2-letter monogram from the partner name (skip "the", "of", "&", etc.) */
function monogramFor(name: string, override?: string): string {
  if (override) return override.toUpperCase();
  const skip = new Set(["the", "of", "and", "&", "for"]);
  const words = name
    .replace(/[.,()]/g, "")
    .split(/\s+/)
    .filter((w) => !skip.has(w.toLowerCase()) && w.length > 0);
  const first = words[0]?.[0] ?? "";
  const second = words[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

const CATEGORY_STYLE: Record<Section["category"], {
  card: string;
  monogram: string;
  border: string;
  hoverBorder: string;
  accent: string;
}> = {
  hospital: {
    card: "bg-white",
    monogram: "bg-grad-accent text-white",
    border: "border-indigo/10",
    hoverBorder: "hover:border-indigo/35",
    accent: "from-indigo via-blue to-purple",
  },
  ehr: {
    card: "bg-white",
    monogram: "bg-gradient-to-br from-purple to-magenta text-white",
    border: "border-purple/15",
    hoverBorder: "hover:border-purple/40",
    accent: "from-purple via-magenta to-indigo",
  },
  supporter: {
    card: "bg-white",
    monogram: "bg-navy text-white",
    border: "border-indigo/8",
    hoverBorder: "hover:border-navy/30",
    accent: "from-navy via-indigo to-purple",
  },
};

function PartnerCard({
  partner,
  category,
}: {
  partner: Partner;
  category: Section["category"];
}) {
  const style = CATEGORY_STYLE[category];
  const monogram = monogramFor(partner.name, partner.monogram);
  return (
    <div
      className={`group relative flex h-full items-center gap-4 overflow-hidden rounded-2xl border ${style.border} ${style.hoverBorder} ${style.card} p-5 shadow-card transition-all duration-200 ease-clinical hover:-translate-y-0.5 hover:shadow-elevated`}
    >
      {/* left accent stripe, slides in on hover */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 left-0 w-1 origin-top scale-y-50 bg-gradient-to-b ${style.accent} opacity-60 transition-transform duration-300 ease-clinical group-hover:scale-y-100 group-hover:opacity-100`}
      />
      {partner.imageUrl ? (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 ring-1 ring-indigo/10">
          <Image
            src={partner.imageUrl}
            alt=""
            width={40}
            height={40}
            sizes="48px"
            className="h-full w-full object-contain"
            aria-hidden
          />
        </span>
      ) : (
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-display text-sm font-extrabold tracking-tight ${style.monogram}`}
          aria-hidden
        >
          {monogram}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate font-display text-sm font-bold text-navy">{partner.name}</p>
        {partner.detail ? (
          <p className="mt-0.5 text-[11px] leading-snug text-slate">{partner.detail}</p>
        ) : null}
      </div>
    </div>
  );
}

export function PartnerSection({ section, columns }: { section: Section; columns?: 2 | 3 | 4 }) {
  const cols = columns ?? 3;
  const colClass =
    cols === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : cols === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : "sm:grid-cols-2";
  return (
    <div className="text-center">
      <Reveal>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-magenta">
          {section.eyebrow}
        </p>
        <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-navy md:text-3xl">
          {section.title}
        </h3>
        {section.description ? (
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate">{section.description}</p>
        ) : null}
      </Reveal>
      <div className={`mt-9 grid gap-4 text-left ${colClass}`}>
        {section.partners.map((p, i) => (
          <Reveal key={p.name} delay={80 + i * 70}>
            <PartnerCard partner={p} category={section.category} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export const PARTNER_SECTIONS = { HOSPITAL_PARTNERS, EHR_PARTNERS, SUPPORTERS };
