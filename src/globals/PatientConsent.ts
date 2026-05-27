import type { GlobalConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";
import {
  blockEditorPublishGlobal,
  editorsUpdate,
  publishedOnlyForPublic,
} from "@/lib/access";

export const PatientConsent: GlobalConfig = {
  slug: "patient-consent",
  label: "Patient Consent Block",
  versions: { drafts: true },
  access: { read: publishedOnlyForPublic, update: editorsUpdate },
  hooks: {
    beforeChange: [blockEditorPublishGlobal],
    afterChange: [revalidateCmsTag],
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "body", type: "textarea", required: true },
    {
      name: "bullets",
      type: "array",
      labels: { singular: "Bullet", plural: "Bullets" },
      fields: [{ name: "text", type: "text", required: true }],
    },
  ],
};
