import type { CollectionConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";

/**
 * Products
 * --------
 * One row per product in the Jatayu portfolio.
 *
 * Today there is one product (VoiceDocAI). When a second product launches,
 * the editor just adds a new row here — no code changes, no redeploy.
 *
 * Each row carries every field needed to render BOTH:
 *   - the small card shown on the /product index page, AND
 *   - the full /product/[slug] detail page (hero + intro + deployment modes + CTAs).
 *
 * Sorting:
 *   - `order` controls position on the index page (lower = earlier).
 *   - `featuredOnHome` flags products that should surface elsewhere
 *      (we don't use it yet, but adding it now keeps future work cheap).
 */
export const Products: CollectionConfig = {
  slug: "products",

  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "tagline", "order"],
    description:
      "Each row is one product. Add a new row to publish a new product page at /product/<slug>.",
  },

  access: { read: () => true },

  // Whenever an editor saves or deletes a product, blow away the Next.js cache
  // for any page that reads from this collection.
  hooks: {
    afterChange: [revalidateCmsTag],
    afterDelete: [revalidateCmsTag],
  },

  fields: [
    // ------------------------------------------------------------------
    // Identity
    // ------------------------------------------------------------------
    {
      name: "name",
      type: "text",
      required: true,
      admin: { description: "Product name as shown on cards and detail page (e.g. 'VoiceDocAI')." },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "URL fragment, lowercase, no spaces. The detail page lives at /product/<slug>." },
    },
    {
      name: "eyebrow",
      type: "text",
      required: true,
      admin: { description: "Small uppercase label above the page title (e.g. 'Flagship product')." },
    },
    {
      name: "tagline",
      type: "text",
      required: true,
      admin: { description: "One-line product promise. Used as the H1 on the detail page." },
    },
    {
      name: "conciseAnswer",
      type: "textarea",
      required: true,
      admin: {
        description:
          "40-60 word AEO answer block. Shown right under the H1 on the detail page and in the listing card.",
      },
    },

    // ------------------------------------------------------------------
    // Body content
    // ------------------------------------------------------------------
    {
      name: "introParagraphs",
      type: "array",
      labels: { singular: "Paragraph", plural: "Paragraphs" },
      admin: { description: "Free-form intro text. Each row renders as one <p>." },
      fields: [{ name: "text", type: "textarea", required: true }],
    },
    {
      name: "deploymentModes",
      type: "array",
      labels: { singular: "Deployment mode", plural: "Deployment modes" },
      admin: {
        description:
          "Cards under the intro. Use this for delivery surfaces (Web, Desktop, Mobile, On-prem, API).",
      },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
      ],
    },
    {
      name: "showPatientConsent",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Show the shared 'Patient consent' block on this product's detail page." },
    },

    // ------------------------------------------------------------------
    // Calls to action (bottom of detail page)
    // ------------------------------------------------------------------
    {
      name: "primaryCta",
      type: "group",
      admin: { description: "The main button at the bottom of the page." },
      fields: [
        { name: "label", type: "text", required: true, defaultValue: "Start 7-day trial" },
        { name: "href", type: "text", required: true, defaultValue: "/trial" },
      ],
    },
    {
      name: "secondaryCta",
      type: "group",
      admin: { description: "The secondary (outline) button next to the primary CTA." },
      fields: [
        { name: "label", type: "text", required: true, defaultValue: "Talk to our team" },
        { name: "href", type: "text", required: true, defaultValue: "/contact" },
      ],
    },

    // ------------------------------------------------------------------
    // Ordering and SEO
    // ------------------------------------------------------------------
    {
      name: "order",
      type: "number",
      defaultValue: 100,
      admin: { description: "Lower number = appears earlier on the /product listing page." },
    },
    {
      name: "featuredOnHome",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Reserved — surface this product on the homepage when we add that block." },
    },
    {
      name: "seo",
      type: "group",
      admin: { description: "Search-engine / social-share metadata for /product/<slug>." },
      fields: [
        {
          name: "title",
          type: "text",
          admin: { description: "Overrides the default <title>. Leave blank to use the product name." },
        },
        {
          name: "description",
          type: "textarea",
          admin: { description: "Meta description (~155 chars). Leave blank to fall back to the concise answer." },
        },
      ],
    },
  ],
};
