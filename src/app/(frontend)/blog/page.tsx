import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/pages/PageIntro";
import { getPosts, getSiteMeta } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const siteMeta = await getSiteMeta();
  return {
    title: "Blog",
    description:
      "Long-form guidance for teams adopting VoiceDocAI — clinical workflows, qualitative research, integration patterns, and customer stories.",
    alternates: { canonical: `${siteMeta.domain}/blog` },
  };
}

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <>
      <PageIntro
        eyebrow="Insights"
        title="Practical writing for documentation and insight teams"
        conciseAnswer="Field-tested writing for clinicians, research teams, and integration partners. Subscribe to the RSS feed for new posts."
      />
      <section className="container-page py-[var(--section-y)]">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
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
                <p className="mt-4 text-xs text-slate">
                  {post.readTimeMinutes} min read ·{" "}
                  {String(post.publishedAt).slice(0, 10)}
                </p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-10 text-sm text-slate">
          Subscribe to the{" "}
          <Link href="/blog/rss.xml" className="font-semibold text-indigo hover:underline">
            RSS feed
          </Link>
          .
        </p>
      </section>
    </>
  );
}
