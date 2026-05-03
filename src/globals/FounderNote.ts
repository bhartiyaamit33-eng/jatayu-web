import type { GlobalConfig } from "payload";

export const FounderNote: GlobalConfig = {
  slug: "founder-note",
  label: "Founder Note",
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "role", type: "text", required: true },
    { name: "quote", type: "textarea", required: true },
    { name: "aboutHref", type: "text", required: true, defaultValue: "/about" },
    { name: "portrait", type: "upload", relationTo: "media" },
  ],
};
