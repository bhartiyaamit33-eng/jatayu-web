import type { CollectionConfig } from "payload";
import { revalidateCmsTag } from "@/lib/cms-hooks";

/**
 * TeamMembers
 * -----------
 * One row per person on the Jatayu team. Each row carries everything the
 * /about page's team grid needs: a portrait, a name, a designation
 * (e.g. "Director & CEO"), and a short description / bio paragraph.
 *
 * Ordering:
 *   - `order` controls position in the grid (lower = earlier).
 *   - `featuredOnHome` is reserved for a future home-page block.
 *
 * Why a collection instead of a global-with-array:
 *   Same reason as Posts, Specialties, Case Studies, Awards. Each entry
 *   gets its own row in /admin (nicer to edit one person at a time), and
 *   the collection scales gracefully when the team grows.
 */
export const TeamMembers: CollectionConfig = {
  slug: "team-members",

  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "order", "featuredOnHome"],
    description:
      "People on the Jatayu team. Surfaces on /about. Add a new row to publish a new card.",
  },

  access: { read: () => true },

  // Editor saves a member → revalidate the cms tag → /about re-fetches.
  hooks: {
    afterChange: [revalidateCmsTag],
    afterDelete: [revalidateCmsTag],
  },

  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: { description: "Full name as it should appear on the card." },
    },
    {
      name: "role",
      type: "text",
      required: true,
      admin: {
        description:
          "Designation / title. Examples: 'Director & CEO', 'Co-founder', 'Head of Clinical Research'.",
      },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      admin: {
        description:
          "Short bio paragraph. ~30–60 words is the sweet spot for the card layout.",
      },
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Portrait. Square crops look best (the card renders it at a fixed aspect ratio).",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 100,
      admin: { description: "Lower number = appears earlier on the team grid." },
    },
    {
      name: "featuredOnHome",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "Reserved — surface this person on the homepage when we add that block.",
      },
    },
  ],
};
