import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { revalidateCmsTag } from "@/lib/cms-hooks";
import {
  blockEditorPublish,
  editorsUpdate,
  publishedOnlyForPublic,
} from "@/lib/access";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "_status"],
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
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "excerpt", type: "textarea", required: true },
    { name: "category", type: "text", required: true },
    { name: "readTimeMinutes", type: "number", required: true },
    { name: "publishedAt", type: "date", required: true, admin: { date: { pickerAppearance: "dayOnly" } } },
    {
      name: "body",
      type: "richText",
      editor: lexicalEditor({}),
    },
    { name: "heroImage", type: "upload", relationTo: "media" },
  ],
};
