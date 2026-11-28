"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import type { SiteSettings } from "@/types";
import { AdminShell } from "@/components/admin/AdminShell";
import { getSiteSettings, saveSiteSettings } from "@/lib/adminStore";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(() => getSiteSettings());
  const [savedMsg, setSavedMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSiteSettings(settings);
    setSavedMsg("Site settings saved.");
  };

  return (
    <AdminShell
      title="Site Settings"
      subtitle="Configure company contact details, Google Maps link, and hero copy for the public website."
    >
      {savedMsg && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-800">
          {savedMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border-subtle bg-surface p-5 shadow-xs sm:p-8"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-heading">
              Company Name
            </label>
            <input
              type="text"
              required
              value={settings.companyName}
              onChange={(e) =>
                setSettings({ ...settings, companyName: e.target.value })
              }
              className="min-h-[44px] w-full rounded-md border border-border-subtle bg-surface-subtle px-3.5 py-2 text-base text-body sm:text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-heading">
              Tagline
            </label>
            <input
              type="text"
              required
              value={settings.tagline}
              onChange={(e) =>
                setSettings({ ...settings, tagline: e.target.value })
              }
              className="min-h-[44px] w-full rounded-md border border-border-subtle bg-surface-subtle px-3.5 py-2 text-base text-body sm:text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-heading">
              Office Phone
            </label>
            <input
              type="text"
              required
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="min-h-[44px] w-full rounded-md border border-border-subtle bg-surface-subtle px-3.5 py-2 text-base text-body sm:text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-heading">
              Primary Mobile / WhatsApp
            </label>
            <input
              type="text"
              required
              value={settings.mobilePrimary}
              onChange={(e) =>
                setSettings({ ...settings, mobilePrimary: e.target.value })
              }
              className="min-h-[44px] w-full rounded-md border border-border-subtle bg-surface-subtle px-3.5 py-2 text-base text-body sm:text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-heading">
              Secondary Mobile
            </label>
            <input
              type="text"
              value={settings.mobileSecondary}
              onChange={(e) =>
                setSettings({ ...settings, mobileSecondary: e.target.value })
              }
              className="min-h-[44px] w-full rounded-md border border-border-subtle bg-surface-subtle px-3.5 py-2 text-base text-body sm:text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-heading">
              Email Address
            </label>
            <input
              type="email"
              required
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="min-h-[44px] w-full rounded-md border border-border-subtle bg-surface-subtle px-3.5 py-2 text-base text-body sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-heading">
              Full Studio Address
            </label>
            <input
              type="text"
              required
              value={settings.fullAddress}
              onChange={(e) =>
                setSettings({ ...settings, fullAddress: e.target.value })
              }
              className="min-h-[44px] w-full rounded-md border border-border-subtle bg-surface-subtle px-3.5 py-2 text-base text-body sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-heading">
              Google Maps Directions URL
            </label>
            <input
              type="url"
              required
              value={settings.googleMapsUrl}
              onChange={(e) =>
                setSettings({ ...settings, googleMapsUrl: e.target.value })
              }
              className="min-h-[44px] w-full rounded-md border border-border-subtle bg-surface-subtle px-3.5 py-2 text-base text-body sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-heading">
              Hero Headline
            </label>
            <input
              type="text"
              required
              value={settings.heroTitle}
              onChange={(e) =>
                setSettings({ ...settings, heroTitle: e.target.value })
              }
              className="min-h-[44px] w-full rounded-md border border-border-subtle bg-surface-subtle px-3.5 py-2 text-base text-body sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-heading">
              Hero Subtitle
            </label>
            <textarea
              rows={2}
              required
              value={settings.heroSubtitle}
              onChange={(e) =>
                setSettings({ ...settings, heroSubtitle: e.target.value })
              }
              className="w-full rounded-md border border-border-subtle bg-surface-subtle px-3.5 py-2 text-base text-body sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-border-subtle pt-5">
          <button
            type="submit"
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-md bg-brand-action px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary sm:w-auto"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
