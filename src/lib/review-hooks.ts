import type {
  CollectionAfterChangeHook,
  GlobalAfterChangeHook,
  CollectionBeforeChangeHook,
  GlobalBeforeChangeHook,
} from "payload";
import type { ReviewStatus } from "./review-workflow";

type ChangeDoc = Record<string, unknown> | undefined;

function getReviewStatus(doc: ChangeDoc): ReviewStatus | undefined {
  const value = doc?.reviewStatus;
  if (
    value === "none" ||
    value === "pending_review" ||
    value === "approved" ||
    value === "rejected"
  ) {
    return value;
  }
  return undefined;
}

export const syncReviewStatusOnPublish: CollectionBeforeChangeHook = async ({
  data,
  req,
  originalDoc,
}) => {
  if (req.user?.role !== "super_admin") return data;
  if (data?._status === "published") {
    data.reviewStatus = "approved";
  } else if (
    data?._status === "draft" &&
    originalDoc?._status === "published" &&
    getReviewStatus(data as ChangeDoc) === "approved"
  ) {
    data.reviewStatus = "none";
  }
  return data;
};

export const syncReviewStatusOnPublishGlobal: GlobalBeforeChangeHook = async ({
  data,
  req,
  originalDoc,
}) => {
  if (req.user?.role !== "super_admin") return data;
  if (data?._status === "published") {
    data.reviewStatus = "approved";
  } else if (
    data?._status === "draft" &&
    originalDoc?._status === "published" &&
    getReviewStatus(data as ChangeDoc) === "approved"
  ) {
    data.reviewStatus = "none";
  }
  return data;
};

export const lockReviewStatusForEditors: CollectionBeforeChangeHook = async ({
  data,
  req,
  originalDoc,
}) => {
  if (req.user?.role === "super_admin") return data;
  if (!data || !originalDoc) return data;

  const incoming = getReviewStatus(data as ChangeDoc);
  const current = getReviewStatus(originalDoc as ChangeDoc);

  if (
    incoming === "pending_review" &&
    (current === "none" || current === "rejected" || !current)
  ) {
    return data;
  }

  if (incoming !== current) {
    data.reviewStatus = current ?? "none";
  }
  return data;
};

export const lockReviewStatusForEditorsGlobal: GlobalBeforeChangeHook = async ({
  data,
  req,
  originalDoc,
}) => {
  if (req.user?.role === "super_admin") return data;
  if (!data || !originalDoc) return data;

  const incoming = getReviewStatus(data as ChangeDoc);
  const current = getReviewStatus(originalDoc as ChangeDoc);

  if (
    incoming === "pending_review" &&
    (current === "none" || current === "rejected" || !current)
  ) {
    return data;
  }

  if (incoming !== current) {
    data.reviewStatus = current ?? "none";
  }
  return data;
};

export const notifySuperAdminsOnReviewSubmit: CollectionAfterChangeHook =
  async ({ doc, req, operation }) => {
    if (operation !== "update" && operation !== "create") return doc;
    if (doc.reviewStatus !== "pending_review") return doc;
    if (req.user?.role === "super_admin") return doc;

    req.payload.logger.info(
      `[review] ${req.user?.email ?? "unknown editor"} submitted ${doc.id} for review`,
    );
    return doc;
  };

export const notifySuperAdminsOnReviewSubmitGlobal: GlobalAfterChangeHook =
  async ({ doc, global, req }) => {
    if (doc.reviewStatus !== "pending_review") return doc;
    if (req.user?.role === "super_admin") return doc;

    req.payload.logger.info(
      `[review] ${req.user?.email ?? "unknown editor"} submitted global "${global.slug}" for review`,
    );
    return doc;
  };
