import { NextResponse } from "next/server";
import { generatePayloadCookie } from "payload/shared";
import { getPayloadClient } from "@/lib/payload";
import {
  createMfaChallengeToken,
  decryptSecret,
  readMfaChallengeToken,
  verifyTotpCode,
  verifyUserPassword,
} from "@/lib/mfa";

export async function POST(request: Request) {
  let body: {
    email?: string;
    password?: string;
    totpCode?: string;
    challengeToken?: string;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = String(body.email ?? "")
    .toLowerCase()
    .trim();
  const password = String(body.password ?? "");
  const totpCode = body.totpCode ? String(body.totpCode).trim() : undefined;
  const challengeToken = body.challengeToken
    ? String(body.challengeToken)
    : undefined;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  try {
    const payload = await getPayloadClient();
    const users = await payload.find({
      collection: "users",
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
      showHiddenFields: true,
    });

    const user = users.docs[0];
    if (
      !user ||
      !(await verifyUserPassword(user as Record<string, unknown>, password))
    ) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    if (user.mfaEnabled) {
      if (!totpCode) {
        if (challengeToken) {
          const challengeUserId = readMfaChallengeToken(challengeToken);
          if (challengeUserId !== String(user.id)) {
            return NextResponse.json(
              { error: "Invalid MFA challenge." },
              { status: 401 },
            );
          }
        }

        return NextResponse.json({
          requiresMfa: true,
          challengeToken: createMfaChallengeToken(user.id),
        });
      }

      if (!user.mfaSecret || typeof user.mfaSecret !== "string") {
        return NextResponse.json(
          { error: "MFA is misconfigured for this account." },
          { status: 500 },
        );
      }

      const secret = decryptSecret(user.mfaSecret);
      if (!verifyTotpCode(secret, totpCode)) {
        return NextResponse.json(
          { error: "Invalid authentication code." },
          { status: 401 },
        );
      }
    }

    const loginResult = await payload.login({
      collection: "users",
      data: { email, password },
      context: { mfaVerified: true },
    });

    if (!loginResult.token) {
      return NextResponse.json({ error: "Login failed." }, { status: 500 });
    }

    const cookie = generatePayloadCookie({
      collectionAuthConfig: payload.collections.users.config.auth,
      cookiePrefix: payload.config.cookiePrefix,
      token: loginResult.token,
    });

    const response = NextResponse.json({
      message: "passed",
      user: loginResult.user,
    });
    response.headers.set("Set-Cookie", cookie);
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to sign in right now.",
      },
      { status: 500 },
    );
  }
}
