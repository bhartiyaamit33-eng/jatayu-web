import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";
import {
  blockEditorPublishGlobal,
  editorsUpdate,
  publishedOnlyForPublic,
} from "@/lib/access";

/**
 * ProductsPage
 * ------------
 * Top-of-page chrome for /product (the index that lists every product).
 *
 * The list of products itself comes from the `products` collection — this
 * global only owns the page header (eyebrow, title, intro copy) and the SEO
 * metadata for the index URL.
 *
 * Editors who just want to update copy at the top of /product never have to
 * touch a product row. Editors who want to add a new product just add a row
 * in the Products collection.
 */
export const ProductsPage: GlobalConfig = {
  slug: "products-page",
  label: "Products Page (index)",

  versions: { drafts: true },
  access: { read: publishedOnlyForPublic, update: editorsUpdate },
  hooks: {
    beforeChange: [blockEditorPublishGlobal],
    afterChange: [revalidateCmsTag],
  },

  fields: [
    // ------------------------------------------------------------------
    // Header
    // ------------------------------------------------------------------
    {
      name: "eyebrow",
      type: "text",
      required: true,
      defaultValue: "Our products",
      admin: { description: "Small uppercase label above the page title." },
    },
    {
      name: "title",
      type: "text",
      required: true,
      defaultValue: "Voice-first tools your clinicians can verify",
      admin: { description: "Page H1." },
    },
    {
      name: "conciseAnswer",
      type: "textarea",
      required: true,
      admin: {
        description:
          "40-60 word intro shown below the H1. Also used for AEO / featured-snippet eligibility.",
      },
    },
    {
      name: "introParagraphs",
      type: "array",
      labels: { singular: "Paragraph", plural: "Paragraphs" },
      admin: { description: "Optional paragraphs shown above the product cards." },
      fields: [{ name: "text", type: "textarea", required: true }],
    },

    // ------------------------------------------------------------------
    // SEO
    // ------------------------------------------------------------------
    {
      name: "seo",
      type: "group",
      admin: { description: "Search-engine / social-share metadata for /product." },
      fields: [
        { name: "title", type: "text", admin: { description: "Defaults to 'Products overview'." } },
        { name: "description", type: "textarea", admin: { description: "Meta description (~155 chars)." } },
      ],
    },
  ],
};
