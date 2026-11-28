"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { SkyPrintLogo } from "@/components/ui/SkyPrintLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Invalid email or password.");
        setSubmitting(false);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to reach authentication server. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col justify-between bg-surface-subtle px-4 py-8 text-body sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center gap-2 text-xs font-semibold text-brand hover:text-heading"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Public Website</span>
        </Link>
      </div>

      <main className="mx-auto my-8 w-full max-w-md overflow-hidden rounded-xl border border-border-subtle bg-surface shadow-[0_24px_60px_-24px_rgba(21,59,96,0.28)]">
        {/* CMYK top hairline */}
        <div className="flex h-1 w-full" aria-hidden="true">
          <span className="flex-1 bg-brand" />
          <span className="w-20 bg-brand-cyan" />
          <span className="w-14 bg-brand-accent" />
          <span className="w-16 bg-brand-secondary" />
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <SkyPrintLogo variant="dark" />
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-subtle px-2.5 py-1 text-[11px] font-bold tracking-wider text-heading uppercase">
              <Lock className="h-3 w-3 text-brand-accent" />
              Admin Portal
            </span>
          </div>

          <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-heading">
            Sign in to Sky Print Admin
          </h1>
          <p className="mt-1.5 text-sm text-body/75">
            Restricted access. Sign in with your administrator email and password
            to manage quotes, services, showcase proofs, and gallery media.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-xs font-semibold text-heading"
              >
                Admin Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@skyprint.com.np"
                  className="min-h-[44px] w-full rounded-md border border-slate-300 bg-surface-subtle py-2.5 pr-3.5 pl-10 text-base text-body placeholder:text-slate-400 outline-none transition focus:border-brand focus:bg-surface sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-xs font-semibold text-heading"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="min-h-[44px] w-full rounded-md border border-slate-300 bg-surface-subtle py-2.5 pr-12 pl-10 text-base text-body placeholder:text-slate-400 outline-none transition focus:border-brand focus:bg-surface sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-1 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 hover:text-heading"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex min-h-[48px] w-full items-center justify-center rounded-md bg-brand-action px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Studio Preview Credentials (replaced by NestJS /auth/login in production) */}
          <div className="mt-6 rounded-lg border border-border-subtle bg-surface-subtle p-3.5 text-xs text-body/80">
            <p className="font-semibold text-heading">Preview Login Credentials</p>
            <p className="mt-1">
              Email: <code className="font-mono text-brand">admin@skyprint.com.np</code>
            </p>
            <p>
              Password: <code className="font-mono text-brand">SkyPrint@2026</code>
            </p>
          </div>
        </div>
      </main>

      <p className="text-center text-xs text-body/60">
        Sky Print &amp; Advertising Pvt. Ltd. · Birtamode, Jhapa
      </p>
    </div>
  );
}
