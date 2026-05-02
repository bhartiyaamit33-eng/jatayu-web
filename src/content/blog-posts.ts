export type BlogPostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readMinutes: number;
};

/** Placeholder posts — replace via CMS */
export const blogPosts: BlogPostSummary[] = [
  {
    slug: "voice-documentation-indian-opd",
    title: "What clinical teams should ask before adopting voice documentation",
    excerpt:
      "A physician-to-physician checklist covering verification, HMIS fit, and multilingual workflows.",
    category: "Clinical operations",
    publishedAt: "2026-04-12",
    readMinutes: 8,
  },
  {
    slug: "hmis-integration-checklist",
    title: "HMIS integration without re-keying: patterns that survive audits",
    excerpt:
      "How structured notes travel from capture to filing—with audit trails hospital IT teams expect.",
    category: "HMIS / EHR",
    publishedAt: "2026-03-28",
    readMinutes: 6,
  },
];
