import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "publish"
  | "submit_review"
  | "reject";

function titleFromDoc(doc: Record<string, unknown>): string {
  for (const key of [
    "title",
    "name",
    "headline",
    "label",
    "email",
    "slug",
  ]) {
    const value = doc[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return String(doc.id ?? "unknown");
}

function resolveAction(
  operation: "create" | "update" | "delete",
  doc: Record<string, unknown>,
  previousDoc?: Record<string, unknown>,
): AuditAction {
  if (doc.reviewStatus === "pending_review") return "submit_review";
  if (doc.reviewStatus === "rejected") return "reject";
  if (
    doc._status === "published" &&
    previousDoc?._status !== "published"
  ) {
    return "publish";
  }
  return operation;
}

async function writeAuditLog(args: {
  req: Parameters<CollectionAfterChangeHook>[0]["req"];
  action: AuditAction;
  collectionSlug?: string;
  globalSlug?: string;
  documentId?: string | number;
  documentTitle: string;
  summary: string;
}) {
  const { req, action, collectionSlug, globalSlug, documentId, documentTitle, summary } =
    args;

  if (!req.user) return;

  try {
    await req.payload.create({
      collection: "audit-logs",
      data: {
        action,
        collectionSlug: collectionSlug ?? null,
        globalSlug: globalSlug ?? null,
        documentId: documentId != null ? String(documentId) : null,
        documentTitle,
        userEmail: req.user.email,
        userName:
          (req.user.fullName as string | undefined) ??
          (req.user.email as string | undefined) ??
          "Unknown user",
        user: req.user.id,
        summary,
      },
      overrideAccess: true,
      req,
    });
  } catch (error) {
    req.payload.logger.error({ err: error, msg: "Failed to write audit log" });
  }
}

export const auditLogAfterChangeCollection: CollectionAfterChangeHook = async ({
  collection,
  doc,
  operation,
  previousDoc,
  req,
}) => {
  const action = resolveAction(operation, doc as Record<string, unknown>, previousDoc);
  const title = titleFromDoc(doc as Record<string, unknown>);

  await writeAuditLog({
    req,
    action,
    collectionSlug: collection.slug,
    documentId: doc.id,
    documentTitle: title,
    summary: `${action} on ${collection.slug}/${doc.id} (${title})`,
  });

  return doc;
};

export const auditLogAfterDeleteCollection: CollectionAfterDeleteHook = async ({
  collection,
  doc,
  req,
}) => {
  const title = titleFromDoc(doc as Record<string, unknown>);
  await writeAuditLog({
    req,
    action: "delete",
    collectionSlug: collection.slug,
    documentId: doc.id,
    documentTitle: title,
    summary: `delete on ${collection.slug}/${doc.id} (${title})`,
  });
  return doc;
};

export const auditLogAfterChangeGlobal: GlobalAfterChangeHook = async ({
  doc,
  global,
  previousDoc,
  req,
}) => {
  const action = resolveAction(
    "update",
    doc as Record<string, unknown>,
    previousDoc,
  );
  const title = titleFromDoc(doc as Record<string, unknown>);

  await writeAuditLog({
    req,
    action,
    globalSlug: global.slug,
    documentTitle: title,
    summary: `${action} on global ${global.slug} (${title})`,
  });

  return doc;
};
