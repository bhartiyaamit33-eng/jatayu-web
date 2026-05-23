import type { GlobalConfig } from "payload";

export const SiteMeta: GlobalConfig = {
  slug: "site-meta",
  access: { read: () => true },
  fields: [
    { name: "productName", type: "text", required: true },
    { name: "legalName", type: "text", required: true },
    { name: "domain", type: "text", required: true },
    { name: "salesEmail", type: "email", required: true },
    { name: "supportEmail", type: "email", required: true },
    { name: "addressLine", type: "text", required: true },
    { name: "defaultTitle", type: "text", required: true },
    { name: "defaultDescription", type: "textarea", required: true },
    // NOTE: a `logo` upload field belongs here so the brand mark is editable
    // via CMS. Adding it now would require a manual ALTER TABLE on the prod
    // Postgres (push: true does not run on the standalone server) — track as
    // a follow-up: run `payload migrate` against prod, then re-add this field.
  ],
};
