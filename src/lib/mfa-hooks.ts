import type { CollectionBeforeLoginHook } from "payload";
import { AuthenticationError } from "payload";

export const requireMfaVerification: CollectionBeforeLoginHook = async ({
  req,
  user,
}) => {
  if (user.mfaEnabled && !req.context?.mfaVerified) {
    throw new AuthenticationError(req.t);
  }
  return user;
};
