import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";

export const FounderNote: GlobalConfig = {
  slug: "founder-note",
  label: "Founder Note",
  access: { read: () => true },
  hooks: { afterChange: [revalidateCmsTag] },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "role", type: "text", required: true },
    { name: "quote", type: "textarea", required: true },
    { name: "aboutHref", type: "text", required: true, defaultValue: "/about" },
    { name: "portrait", type: "upload", relationTo: "media" },
  ],
};
