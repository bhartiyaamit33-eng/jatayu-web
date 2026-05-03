import type { CollectionConfig } from "payload";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: { useAsTitle: "attribution" },
  access: { read: () => true },
  fields: [
    { name: "quote", type: "textarea", required: true },
    { name: "attribution", type: "text", required: true },
    { name: "role", type: "text" },
    { name: "consentOnFile", type: "checkbox", defaultValue: false, admin: { description: "Required before publishing publicly." } },
    { name: "order", type: "number", defaultValue: 100 },
  ],
};
