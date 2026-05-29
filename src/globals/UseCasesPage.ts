import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";
import {
  blockEditorPublishGlobal,
  editorsUpdate,
  publishedOnlyForPublic,
} from "@/lib/access";

/**
 * UseCasesPage
 * ------------
 * Header chrome for the /use-cases index page.
 *
 * Individual use cases live in the `use-cases` collection — this global
 * only owns the page eyebrow / H1 / intro and the SEO metadata for the
 * listing URL itself.
 */
export const UseCasesPage: GlobalConfig = {
  slug: "use-cases-page",
  label: "Page — Use Cases (index)",

  versions: { drafts: true },
  access: { read: publishedOnlyForPublic, update: editorsUpdate },
  hooks: {
    beforeChange: [blockEditorPublishGlobal],
    afterChange: [revalidateCmsTag],
  },

  fields: [
    {
      name: "eyebrow",
      type: "text",
      required: true,
      defaultValue: "Use cases",
    },
    {
      name: "title",
      type: "text",
      required: true,
      defaultValue: "Built for any conversation worth documenting",
    },
    {
      name: "conciseAnswer",
      type: "textarea",
      required: true,
      defaultValue:
        "VoiceDocAI captures multi-speaker conversations, identifies speakers, generates summaries, and produces ready-to-use reports. Tuned for multilingual, high-noise environments. Pick the workflow that matches your domain.",
    },
    {
      name: "introParagraphs",
      type: "array",
      labels: { singular: "Paragraph", plural: "Paragraphs" },
      admin: { description: "Optional paragraphs above the use-case cards." },
      fields: [{ name: "text", type: "textarea", required: true }],
    },
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
      ],
    },
  ],
};
