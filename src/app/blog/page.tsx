import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/pages/PageIntro";
import { blogPosts } from "@/content/blog-posts";
import { siteMeta } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Long-form guidance for clinicians and hospital IT teams adopting VoiceDocAI—CMS-managed categories, tags, and RSS.",
  alternates: { canonical: `${siteMeta.domain}/blog` },
};

export default function BlogIndexPage() {
  return (
    <>
      <PageIntro
        eyebrow="Insights"
        title="Practical writing for Indian healthcare teams"
        conciseAnswer="Blog posts combine Quora-style rich layouts—pull quotes, inline imagery, embeds—with taxonomy managed in CMS. RSS lives at /blog/rss.xml once the feed route is wired to your production CMS query."
      />
      <section className="container-page py-[var(--section-y)]">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col rounded-2xl border border-indigo/10 bg-white shadow-card"
            >
              <div className="h-40 rounded-t-2xl bg-grad-accent opacity-90" />
              <div className="flex flex-1 flex-col p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-magenta">
                  {post.category}
                </p>
                <h2 className="mt-2 font-display text-lg font-bold text-navy">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="mt-3 flex-1 text-sm text-slate">{post.excerpt}</p>
                <p className="mt-4 font-mono text-xs text-slate">
                  {post.readMinutes} min read · {post.publishedAt}
                </p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-10 text-sm text-slate">
          RSS scaffold: add{" "}
          <Link href="/blog/rss.xml" className="font-semibold text-indigo">
            /blog/rss.xml
          </Link>{" "}
          via Route Handler querying CMS.
        </p>
      </section>
    </>
  );
}
