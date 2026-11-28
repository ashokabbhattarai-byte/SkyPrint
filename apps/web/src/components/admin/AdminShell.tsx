"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLink,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import type { AdminUser } from "@/types";
import { SkyPrintLogo } from "@/components/ui/SkyPrintLogo";
import { getQuoteRequests } from "@/lib/adminStore";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/quotes", label: "Quote Requests", icon: MessageSquareText },
  { href: "/admin/services", label: "Services", icon: Layers },
  { href: "/admin/showcase", label: "Showcase", icon: Sparkles },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

const emptySubscribe = () => () => {};

export function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const newQuotesCount = mounted
    ? getQuoteRequests().filter((q) => q.status === "New").length
    : 0;

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return (await res.json()) as { user: AdminUser };
      })
      .then((data) => {
        if (!cancelled) {
          setUser(data.user);
          setAuthChecked(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          router.replace("/admin/login");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  if (!mounted || !authChecked || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface-subtle text-body">
        <div className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface px-6 py-4 shadow-sm">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand" />
          <span className="text-sm font-semibold text-heading">
            Verifying admin session...
          </span>
        </div>
      </div>
    );
  }

  const navContent = (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* CMYK Hairline */}
        <div className="flex h-[3px] w-full" aria-hidden="true">
          <span className="flex-1 bg-brand" />
          <span className="w-10 bg-brand-cyan" />
          <span className="w-8 bg-brand-accent" />
          <span className="w-10 bg-brand-secondary" />
        </div>

        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <Link href="/admin" className="inline-flex items-center gap-2">
            <SkyPrintLogo variant="dark" />
          </Link>
          <span className="rounded bg-surface-subtle px-2 py-0.5 text-[11px] font-bold tracking-wider text-brand uppercase">
            Admin
          </span>
        </div>

        <nav aria-label="Admin navigation" className="space-y-1 px-3 py-4">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex min-h-[44px] items-center justify-between rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "bg-brand-action text-white shadow-xs"
                    : "text-heading/85 hover:bg-surface-subtle hover:text-brand"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      active ? "text-white" : "text-brand"
                    )}
                  />
                  <span>{item.label}</span>
                </span>
                {item.href === "/admin/quotes" && newQuotesCount > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums",
                      active
                        ? "bg-white text-brand-action"
                        : "bg-brand-accent text-surface-navy"
                    )}
                  >
                    {newQuotesCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border-subtle p-4 space-y-2.5">
        <div className="rounded-lg bg-surface-subtle px-3 py-2.5">
          <p className="text-xs font-bold text-heading">{user.name}</p>
          <p className="truncate text-xs text-body/70">{user.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-md border border-border-subtle bg-surface px-2.5 text-xs font-semibold text-heading transition-colors hover:border-brand hover:text-brand"
          >
            <span>Public Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-md border border-border-subtle bg-surface px-2.5 text-xs font-semibold text-heading transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-surface-subtle text-body lg:flex">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border-subtle bg-surface lg:block">
        <div className="sticky top-0 h-dvh overflow-y-auto">{navContent}</div>
      </aside>

      {/* Mobile Top Header */}
      <header className="sticky top-0 z-30 border-b border-border-subtle bg-surface lg:hidden">
        <div className="flex h-[3px] w-full" aria-hidden="true">
          <span className="flex-1 bg-brand" />
          <span className="w-16 bg-brand-cyan" />
          <span className="w-10 bg-brand-accent" />
        </div>
        <div className="flex items-center justify-between px-4 py-2.5">
          <Link href="/admin" className="inline-flex items-center gap-2">
            <SkyPrintLogo variant="dark" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open admin menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border-subtle text-heading"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-50 bg-surface-navy/50 backdrop-blur-xs lg:hidden"
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="relative h-full w-72 max-w-[85vw] bg-surface shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close admin menu"
                className="absolute top-3 right-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-md text-heading hover:bg-surface-subtle"
              >
                <X className="h-5 w-5" />
              </button>
              {navContent}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Workspace */}
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 border-b border-border-subtle pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-heading sm:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm text-body/75">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
