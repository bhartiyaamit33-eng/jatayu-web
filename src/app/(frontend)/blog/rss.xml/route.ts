import { getPosts, getSiteMeta } from "@/lib/cms";

export async function GET() {
  const [posts, siteMeta] = await Promise.all([getPosts(), getSiteMeta()]);

  const items = posts
    .map(
      (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${siteMeta.domain}/blog/${p.slug}</link>
      <guid>${siteMeta.domain}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.publishedAt as string).toUTCString()}</pubDate>
      <description><![CDATA[${p.excerpt}]]></description>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${siteMeta.productName} Blog</title>
    <link>${siteMeta.domain}/blog</link>
    <description>${siteMeta.defaultDescription}</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
