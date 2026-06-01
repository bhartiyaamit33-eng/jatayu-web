import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";
import {
  blockEditorPublishGlobal,
  editorsUpdate,
  publishedOnlyForPublic,
} from "@/lib/access";

/**
 * Editable copy for the homepage section headers (eyebrows / headings /
 * sub-text) that used to be hardcoded in HomeSections.tsx. Each field maps to
 * one on-page string so editors can change them from /admin.
 */
export const HomeSectionsContent: GlobalConfig = {
  slug: "home-sections",
  label: "Homepage Sections",
  versions: { drafts: true },
  access: { read: publishedOnlyForPublic, update: editorsUpdate },
  hooks: {
    beforeChange: [blockEditorPublishGlobal],
    afterChange: [revalidateCmsTag],
  },
  fields: [
    {
      type: "collapsible",
      label: "Concise answer (What it is)",
      fields: [
        { name: "conciseHeading", type: "text", required: true, defaultValue: "VoiceDocAI in plain language" },
      ],
    },
    {
      type: "collapsible",
      label: "How it works",
      fields: [
        { name: "howItWorksEyebrow", type: "text", required: true, defaultValue: "How it works" },
        { name: "howItWorksHeading", type: "text", required: true, defaultValue: "From conversation to verified note" },
        { name: "howItWorksIntro", type: "textarea", required: true },
      ],
    },
    {
      type: "collapsible",
      label: "Specialties",
      fields: [
        { name: "specialtiesEyebrow", type: "text", required: true, defaultValue: "Inside the Medical use case" },
        { name: "specialtiesHeading", type: "text", required: true, defaultValue: "20+ clinical specialties, ready to use" },
      ],
    },
    {
      type: "collapsible",
      label: "Testimonials",
      fields: [
        { name: "testimonialsEyebrow", type: "text", required: true, defaultValue: "Evidence from real deployments" },
        { name: "testimonialsHeading", type: "text", required: true, defaultValue: "Feedback we can stand behind" },
        { name: "testimonialsSubtext", type: "textarea", required: true },
      ],
    },
  ],
};
