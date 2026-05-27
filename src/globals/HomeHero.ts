import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";
import {
  blockEditorPublishGlobal,
  editorsUpdate,
  publishedOnlyForPublic,
} from "@/lib/access";

export const HomeHero: GlobalConfig = {
  slug: "home-hero",
  label: "Home Hero",
  versions: { drafts: true },
  access: { read: publishedOnlyForPublic, update: editorsUpdate },
  hooks: {
    beforeChange: [blockEditorPublishGlobal],
    afterChange: [revalidateCmsTag],
  },
  fields: [
    { name: "badge", type: "text", required: true },
    { name: "headline", type: "text", required: true, admin: { description: "Use a period after the first sentence; the second sentence is auto-styled with the brand gradient." } },
    { name: "subheadline", type: "textarea", required: true },
    { name: "trustLine", type: "textarea", required: true },
    {
      name: "primaryCta",
      type: "group",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "secondaryCta",
      type: "group",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
  ],
};
