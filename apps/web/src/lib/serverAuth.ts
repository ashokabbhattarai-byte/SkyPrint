import type { AdminUser } from "@skyprint/shared";

export const ADMIN_COOKIE_NAME = "skyprint_admin_token";
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

interface TokenPayload extends AdminUser {
  exp: number;
}

function getSecret(): string {
  return (
    process.env.AUTH_SECRET || "skyprint-birtamode-dev-secret-change-in-prod"
  );
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/") +
    "=".repeat((4 - (str.length % 4)) % 4);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signAdminToken(user: AdminUser): Promise<string> {
  const payload: TokenPayload = {
    ...user,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const encoded = toBase64Url(
    new TextEncoder().encode(JSON.stringify(payload))
  );
  const key = await importHmacKey(getSecret());
  const sigBuf = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(encoded)
  );
  return `${encoded}.${toBase64Url(new Uint8Array(sigBuf))}`;
}

export async function verifyAdminToken(
  token: string | undefined
): Promise<AdminUser | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encoded, sig] = parts;

  try {
    const key = await importHmacKey(getSecret());
    const sigBytes = fromBase64Url(sig);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes.buffer as ArrayBuffer,
      new TextEncoder().encode(encoded)
    );
    if (!valid) return null;

    const payload = JSON.parse(
      new TextDecoder().decode(fromBase64Url(encoded))
    ) as TokenPayload;

    if (!payload.exp || payload.exp < Date.now()) {
      return null;
    }

    return {
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
