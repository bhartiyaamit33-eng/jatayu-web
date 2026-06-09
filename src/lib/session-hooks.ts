import type { CollectionAfterLoginHook } from "payload";

/**
 * Keep only the session created by this login. Lets the user sign in on a new
 * device without manually logging out elsewhere first.
 */
export const enforceSingleActiveSession: CollectionAfterLoginHook = async ({
  req,
  user,
}) => {
  const { auth } = req.payload.collections.users.config;
  if (!auth.useSessions) return user;

  const currentSid = (user as { _sid?: string })._sid;
  if (!currentSid || !user.sessions?.length) return user;

  const currentSession = user.sessions.find(
    (session: { id: string }) => session.id === currentSid,
  );
  if (!currentSession) return user;

  await req.payload.db.updateOne({
    id: user.id,
    collection: "users",
    data: {
      sessions: [currentSession],
      updatedAt: null,
    },
    req,
    returning: false,
  });

  return user;
};
