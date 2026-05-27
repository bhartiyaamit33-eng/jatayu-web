import type { CollectionConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";
import {
  blockEditorPublish,
  editorsUpdate,
  publishedOnlyForPublic,
} from "@/lib/access";

export const Awards: CollectionConfig = {
  slug: "awards",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "detail", "order", "_status"],
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
    { name: "name", type: "text", required: true },
    { name: "detail", type: "text" },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "sourceUrl", type: "text", admin: { description: "External press / award announcement link." } },
    { name: "order", type: "number", defaultValue: 100 },
  ],
};
