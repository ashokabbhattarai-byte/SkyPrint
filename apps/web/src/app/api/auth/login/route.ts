import { NextResponse } from "next/server";
import * as crypto from "node:crypto";
import type { AdminUser } from "@skyprint/shared";
import { ADMIN_COOKIE_NAME, signAdminToken } from "@/lib/serverAuth";

const API_URL = process.env.API_INTERNAL_URL || "http://localhost:4000/api";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Please enter both email and password." },
      { status: 400 }
    );
  }

  let user: AdminUser | null = null;
  let token: string | null = null;

  // 1. Authenticate against NestJS backend when running
  try {
    const apiRes = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    if (apiRes.ok) {
      const data = (await apiRes.json()) as { user: AdminUser; token: string };
      user = data.user;
      token = data.token;
    } else if (apiRes.status === 401 || apiRes.status === 400) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }
  } catch {
    // NestJS API offline: fall back to server-side scrypt check in Next.js
  }

  // 2. Server-side scrypt fallback when Next.js runs standalone
  if (!user || !token) {
    const expectedEmail = (
      process.env.ADMIN_EMAIL || "admin@skyprint.com.np"
    ).toLowerCase();
    const expectedPassword = process.env.ADMIN_PASSWORD || "SkyPrint@2026";
    const salt = "skyprint-scrypt-salt-v1";
    const expectedHash = crypto.scryptSync(expectedPassword, salt, 64);
    const candidateHash = crypto.scryptSync(password, salt, 64);

    if (
      email !== expectedEmail ||
      !crypto.timingSafeEqual(candidateHash, expectedHash)
    ) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    user = { email: expectedEmail, name: "Sky Print Admin", role: "Admin" };
    token = await signAdminToken(user);
  }

  const res = NextResponse.json({ user });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
  return res;
}
