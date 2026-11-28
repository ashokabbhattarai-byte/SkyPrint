import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as crypto from "node:crypto";
import type { AdminUser } from "@skyprint/shared";

export const ADMIN_COOKIE_NAME = "skyprint_admin_token";
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

interface TokenPayload {
  email: string;
  name: string;
  role: "Admin";
  exp: number;
}

@Injectable()
export class AuthService {
  private readonly secret =
    process.env.AUTH_SECRET || "skyprint-birtamode-dev-secret-change-in-prod";

  private readonly adminEmail = (
    process.env.ADMIN_EMAIL || "admin@skyprint.com.np"
  ).toLowerCase();

  private readonly passwordSalt = "skyprint-scrypt-salt-v1";
  private readonly expectedPasswordHash: Buffer;

  constructor() {
    const rawPassword = process.env.ADMIN_PASSWORD || "SkyPrint@2026";
    this.expectedPasswordHash = crypto.scryptSync(
      rawPassword,
      this.passwordSalt,
      64
    );
  }

  validateCredentials(email: string, password: string): AdminUser {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== this.adminEmail) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const candidateHash = crypto.scryptSync(
      password,
      this.passwordSalt,
      64
    );
    if (!crypto.timingSafeEqual(candidateHash, this.expectedPasswordHash)) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    return {
      email: this.adminEmail,
      name: "Sky Print Admin",
      role: "Admin",
    };
  }

  signToken(user: AdminUser): string {
    const payload: TokenPayload = {
      ...user,
      exp: Date.now() + TOKEN_TTL_MS,
    };
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const sig = crypto
      .createHmac("sha256", this.secret)
      .update(encoded)
      .digest("base64url");
    return `${encoded}.${sig}`;
  }

  verifyToken(token: string | undefined): AdminUser | null {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [encoded, sig] = parts;

    const expectedSig = crypto
      .createHmac("sha256", this.secret)
      .update(encoded)
      .digest("base64url");

    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (
      sigBuf.length !== expectedBuf.length ||
      !crypto.timingSafeEqual(sigBuf, expectedBuf)
    ) {
      return null;
    }

    try {
      const payload = JSON.parse(
        Buffer.from(encoded, "base64url").toString("utf-8")
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
}
