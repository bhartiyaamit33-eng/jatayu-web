/**
 * /product/[slug] — detail page for one product.
 *
 * All copy comes from one row in the `products` collection. Editors add or
 * edit products in **Admin → Collections → Products**; nothing in this file
 * needs to change when a new product launches.
 *
 * The route renders 404 if the slug doesn't resolve to a product.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageIntro } from "@/components/pages/PageIntro";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { PatientConsentBlock } from "@/components/blocks/PatientConsentBlock";
import { getProductBySlug, getProducts, getSiteMeta } from "@/lib/cms";

type RouteProps = { params: Promise<{ slug: string }> };

// ---------------------------------------------------------------------------
// Static params — pre-render every known product at build time.
// ---------------------------------------------------------------------------
//
// The build inside the ACR container has no Postgres reachable, so this
// function falls back to an empty list when getProducts() throws. The parent
// layout sets `dynamic = "force-dynamic"` anyway, so missing static params
// just means every request renders on-demand — same as the homepage.
export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const [product, site] = await Promise.all([getProductBySlug(slug), getSiteMeta()]);
  if (!product) return { title: "Product not found" };
  return {
    title: product.seo.title ?? product.name,
    description: product.seo.description ?? product.conciseAnswer,
    alternates: { canonical: `${site.domain}/product/${product.slug}` },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function ProductDetailPage({ params }: RouteProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  // schema.org Product node — helps search engines understand the page.
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.conciseAnswer,
    brand: { "@type": "Brand", name: "Jatayu Healthcare" },
  };

  return (
    <>
      <JsonLd data={productLd} />

      <PageIntro
        eyebrow={product.eyebrow}
        title={product.tagline}
        conciseAnswer={product.conciseAnswer}
      />

      <section className="container-page py-[var(--section-y)] space-y-12">
        {/* Intro paragraphs */}
        {product.introParagraphs.length > 0 && (
          <div className="max-w-3xl space-y-5 text-base leading-relaxed text-navy/85">
            {product.introParagraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        )}

        {/* Deployment modes — surface where the product is available */}
        {product.deploymentModes.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {product.deploymentModes.map((mode) => (
              <div
                key={mode.title}
                className="rounded-2xl border border-indigo/10 bg-white p-6 shadow-card"
              >
                <h2 className="font-display text-lg font-bold text-navy">{mode.title}</h2>
                <p className="mt-2 text-sm text-slate">{mode.body}</p>
              </div>
            ))}
          </div>
        )}

        {/* Shared "patient consent" block — opt-in per product */}
        {product.showPatientConsent && <PatientConsentBlock />}

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <Button as="link" href={product.primaryCta.href} variant="primary" size="lg">
            {product.primaryCta.label}
          </Button>
          <Button as="link" href={product.secondaryCta.href} variant="secondary" size="lg">
            {product.secondaryCta.label}
          </Button>
        </div>
      </section>
    </>
  );
}
