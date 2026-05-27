import type { CollectionConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";
import {
  blockEditorPublish,
  editorsUpdate,
  publishedOnlyForPublic,
} from "@/lib/access";

export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  admin: {
    useAsTitle: "institution",
    defaultColumns: ["institution", "slug", "spotlight", "publishedAt", "_status"],
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
    { name: "institution", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "pullQuote", type: "textarea", required: true },
    { name: "metricsLine", type: "text", required: true },
    { name: "linkLabel", type: "text", required: true, defaultValue: "Read the case study" },
    { name: "spotlight", type: "checkbox", defaultValue: false, admin: { description: "Highlight on the home page (one at a time)." } },
    { name: "coverImage", type: "upload", relationTo: "media", admin: { description: "Used in the case study spotlight card and listing page." } },
    {
      name: "charts",
      type: "group",
      admin: { description: "Optional pilot charts (KEM-style: time saved, specialty distribution, language distribution)." },
      fields: [
        { name: "timeSaved", type: "upload", relationTo: "media", label: "Time-saved bar chart" },
        { name: "specialtyDistribution", type: "upload", relationTo: "media", label: "Specialty distribution pie" },
        { name: "languageDistribution", type: "upload", relationTo: "media", label: "Language distribution pie" },
        { name: "doctorRatings", type: "upload", relationTo: "media", label: "Doctor feedback ratings card" },
        { name: "validationLetter", type: "upload", relationTo: "media", label: "Hospital validation letter (e.g. MGM)" },
      ],
    },
    { name: "publishedAt", type: "date", admin: { date: { pickerAppearance: "dayOnly" } } },
    { name: "order", type: "number", defaultValue: 100 },
  ],
};
