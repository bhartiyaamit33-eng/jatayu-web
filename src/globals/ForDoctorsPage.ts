import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";

/**
 * ForDoctorsPage
 * --------------
 * Every piece of copy on /for-doctors lives here. Editors can:
 *   - Change the page header (eyebrow, title, AEO answer).
 *   - Add / remove / reorder benefit cards.
 *   - Toggle the shared "Patient consent" block on or off.
 *   - Change the two bottom CTAs.
 *   - Override SEO title/description.
 *
 * Field shape is intentionally flat so the admin UI stays scannable.
 */
export const ForDoctorsPage: GlobalConfig = {
  slug: "for-doctors-page",
  label: "Page — For Doctors",

  access: { read: () => true },
  hooks: { afterChange: [revalidateCmsTag] },

  fields: [
    // ------------------------------------------------------------------
    // Header
    // ------------------------------------------------------------------
    {
      name: "eyebrow",
      type: "text",
      required: true,
      defaultValue: "Clinician path",
      admin: { description: "Small uppercase label above the page title." },
    },
    {
      name: "title",
      type: "text",
      required: true,
      defaultValue: "Stay with patients, not the keyboard",
      admin: { description: "Page H1." },
    },
    {
      name: "conciseAnswer",
      type: "textarea",
      required: true,
      admin: { description: "40-60 word AEO answer shown directly under the H1." },
    },

    // ------------------------------------------------------------------
    // Benefit cards (grid below the header)
    // ------------------------------------------------------------------
    {
      name: "benefits",
      type: "array",
      minRows: 1,
      labels: { singular: "Benefit", plural: "Benefits" },
      admin: { description: "Each row renders as one card in the benefits grid." },
      fields: [
        { name: "text", type: "textarea", required: true, admin: { description: "Card body. Plain text." } },
      ],
    },

    // ------------------------------------------------------------------
    // Optional blocks
    // ------------------------------------------------------------------
    {
      name: "showPatientConsent",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Show the shared 'Patient consent' block under the benefits grid." },
    },

    // ------------------------------------------------------------------
    // Calls to action (bottom of page)
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
        { name: "label", type: "text", required: true, defaultValue: "Browse specialties" },
        { name: "href", type: "text", required: true, defaultValue: "/specialties" },
      ],
    },

    // ------------------------------------------------------------------
    // SEO
    // ------------------------------------------------------------------
    {
      name: "seo",
      type: "group",
      admin: { description: "Search-engine / social-share metadata for /for-doctors." },
      fields: [
        { name: "title", type: "text", admin: { description: "Overrides the default <title>." } },
        { name: "description", type: "textarea", admin: { description: "Meta description (~155 chars)." } },
      ],
    },
  ],
};
