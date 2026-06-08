import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getAuthenticatedUser } from "@/lib/auth-request";
import { getPayloadClient } from "@/lib/payload";
import {
  createTotpSecret,
  encryptSecret,
  getTotpUri,
} from "@/lib/mfa";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (user.mfaEnabled) {
      return NextResponse.json(
        { error: "MFA is already enabled on this account." },
        { status: 400 },
      );
    }

    const secret = createTotpSecret();
    const payload = await getPayloadClient();

    await payload.update({
      collection: "users",
      id: user.id,
      context: { allowMfaSecretWrite: true },
      data: {
        mfaSecret: encryptSecret(secret),
      },
      overrideAccess: true,
    });

    const otpauth = getTotpUri(String(user.email), secret);
    const qrCode = await QRCode.toDataURL(otpauth);

    return NextResponse.json({ qrCode });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not start MFA enrollment.",
      },
      { status: 500 },
    );
  }
}
