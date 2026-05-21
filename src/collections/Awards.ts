import type { CollectionConfig } from "payload";

export const Awards: CollectionConfig = {
  slug: "awards",
  admin: { useAsTitle: "name", defaultColumns: ["name", "detail", "order"] },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "detail", type: "text" },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "sourceUrl", type: "text", admin: { description: "External press / award announcement link." } },
    { name: "order", type: "number", defaultValue: 100 },
  ],
};
