import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "_status"],
  },
  versions: { drafts: true },
  access: {
    read: ({ req }) =>
      req.user
        ? true
        : { _status: { equals: "published" } },
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
