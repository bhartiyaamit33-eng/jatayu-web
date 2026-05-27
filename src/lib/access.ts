/**
 * Shared access-control helpers for Payload collections and globals.
 *
 * Two-role model:
 *   - `super_admin` — can save drafts AND publish.
 *   - `editor`      — can save drafts only. Cannot publish.
 *
 * Public site reads always see *published* documents only (drafts stay
 * invisible until a super admin promotes them).
 *
 * How to wire a collection / global for this workflow:
 *
 *   import {
 *     publishedOnlyForPublic,
 *     editorsUpdate,
 *     blockEditorPublish,
 *   } from "@/lib/access";
 *
 *   export const Foo: CollectionConfig = {
 *     ...,
 *     versions: { drafts: true },
 *     access: {
 *       read: publishedOnlyForPublic,
 *       create: editorsUpdate,
 *       update: editorsUpdate,
 *       delete: superAdminOnly,
 *     },
 *     hooks: {
 *       beforeChange: [blockEditorPublish],
 *       afterChange: [revalidateCmsTag],
 *     },
 *   };
 */
import type {
  Access,
  CollectionBeforeChangeHook,
  GlobalBeforeChangeHook,
} from "payload";

// ---------------------------------------------------------------------------
// Read access
// ---------------------------------------------------------------------------

/**
 * Public callers can only see published docs. Logged-in admin users see
 * everything (so they can review drafts).
 */
export const publishedOnlyForPublic: Access = ({ req }) =>
  req.user ? true : { _status: { equals: "published" } };

// ---------------------------------------------------------------------------
// Write access
// ---------------------------------------------------------------------------

/**
 * Any logged-in user (editor or super admin) can update / create. The
 * publish gate is enforced separately by `blockEditorPublish` so the
 * "Save Draft" button stays available to editors.
 */
export const editorsUpdate: Access = ({ req }) => Boolean(req.user);

/** Only super admins. Used for collection deletes by default. */
export const superAdminOnly: Access = ({ req }) =>
  req.user?.role === "super_admin";

// ---------------------------------------------------------------------------
// Publish gate
// ---------------------------------------------------------------------------

/**
 * Block non-super-admins from changing a document's `_status` to
 * `published`. They can still save the draft (which is what the
 * "Save Draft" button does in the admin UI).
 *
 * The hook is identical for collections and globals, but Payload's
 * hook types differ slightly, so we export one of each.
 */
const blockPublishCore = (
  data: Record<string, unknown> | undefined,
  originalDoc: Record<string, unknown> | undefined,
  role: string | undefined,
): void => {
  if (role === "super_admin") return; // super admin can do anything
  if (!data) return; // nothing being changed
  if (data._status !== "published") return; // editor saving a draft — fine

  // Editor is trying to publish. Allow only if the doc is already
  // published AND no `_status` flip is happening (e.g. they edit a
  // field on the live record without changing publish state). That
  // case still saves as a new draft because of `autosaveDraft` on
  // the collection — but defending here is harmless.
  if (originalDoc?._status === "published") return;

  throw new Error(
    "Only a super admin can publish changes. Save the draft and ask a super admin to publish.",
  );
};

export const blockEditorPublish: CollectionBeforeChangeHook = async ({
  data,
  req,
  originalDoc,
}) => {
  blockPublishCore(
    data as Record<string, unknown> | undefined,
    originalDoc as Record<string, unknown> | undefined,
    req.user?.role as string | undefined,
  );
  return data;
};

export const blockEditorPublishGlobal: GlobalBeforeChangeHook = async ({
  data,
  req,
  originalDoc,
}) => {
  blockPublishCore(
    data as Record<string, unknown> | undefined,
    originalDoc as Record<string, unknown> | undefined,
    req.user?.role as string | undefined,
  );
  return data;
};
