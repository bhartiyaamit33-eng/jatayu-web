import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-request";
import { getPayloadClient } from "@/lib/payload";
import { decryptSecret, verifyTotpCode } from "@/lib/mfa";

export async function POST(request: Request) {
  let body: { code?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const code = String(body.code ?? "").trim();
  if (!code) {
    return NextResponse.json(
      { error: "Authentication code is required." },
      { status: 400 },
    );
  }

  try {
    const user = await getAuthenticatedUser(request, { showHiddenFields: true });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (!user.mfaSecret || typeof user.mfaSecret !== "string") {
      return NextResponse.json(
        { error: "Start MFA setup before activating." },
        { status: 400 },
      );
    }

    const secret = decryptSecret(user.mfaSecret);
    if (!verifyTotpCode(secret, code)) {
      return NextResponse.json(
        { error: "Invalid authentication code." },
        { status: 401 },
      );
    }

    const payload = await getPayloadClient();
    await payload.update({
      collection: "users",
      id: user.id,
      data: {
        mfaEnabled: true,
      },
      overrideAccess: true,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not enable MFA.",
      },
      { status: 500 },
    );
  }
}
