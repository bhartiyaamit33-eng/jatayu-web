import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";
import {
  blockEditorPublishGlobal,
  editorsUpdate,
  publishedOnlyForPublic,
} from "@/lib/access";

/**
 * ForHospitalsPage
 * ----------------
 * Owns every word on /for-hospitals-and-hmis.
 *
 * Layout the editor controls:
 *   - Header: eyebrow + H1 + 40-60 word concise answer.
 *   - Two side-by-side cards:
 *       (a) Integration story (ordered list of bullets).
 *       (b) Procurement pack (title + body + one CTA link).
 *   - Two bottom CTAs (primary + secondary).
 *   - SEO overrides.
 */
export const ForHospitalsPage: GlobalConfig = {
  slug: "for-hospitals-page",
  label: "Page — For Hospitals & HMIS",

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
      defaultValue: "Hospital IT & HMIS partners",
      admin: { description: "Small uppercase label above the page title." },
    },
    {
      name: "title",
      type: "text",
      required: true,
      defaultValue: "One clinical voice layer across your stack",
      admin: { description: "Page H1." },
    },
    {
      name: "conciseAnswer",
      type: "textarea",
      required: true,
      admin: { description: "40-60 word AEO answer shown directly under the H1." },
    },

    // ------------------------------------------------------------------
    // Card 1 — Integration story (ordered list)
    // ------------------------------------------------------------------
    {
      name: "integrationStory",
      type: "group",
      admin: { description: "Left card: an ordered list explaining how integration works." },
      fields: [
        {
          name: "heading",
          type: "text",
          required: true,
          defaultValue: "Integration story",
        },
        {
          name: "steps",
          type: "array",
          minRows: 1,
          labels: { singular: "Step", plural: "Steps" },
          admin: { description: "Each row becomes one numbered bullet." },
          fields: [{ name: "text", type: "textarea", required: true }],
        },
      ],
    },

    // ------------------------------------------------------------------
    // Card 2 — Procurement pack (dark card)
    // ------------------------------------------------------------------
    {
      name: "procurementPack",
      type: "group",
      admin: { description: "Right (dark) card pointing procurement teams to the Security page." },
      fields: [
        { name: "heading", type: "text", required: true, defaultValue: "Procurement pack" },
        { name: "body", type: "textarea", required: true },
        {
          name: "ctaLabel",
          type: "text",
          required: true,
          defaultValue: "Open Security & Compliance",
        },
        {
          name: "ctaHref",
          type: "text",
          required: true,
          defaultValue: "/security",
          admin: { description: "Where the card's button links to." },
        },
      ],
    },

    // ------------------------------------------------------------------
    // Calls to action (bottom of page)
    // ------------------------------------------------------------------
    {
      name: "primaryCta",
      type: "group",
      fields: [
        { name: "label", type: "text", required: true, defaultValue: "Book integration workshop" },
        { name: "href", type: "text", required: true, defaultValue: "/contact" },
      ],
    },
    {
      name: "secondaryCta",
      type: "group",
      fields: [
        { name: "label", type: "text", required: true, defaultValue: "Read case studies" },
        { name: "href", type: "text", required: true, defaultValue: "/case-studies" },
      ],
    },

    // ------------------------------------------------------------------
    // SEO
    // ------------------------------------------------------------------
    {
      name: "seo",
      type: "group",
      admin: { description: "Search-engine / social-share metadata for /for-hospitals-and-hmis." },
      fields: [
        { name: "title", type: "text", admin: { description: "Overrides the default <title>." } },
        { name: "description", type: "textarea", admin: { description: "Meta description (~155 chars)." } },
      ],
    },
  ],
};
