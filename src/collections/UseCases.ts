import type { CollectionConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";
import {
  blockEditorPublish,
  editorsUpdate,
  publishedOnlyForPublic,
} from "@/lib/access";

/**
 * UseCases
 * --------
 * One row per industry / vertical we serve.
 *
 * Today: Medical / Healthcare and Market Research / Qualitative Research.
 * Tomorrow: legal interviews, sales calls, education, customer success,
 * any vertical that needs structured documentation from voice.
 *
 * Each row drives:
 *   - the card on /use-cases (the index), AND
 *   - the full /use-cases/<slug> detail page.
 *
 * The page body is structured as an editable `sections` array — every
 * section is one block of (heading, optional eyebrow, body paragraph(s),
 * bullets). This keeps a use case page composable without the editor
 * touching code.
 */
export const UseCases: CollectionConfig = {
  slug: "use-cases",

  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "tagline", "order", "_status"],
    description:
      "Each row is one industry / vertical (Medical, Market Research, etc.). The /use-cases page lists every row; the detail page lives at /use-cases/<slug>.",
  },

  versions: { drafts: true },

  access: {
    read: publishedOnlyForPublic,
    create: editorsUpdate,
    update: editorsUpdate,
    delete: editorsUpdate,
  },

  hooks: {
    beforeChange: [blockEditorPublish],
    afterChange: [revalidateCmsTag],
    afterDelete: [revalidateCmsTag],
  },

  fields: [
    // ------------------------------------------------------------------
    // Identity / card
    // ------------------------------------------------------------------
    {
      name: "name",
      type: "text",
      required: true,
      admin: {
        description:
          "Display name. Examples: 'Medical / Healthcare', 'Market Research', 'Legal interviews'.",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          "URL fragment, lowercase, no spaces. Detail page lives at /use-cases/<slug>.",
      },
    },
    {
      name: "eyebrow",
      type: "text",
      required: true,
      admin: { description: "Small uppercase label above the H1 (e.g. 'Use case')." },
    },
    {
      name: "tagline",
      type: "text",
      required: true,
      admin: { description: "One-line promise for this vertical. Used as the H1 on the detail page." },
    },
    {
      name: "shortPitch",
      type: "textarea",
      required: true,
      admin: {
        description:
          "Card description on the /use-cases listing. Also used as the AEO answer block on the detail page. 40–60 words.",
      },
    },
    {
      name: "icon",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Optional icon shown on the listing card. SVG works best. Falls back to a gradient block if empty.",
      },
    },

    // ------------------------------------------------------------------
    // Body — composable section array
    // ------------------------------------------------------------------
    {
      name: "introParagraphs",
      type: "array",
      labels: { singular: "Paragraph", plural: "Paragraphs" },
      admin: {
        description:
          "Free-form paragraphs shown above the section blocks. Each row = one <p>.",
      },
      fields: [{ name: "text", type: "textarea", required: true }],
    },
    {
      name: "sections",
      type: "array",
      labels: { singular: "Section", plural: "Sections" },
      admin: {
        description:
          "Stackable content blocks. Each section can be a simple heading + body, a bulleted list, or both. Add as many as the page needs.",
      },
      fields: [
        {
          name: "eyebrow",
          type: "text",
          admin: { description: "Optional small uppercase label above the heading." },
        },
        {
          name: "heading",
          type: "text",
          required: true,
        },
        {
          name: "body",
          type: "textarea",
          admin: { description: "Optional intro paragraph for this section." },
        },
        {
          name: "bullets",
          type: "array",
          labels: { singular: "Bullet", plural: "Bullets" },
          admin: {
            description:
              "Optional bulleted points under the body. Empty = no list rendered.",
          },
          fields: [{ name: "text", type: "textarea", required: true }],
        },
      ],
    },

    // ------------------------------------------------------------------
    // Calls to action (bottom of detail page)
    // ------------------------------------------------------------------
    {
      name: "primaryCta",
      type: "group",
      fields: [
        { name: "label", type: "text", required: true, defaultValue: "Start 7-day trial" },
        { name: "href", type: "text", required: true, defaultValue: "/trial" },
      ],
    },
    {
      name: "secondaryCta",
      type: "group",
      fields: [
        { name: "label", type: "text", required: true, defaultValue: "Talk to our team" },
        { name: "href", type: "text", required: true, defaultValue: "/contact" },
      ],
    },

    // ------------------------------------------------------------------
    // Ordering, listing controls, SEO
    // ------------------------------------------------------------------
    {
      name: "order",
      type: "number",
      defaultValue: 100,
      admin: { description: "Lower = appears earlier on /use-cases." },
    },
    {
      name: "featuredOnHome",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "Show this use case in the homepage 'What you can build with it' block.",
      },
    },
    {
      name: "seo",
      type: "group",
      admin: { description: "Search-engine / social-share metadata for /use-cases/<slug>." },
      fields: [
        { name: "title", type: "text", admin: { description: "Defaults to the use-case name." } },
        { name: "description", type: "textarea", admin: { description: "Meta description (~155 chars)." } },
      ],
    },
  ],
};
