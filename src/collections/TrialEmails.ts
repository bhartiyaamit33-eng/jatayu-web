import type { CollectionConfig } from "payload";

export const TrialEmails: CollectionConfig = {
  slug: "trial-emails",
  admin: {
    useAsTitle: "subject",
    defaultColumns: ["sendOnDay", "subject"],
    description:
      "Drip emails sent during the 7-day trial. Tokens like {{firstName}} are replaced by the dispatcher.",
  },
  access: { read: () => true },
  fields: [
    { name: "key", type: "text", required: true, unique: true, admin: { description: "Stable identifier, e.g. day-0-welcome." } },
    { name: "sendOnDay", type: "number", required: true },
    { name: "subject", type: "text", required: true },
    { name: "preheader", type: "text", required: true },
    {
      name: "body",
      type: "array",
      required: true,
      labels: { singular: "Paragraph", plural: "Paragraphs" },
      fields: [{ name: "text", type: "textarea", required: true }],
    },
    {
      name: "cta",
      type: "group",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text", required: true },
      ],
    },
  ],
};
