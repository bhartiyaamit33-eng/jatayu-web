import type { Plugin } from "payload";
import { superAdminOnly } from "@/lib/access";
import { reviewStatusField } from "@/lib/review-workflow";
import {
  lockReviewStatusForEditors,
  lockReviewStatusForEditorsGlobal,
  notifySuperAdminsOnReviewSubmit,
  notifySuperAdminsOnReviewSubmitGlobal,
  syncReviewStatusOnPublish,
  syncReviewStatusOnPublishGlobal,
} from "@/lib/review-hooks";
import {
  auditLogAfterChangeCollection,
  auditLogAfterDeleteCollection,
  auditLogAfterChangeGlobal,
} from "@/lib/audit-log";

const submitForReviewButton =
  "/src/components/admin/SubmitForReviewButton#SubmitForReviewButton";

function hasDrafts(entity: {
  versions?: boolean | { drafts?: boolean | object };
}) {
  const versions = entity.versions;
  if (!versions) return false;
  if (typeof versions === "boolean") return versions;
  return Boolean(versions.drafts);
}

export const cmsWorkflowPlugin: Plugin = (config) => ({
  ...config,
  collections: config.collections?.map((collection) => {
    if (!hasDrafts(collection)) return collection;

    return {
      ...collection,
      fields: [...(collection.fields ?? []), reviewStatusField],
      admin: {
        ...collection.admin,
        components: {
          ...collection.admin?.components,
          edit: {
            ...collection.admin?.components?.edit,
            beforeDocumentControls: [
              ...(collection.admin?.components?.edit?.beforeDocumentControls ??
                []),
              submitForReviewButton,
            ],
          },
        },
      },
      hooks: {
        ...collection.hooks,
        beforeChange: [
          ...(collection.hooks?.beforeChange ?? []),
          lockReviewStatusForEditors,
          syncReviewStatusOnPublish,
        ],
        afterChange: [
          ...(collection.hooks?.afterChange ?? []),
          notifySuperAdminsOnReviewSubmit,
          auditLogAfterChangeCollection,
        ],
        afterDelete: [
          ...(collection.hooks?.afterDelete ?? []),
          auditLogAfterDeleteCollection,
        ],
      },
      access: {
        ...collection.access,
        delete: superAdminOnly,
      },
    };
  }),
  globals: config.globals?.map((global) => {
    if (!hasDrafts(global)) return global;

    return {
      ...global,
      fields: [...(global.fields ?? []), reviewStatusField],
      admin: {
        ...global.admin,
        components: {
          ...global.admin?.components,
          elements: {
            ...global.admin?.components?.elements,
            beforeDocumentControls: [
              ...(global.admin?.components?.elements?.beforeDocumentControls ??
                []),
              submitForReviewButton,
            ],
          },
        },
      },
      hooks: {
        ...global.hooks,
        beforeChange: [
          ...(global.hooks?.beforeChange ?? []),
          lockReviewStatusForEditorsGlobal,
          syncReviewStatusOnPublishGlobal,
        ],
        afterChange: [
          ...(global.hooks?.afterChange ?? []),
          notifySuperAdminsOnReviewSubmitGlobal,
          auditLogAfterChangeGlobal,
        ],
      },
    };
  }),
});
