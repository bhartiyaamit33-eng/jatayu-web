import type { MetadataRoute } from "next";
import { siteMeta } from "@/content/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${siteMeta.domain}/sitemap.xml`,
    host: siteMeta.domain.replace(/^https?:\/\//, ""),
  };
}
