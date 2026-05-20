import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPostBySlug, getPosts, getSiteMeta } from "@/lib/cms";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    // Build runs without DB access (CI / ACR build). Fall back to fully dynamic
    // rendering; pages still cache via Payload's unstable_cache at runtime.
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [post, siteMeta] = await Promise.all([
    getPostBySlug(slug),
    getSiteMeta(),
  ]);
  if (!post) return { title: "Blog post" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${siteMeta.domain}/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: String(post.publishedAt),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, siteMeta] = await Promise.all([
    getPostBySlug(slug),
    getSiteMeta(),
  ]);
  if (!post) {
    notFound();
  }

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: siteMeta.legalName,
    },
    publisher: {
      "@type": "Organization",
      name: siteMeta.legalName,
    },
  };

  return (
    <>
      <JsonLd data={articleLd} />
      <article className="border-b border-indigo/10 bg-white pb-[var(--section-y)] pt-28">
        <div className="container-page max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-magenta">
            {post.category}
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-navy md:text-5xl text-balance">
            {post.title}
          </h1>
          <p className="mt-6 text-sm text-slate">
            {post.readTimeMinutes} min read · Published{" "}
            {String(post.publishedAt).slice(0, 10)}
          </p>
          <div className="mt-10 max-w-none space-y-4">
            <p className="text-lg leading-relaxed text-navy">{post.excerpt}</p>
            <p className="text-sm leading-relaxed text-slate">
              Edit the full body in /admin under Posts. The Lexical rich-text editor
              supports inline images, callouts, embeds, and reorderable blocks.
            </p>
          </div>
          <Link
            href="/blog"
            className="mt-12 inline-flex text-sm font-semibold text-magenta hover:text-purple"
          >
            ← Back to insights
          </Link>
        </div>
      </article>
    </>
  );
}
