import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/content/blog-posts";
import { siteMeta } from "@/content/site-config";
import { JsonLd } from "@/components/seo/JsonLd";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = blogPosts.find((p) => p.slug === params.slug);
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
      publishedTime: post.publishedAt,
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);
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
          <p className="mt-6 font-mono text-sm text-slate">
            {post.readMinutes} min read · Published {post.publishedAt}
          </p>
          <div className="mt-10 max-w-none space-y-4">
            <p className="text-lg leading-relaxed text-navy">{post.excerpt}</p>
            <p className="text-sm leading-relaxed text-slate">
              Replace this scaffold with the TipTap/Lexical renderer fed by CMS blocks—supporting inline images, callouts, embeds, and drag-reordered sections exactly as described in the editorial brief.
            </p>
          </div>
          <Link href="/blog" className="mt-12 inline-flex text-sm font-semibold text-magenta">
            ← Back to insights
          </Link>
        </div>
      </article>
    </>
  );
}
