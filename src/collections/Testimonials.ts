import type { CollectionConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";
import {
  blockEditorPublish,
  editorsUpdate,
  publishedOnlyForPublic,
} from "@/lib/access";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: {
    useAsTitle: "attribution",
    defaultColumns: ["attribution", "role", "order", "_status"],
  },
  versions: { drafts: true },
  access: {
    read: publishedOnlyForPublic,
    create: editorsUpdate,
    update: editorsUpdate,
    delete: editorsUpdate,
  },
  hooks: {
    beforeChange: [blockEditorPublish],
    afterChange: [revalidateCmsTag],
    afterDelete: [revalidateCmsTag],
  },
  fields: [
    { name: "quote", type: "textarea", required: true },
    { name: "attribution", type: "text", required: true },
    { name: "role", type: "text" },
    { name: "consentOnFile", type: "checkbox", defaultValue: false, admin: { description: "Required before publishing publicly." } },
    { name: "order", type: "number", defaultValue: 100 },
  ],
};
