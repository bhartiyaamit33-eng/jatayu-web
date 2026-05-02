import type { MetadataRoute } from "next";
import { blogPosts } from "@/content/blog-posts";
import { caseStudiesIndex, specialtiesFeatured, siteMeta } from "@/content/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
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

  specialtiesFeatured.forEach((s) => {
    entries.push({
      url: `${siteMeta.domain}/specialties/${s.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  });

  caseStudiesIndex.forEach((c) => {
    entries.push({
      url: `${siteMeta.domain}/case-studies/${c.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.65,
    });
  });

  blogPosts.forEach((p) => {
    entries.push({
      url: `${siteMeta.domain}/blog/${p.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.55,
    });
  });

  return entries;
}
