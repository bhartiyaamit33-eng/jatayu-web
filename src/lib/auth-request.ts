import "server-only";

import { createLocalReq } from "payload";
import { getPayloadClient } from "@/lib/payload";

/**
 * Resolve the logged-in Payload user from the incoming request cookies.
 * Uses the local Payload API — never round-trips through NEXT_PUBLIC_SITE_URL.
 */
export async function getAuthenticatedUser(
  request: Request,
  options?: { showHiddenFields?: boolean },
) {
  const payload = await getPayloadClient();
  const req = await createLocalReq({}, payload);

  const { user } = await payload.auth({
    headers: request.headers,
    req,
  });

  if (!user?.id) return null;

  return payload.findByID({
    collection: "users",
    id: user.id,
    overrideAccess: true,
    showHiddenFields: options?.showHiddenFields ?? false,
  });
}
