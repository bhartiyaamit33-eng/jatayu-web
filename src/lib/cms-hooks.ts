/**
 * Cache-invalidation hook for Payload globals and collections.
 *
 * Every reader in lib/cms.ts is wrapped in next/cache's `unstable_cache`
 * with the shared tag `"cms"`. When an editor saves anything in /admin the
 * DB updates immediately but those cached reads stay stale until either
 * a container restart or an explicit revalidateTag call.
 *
 * Attaching `revalidateCmsTag` as a Payload `afterChange` (and `afterDelete`
 * for collections) hook closes that loop: the moment Payload writes, the
 * Next cache is invalidated and the next public request reads fresh data.
 *
 * We swallow errors so a Next runtime hiccup never blocks a save — a stale
 * page is recoverable, a failed save is not.
 */
import { revalidateTag } from "next/cache";

/** Single shared tag — every CMS reader carries it, so one call clears all. */
export const CMS_TAG = "cms";

export const revalidateCmsTag = () => {
  try {
    revalidateTag(CMS_TAG);
  } catch (err) {
    // Hooks can fire from contexts that aren't a Next request (e.g. a
    // payload migrate run from the CLI). revalidateTag throws there.
    // We don't care — the cache is per-process, so a CLI invocation has
    // no cache to invalidate anyway.
    console.warn("[cms-hooks] revalidateTag failed (safe to ignore outside a request):", (err as Error).message);
  }
};
