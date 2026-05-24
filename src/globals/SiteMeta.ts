import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";

export const SiteMeta: GlobalConfig = {
  slug: "site-meta",
  access: { read: () => true },
  hooks: { afterChange: [revalidateCmsTag] },
  fields: [
    { name: "productName", type: "text", required: true },
    { name: "legalName", type: "text", required: true },
    { name: "domain", type: "text", required: true },
    { name: "salesEmail", type: "email", required: true },
    { name: "supportEmail", type: "email", required: true },
    { name: "addressLine", type: "text", required: true },
    { name: "defaultTitle", type: "text", required: true },
    { name: "defaultDescription", type: "textarea", required: true },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Brand logo shown in the site header, footer, and hero. Square (1:1) PNG or SVG recommended. Falls back to /brand/jatayu-logo.png when empty.",
      },
    },
  ],
};
