import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";

export const AudienceSplit: GlobalConfig = {
  slug: "audience-split",
  label: "Audience Split (home)",
  access: { read: () => true },
  hooks: { afterChange: [revalidateCmsTag] },
  fields: [
    {
      name: "doctor",
      type: "group",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
        { name: "cta", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "hospital",
      type: "group",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
        { name: "chip", type: "text", required: true },
        { name: "cta", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
  ],
};
