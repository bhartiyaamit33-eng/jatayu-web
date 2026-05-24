import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";

/**
 * SiteFooter
 * ----------
 * Every word and every link in the dark footer at the bottom of every page.
 *
 * What editors control here:
 *   - The short tagline under the logo
 *   - The three link columns (Product / Company / Legal)
 *   - Social media buttons (LinkedIn, Instagram, Twitter/X, YouTube, Facebook)
 *   - The right-hand strapline next to the © year line
 *
 * Office addresses still come from `site-meta` (siteMeta.offices) — they
 * appear on /contact too and we want one source of truth for them.
 */
export const SiteFooter: GlobalConfig = {
  slug: "site-footer",
  label: "Site Footer",

  access: { read: () => true },
  hooks: { afterChange: [revalidateCmsTag] },

  fields: [
    // ------------------------------------------------------------------
    // Brand block (top-left under the logo)
    // ------------------------------------------------------------------
    {
      name: "tagline",
      type: "textarea",
      required: true,
      defaultValue:
        "VoiceDocAI: voice-first clinical documentation for Indian healthcare. Hands-free, pocket-friendly, built for verification before filing.",
      admin: {
        description:
          "Short product description shown beneath the logo. Keep to ~2 sentences.",
      },
    },

    // ------------------------------------------------------------------
    // Link columns
    // ------------------------------------------------------------------
    {
      name: "productLinks",
      type: "array",
      labels: { singular: "Link", plural: "Links" },
      admin: { description: "Right-side column 1 — Product." },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "companyLinks",
      type: "array",
      labels: { singular: "Link", plural: "Links" },
      admin: { description: "Right-side column 2 — Company." },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "legalLinks",
      type: "array",
      labels: { singular: "Link", plural: "Links" },
      admin: { description: "Right-side column 3 — Legal." },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },

    // ------------------------------------------------------------------
    // Social media buttons
    // ------------------------------------------------------------------
    {
      name: "socialLinks",
      type: "array",
      labels: { singular: "Social link", plural: "Social links" },
      admin: {
        description:
          "Buttons rendered next to the brand block. Pick a platform — its icon is mapped automatically. Add a full URL.",
      },
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          // Keep this list in sync with the SocialIcon component's switch.
          // Adding a new platform here without adding the SVG mapping will
          // silently render an empty button.
          options: [
            { label: "LinkedIn", value: "linkedin" },
            { label: "Instagram", value: "instagram" },
            { label: "X (Twitter)", value: "x" },
            { label: "YouTube", value: "youtube" },
            { label: "Facebook", value: "facebook" },
          ],
        },
        {
          name: "href",
          type: "text",
          required: true,
          admin: { description: "Full URL including https://" },
        },
      ],
    },

    // ------------------------------------------------------------------
    // Bottom strapline (right side of the copyright row)
    // ------------------------------------------------------------------
    {
      name: "bottomStrapline",
      type: "text",
      required: true,
      defaultValue: "Made for Indian clinicians and hospital IT teams.",
      admin: {
        description:
          "Short line shown on the right of the copyright row. Keep it brief.",
      },
    },
  ],
};
