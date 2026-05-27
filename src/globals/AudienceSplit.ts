import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";
import {
  blockEditorPublishGlobal,
  editorsUpdate,
  publishedOnlyForPublic,
} from "@/lib/access";

export const AudienceSplit: GlobalConfig = {
  slug: "audience-split",
  label: "Audience Split (home)",
  versions: { drafts: true },
  access: { read: publishedOnlyForPublic, update: editorsUpdate },
  hooks: {
    beforeChange: [blockEditorPublishGlobal],
    afterChange: [revalidateCmsTag],
  },
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
