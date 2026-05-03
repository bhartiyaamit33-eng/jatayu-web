import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/content/blog-posts";
import {
  caseStudiesIndex,
  navigationMain,
  siteMeta,
  specialtiesFeatured,
} from "@/content/site-config";

export const metadata: Metadata = {
  title: "HTML Sitemap",
  description: "Human-readable sitemap for VoiceDocAI marketing pages.",
  alternates: { canonical: `${siteMeta.domain}/sitemap-page` },
};

const extras = [
  { href: "/about/facts", label: "About: sourced facts" },
  { href: "/careers", label: "Careers" },
  { href: "/press", label: "Press / Awards" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/trial", label: "Trial signup" },
];

export default function HtmlSitemapPage() {
  return (
    <div className="border-b border-indigo/10 bg-white pb-[var(--section-y)] pt-28">
      <div className="container-page max-w-3xl">
        <h1 className="font-display text-4xl font-extrabold text-navy">Sitemap</h1>
        <p className="mt-4 text-sm text-slate">
          Machine-readable XML lives at{" "}
          <Link className="font-semibold text-indigo" href="/sitemap.xml">
            /sitemap.xml
          </Link>
          .
        </p>
        <h2 className="mt-10 font-display text-xl font-bold text-navy">
          Primary navigation
        </h2>
        <ul className="mt-4 space-y-2 text-sm">
          {navigationMain.map((item) => (
            <li key={item.href}>
              <Link className="text-indigo hover:underline" href={item.href}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <h2 className="mt-10 font-display text-xl font-bold text-navy">
          Collections
        </h2>
        <ul className="mt-4 space-y-2 text-sm">
          {specialtiesFeatured.map((s) => (
            <li key={s.slug}>
              <Link className="text-indigo hover:underline" href={`/specialties/${s.slug}`}>
                Specialty - {s.title}
              </Link>
            </li>
          ))}
          {caseStudiesIndex.map((c) => (
            <li key={c.slug}>
              <Link className="text-indigo hover:underline" href={`/case-studies/${c.slug}`}>
                Case study - {c.title}
              </Link>
            </li>
          ))}
          {blogPosts.map((p) => (
            <li key={p.slug}>
              <Link className="text-indigo hover:underline" href={`/blog/${p.slug}`}>
                Blog - {p.title}
              </Link>
            </li>
          ))}
        </ul>
        <h2 className="mt-10 font-display text-xl font-bold text-navy">Other</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {extras.map((e) => (
            <li key={e.href}>
              <Link className="text-indigo hover:underline" href={e.href}>
                {e.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
