import type { MetadataRoute } from "next";
import { getCaseStudies, getPosts, getSiteMeta, getSpecialties } from "@/lib/cms";

// Needs runtime DB access for slug enumeration. Skip build-time prerender.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [siteMeta, specialties, studies, posts] = await Promise.all([
    getSiteMeta(),
    getSpecialties(),
    getCaseStudies(),
    getPosts(),
  ]);

  const lastModified = new Date();

  const staticPaths = [
    "",
    "/product",
    "/for-doctors",
    "/for-hospitals-and-hmis",
    "/specialties",
    "/case-studies",
    "/pricing",
    "/blog",
    "/about",
    "/about/facts",
    "/security",
    "/contact",
    "/trial",
    "/careers",
    "/press",
    "/privacy",
    "/terms",
    "/cookies",
    "/sitemap-page",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${siteMeta.domain}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  specialties.forEach((s) => {
    entries.push({
      url: `${siteMeta.domain}/specialties/${s.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  });

  studies.forEach((c) => {
    entries.push({
      url: `${siteMeta.domain}/case-studies/${c.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.65,
    });
  });

  posts.forEach((p) => {
    entries.push({
      url: `${siteMeta.domain}/blog/${p.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.55,
    });
  });

  return entries;
}
