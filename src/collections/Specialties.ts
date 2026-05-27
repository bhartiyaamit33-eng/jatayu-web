import type { CollectionConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";
import {
  blockEditorPublish,
  editorsUpdate,
  publishedOnlyForPublic,
} from "@/lib/access";

export const Specialties: CollectionConfig = {
  slug: "specialties",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "featuredOnHome", "order", "_status"],
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
    { name: "blurb", type: "textarea", required: true },
    { name: "icon", type: "upload", relationTo: "media", admin: { description: "Optional SVG/PNG glyph. Shows top-left of the specialty card." } },
    { name: "featuredOnHome", type: "checkbox", defaultValue: false, admin: { description: "Show on home Specialties grid." } },
    { name: "order", type: "number", defaultValue: 100, admin: { description: "Lower = earlier." } },
  ],
};
