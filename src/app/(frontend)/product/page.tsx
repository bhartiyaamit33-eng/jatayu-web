/**
 * /product — index page listing every product in the Jatayu line.
 *
 * Reads two CMS sources:
 *   1. `products-page` global  → page header + SEO.
 *   2. `products` collection  → one card per row.
 *
 * Editors:
 *   - To edit the page header copy, open **Globals → Page — Products (index)**.
 *   - To add a new product, open **Collections → Products** and click *Create*.
 *     A detail page is published automatically at /product/<slug>.
 */
import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/pages/PageIntro";
import { Button } from "@/components/ui/Button";
import { getProducts, getProductsPage, getSiteMeta } from "@/lib/cms";

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------
export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([getProductsPage(), getSiteMeta()]);
  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { canonical: `${site.domain}/product` },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function ProductsIndexPage() {
  const [page, products] = await Promise.all([getProductsPage(), getProducts()]);

  return (
    <>
      <PageIntro eyebrow={page.eyebrow} title={page.title} conciseAnswer={page.conciseAnswer} />

      <section className="container-page py-[var(--section-y)] space-y-12">
        {/* Optional intro paragraphs above the cards. */}
        {page.introParagraphs.length > 0 && (
          <div className="max-w-3xl space-y-5 text-base leading-relaxed text-navy/85">
            {page.introParagraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        )}

        {/* Product cards — one per row in the CMS collection. */}
        <div className="grid gap-6 md:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        {/* Global page CTAs. Individual products carry their own CTAs on the detail page. */}
        <div className="flex flex-wrap gap-4">
          <Button as="link" href="/trial" variant="primary" size="lg">
            Start 7-day trial
          </Button>
          <Button as="link" href="/contact" variant="secondary" size="lg">
            Talk to our team
          </Button>
        </div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// ProductCard — used only by this page, kept inline for readability.
// ---------------------------------------------------------------------------
type ProductCardProps = {
  product: Awaited<ReturnType<typeof getProducts>>[number];
};

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group rounded-2xl border border-indigo/10 bg-white p-7 shadow-card transition hover:border-indigo/30 hover:shadow-lg"
    >
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-indigo">
        {product.eyebrow}
      </p>
      <h2 className="mt-2 font-display text-xl font-bold text-navy">{product.name}</h2>
      <p className="mt-2 text-sm font-medium text-navy/80">{product.tagline}</p>
      <p className="mt-4 text-sm leading-relaxed text-slate">{product.conciseAnswer}</p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-magenta transition group-hover:gap-2">
        Explore product
        <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
