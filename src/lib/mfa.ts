import crypto from "crypto";
import { generateSecret, generateURI, verifySync } from "otplib";

const APP_NAME = "Jatayu CMS";
const CHALLENGE_TTL_MS = 5 * 60 * 1000;

function getEncryptionKey(): Buffer {
  const secret = process.env.PAYLOAD_SECRET ?? "dev-secret-change-me-in-prod";
  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptSecret(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptSecret(payload: string): string {
  const [ivHex, tagHex, dataHex] = payload.split(":");
  if (!ivHex || !tagHex || !dataHex) {
    throw new Error("Invalid MFA secret payload");
  }
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(ivHex, "hex"),
  );
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

export function createTotpSecret(): string {
  return generateSecret();
}

export function getTotpUri(email: string, secret: string): string {
  return generateURI({
    issuer: APP_NAME,
    label: email,
    secret,
  });
}

export function verifyTotpCode(secret: string, token: string): boolean {
  try {
    return verifySync({ secret, token }).valid;
  } catch {
    return false;
  }
}

export function createMfaChallengeToken(userId: string | number): string {
  const payload = JSON.stringify({
    sub: String(userId),
    exp: Date.now() + CHALLENGE_TTL_MS,
  });
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(payload, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function readMfaChallengeToken(token: string): string | null {
  try {
    const [ivHex, tagHex, dataHex] = token.split(":");
    if (!ivHex || !tagHex || !dataHex) return null;
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      getEncryptionKey(),
      Buffer.from(ivHex, "hex"),
    );
    decipher.setAuthTag(Buffer.from(tagHex, "hex"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(dataHex, "hex")),
      decipher.final(),
    ]).toString("utf8");
    const parsed = JSON.parse(decrypted) as { sub?: string; exp?: number };
    if (!parsed.sub || !parsed.exp || parsed.exp < Date.now()) return null;
    return parsed.sub;
  } catch {
    return null;
  }
}

export async function verifyUserPassword(
  user: Record<string, unknown>,
  password: string,
): Promise<boolean> {
  const { hash, salt } = user;
  if (typeof salt !== "string" || typeof hash !== "string") return false;

  return new Promise((resolve) => {
    crypto.pbkdf2(password, salt, 25000, 512, "sha256", (error, hashBuffer) => {
      if (error) {
        resolve(false);
        return;
      }
      const storedHashBuffer = Buffer.from(hash, "hex");
      resolve(
        hashBuffer.length === storedHashBuffer.length &&
          crypto.timingSafeEqual(hashBuffer, storedHashBuffer),
      );
    });
  });
}
