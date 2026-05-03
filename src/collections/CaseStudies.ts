import type { CollectionConfig } from "payload";

export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  admin: {
    useAsTitle: "institution",
    defaultColumns: ["institution", "slug", "spotlight", "publishedAt"],
  },
  versions: { drafts: true },
  access: {
    read: ({ req }) =>
      req.user
        ? true
        : { _status: { equals: "published" } },
  },
  fields: [
    { name: "institution", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "pullQuote", type: "textarea", required: true },
    { name: "metricsLine", type: "text", required: true },
    { name: "linkLabel", type: "text", required: true, defaultValue: "Read the case study" },
    { name: "spotlight", type: "checkbox", defaultValue: false, admin: { description: "Highlight on the home page (one at a time)." } },
    { name: "publishedAt", type: "date", admin: { date: { pickerAppearance: "dayOnly" } } },
    { name: "order", type: "number", defaultValue: 100 },
  ],
};
