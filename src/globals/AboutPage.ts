import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";
import {
  blockEditorPublishGlobal,
  editorsUpdate,
  publishedOnlyForPublic,
} from "@/lib/access";

/**
 * AboutPage
 * ---------
 * Everything on /about that isn't the team grid itself.
 *
 * Editors control:
 *   - The header (eyebrow + H1 + 40–60-word concise answer)
 *   - The intro narrative — free-form paragraphs above the team grid
 *   - The team-section heading + optional subhead
 *   - A toggle for the founder-quote sidebar
 *   - SEO overrides
 *
 * The team members themselves live in the `team-members` collection
 * (so each person is one editable row, not a giant array field).
 */
export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "Page — About",

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
      defaultValue: "Our story",
      admin: { description: "Small uppercase label above the H1." },
    },
    {
      name: "title",
      type: "text",
      required: true,
      defaultValue: "Engineering rigour for any voice that needs to be heard, anywhere",
      admin: { description: "Page H1." },
    },
    {
      name: "conciseAnswer",
      type: "textarea",
      required: true,
      admin: { description: "40–60 word AEO answer shown directly under the H1." },
    },

    // ------------------------------------------------------------------
    // Intro narrative (above the team grid)
    // ------------------------------------------------------------------
    {
      name: "introParagraphs",
      type: "array",
      labels: { singular: "Paragraph", plural: "Paragraphs" },
      admin: {
        description:
          "Free-form paragraphs shown above the team grid. Each row renders as one <p>.",
      },
      fields: [{ name: "text", type: "textarea", required: true }],
    },

    // ------------------------------------------------------------------
    // Team section
    // ------------------------------------------------------------------
    {
      name: "teamSectionHeading",
      type: "text",
      required: true,
      defaultValue: "The team",
      admin: { description: "Heading shown above the team-member grid." },
    },
    {
      name: "teamSectionSubhead",
      type: "textarea",
      admin: {
        description:
          "Optional short paragraph under the team heading. Leave blank to omit.",
      },
    },

    // ------------------------------------------------------------------
    // Optional blocks
    // ------------------------------------------------------------------
    {
      name: "showFounderQuote",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description:
          "Show the founder-quote sidebar pulled from Globals → Founder Note.",
      },
    },

    // ------------------------------------------------------------------
    // SEO
    // ------------------------------------------------------------------
    {
      name: "seo",
      type: "group",
      admin: { description: "Search-engine / social-share metadata for /about." },
      fields: [
        { name: "title", type: "text", admin: { description: "Overrides default <title>." } },
        { name: "description", type: "textarea", admin: { description: "Meta description (~155 chars)." } },
      ],
    },
  ],
};
