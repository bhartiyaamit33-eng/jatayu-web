import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";
import {
  blockEditorPublishGlobal,
  editorsUpdate,
  publishedOnlyForPublic,
} from "@/lib/access";

export const HomepageConciseAnswer: GlobalConfig = {
  slug: "homepage-concise-answer",
  label: "Homepage Concise Answer (AEO)",
  versions: { drafts: true },
  access: { read: publishedOnlyForPublic, update: editorsUpdate },
  hooks: {
    beforeChange: [blockEditorPublishGlobal],
    afterChange: [revalidateCmsTag],
  },
  fields: [
    { name: "label", type: "text", required: true, defaultValue: "What it is" },
    { name: "body", type: "textarea", required: true, admin: { description: "Plain-English answer used by Google AEO and as the home 'What it is' section." } },
  ],
};
