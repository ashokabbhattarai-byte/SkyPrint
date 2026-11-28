"use client";

import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import type { ServiceCategory } from "@/types";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminServices, saveAdminServices } from "@/lib/adminStore";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceCategory[]>(() =>
    getAdminServices()
  );
  const [editing, setEditing] = useState<ServiceCategory | null>(null);
  const [itemsText, setItemsText] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  const startEdit = (service: ServiceCategory) => {
    setEditing({ ...service });
    setItemsText(service.items.join(", "));
    setSavedMsg("");
  };

  const startNew = () => {
    const nextNum = String(services.length + 1).padStart(2, "0");
    setEditing({
      id: `service-${Date.now()}`,
      number: nextNum,
      title: "",
      tagline: "",
      description: "",
      image: "/images/studio-press.webp",
      accent: "blue",
      layoutVariant: "wide",
      items: [],
    });
    setItemsText("");
    setSavedMsg("");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const parsedItems = itemsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedItem: ServiceCategory = {
      ...editing,
      items: parsedItems,
    };

    const exists = services.some((s) => s.id === updatedItem.id);
    const next = exists
      ? services.map((s) => (s.id === updatedItem.id ? updatedItem : s))
      : [...services, updatedItem];

    setServices(saveAdminServices(next));
    setEditing(null);
    setSavedMsg("Service department saved.");
  };

  const handleDelete = (id: string) => {
    const next = services.filter((s) => s.id !== id);
    setServices(saveAdminServices(next));
    if (editing?.id === id) setEditing(null);
  };

  return (
    <AdminShell
      title="Services & Products"
      subtitle="Manage production departments and product lists displayed on the public website."
      actions={
        <button
          type="button"
          onClick={startNew}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-brand-action px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary"
        >
          <Plus className="h-4 w-4" />
          <span>Add Department</span>
        </button>
      }
    >
      {savedMsg && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-800">
          {savedMsg}
        </div>
      )}

      {editing && (
        <form
          onSubmit={handleSave}
          className="mb-6 rounded-xl border border-brand/30 bg-surface p-5 shadow-sm sm:p-6"
        >
          <h2 className="font-display text-lg font-bold text-heading">
            {services.some((s) => s.id === editing.id)
              ? `Edit ${editing.title}`
              : "New Service Department"}
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-heading">
                Department Number
              </label>
              <input
                type="text"
                required
                value={editing.number}
                onChange={(e) => setEditing({ ...editing, number: e.target.value })}
                className="min-h-[44px] w-full rounded-md border border-border-subtle bg-surface-subtle px-3 py-2 text-base text-body sm:text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-heading">
                Department Title
              </label>
              <input
                type="text"
                required
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="min-h-[44px] w-full rounded-md border border-border-subtle bg-surface-subtle px-3 py-2 text-base text-body sm:text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-heading">
                Tagline
              </label>
              <input
                type="text"
                required
                value={editing.tagline}
                onChange={(e) => setEditing({ ...editing, tagline: e.target.value })}
                className="min-h-[44px] w-full rounded-md border border-border-subtle bg-surface-subtle px-3 py-2 text-base text-body sm:text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-heading">
                Image Path / URL
              </label>
              <input
                type="text"
                required
                value={editing.image}
                onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                className="min-h-[44px] w-full rounded-md border border-border-subtle bg-surface-subtle px-3 py-2 text-base text-body sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-xs font-semibold text-heading">
              Description
            </label>
            <textarea
              rows={2}
              required
              value={editing.description}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
              className="w-full rounded-md border border-border-subtle bg-surface-subtle px-3 py-2 text-base text-body sm:text-sm"
            />
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-xs font-semibold text-heading">
              Products / Items (comma-separated)
            </label>
            <textarea
              rows={2}
              value={itemsText}
              onChange={(e) => setItemsText(e.target.value)}
              placeholder="Visiting Cards, Letterheads, Brochures..."
              className="w-full rounded-md border border-border-subtle bg-surface-subtle px-3 py-2 text-base text-body sm:text-sm"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-brand-action px-5 py-2 text-sm font-semibold text-white hover:bg-brand-secondary"
            >
              <Save className="h-4 w-4" />
              <span>Save Department</span>
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="inline-flex min-h-[44px] items-center rounded-md border border-border-subtle bg-surface px-4 py-2 text-sm font-semibold text-heading"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {services.map((s) => (
          <article
            key={s.id}
            className="flex flex-col justify-between rounded-xl border border-border-subtle bg-surface p-5"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-brand uppercase">
                  Dept {s.number} · {s.items.length} items
                </span>
              </div>
              <h3 className="mt-1 font-display text-lg font-bold text-heading">
                {s.title}
              </h3>
              <p className="text-xs font-medium text-body/70">{s.tagline}</p>
              <p className="mt-2 line-clamp-2 text-sm text-body/80">
                {s.description}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 border-t border-border-subtle pt-3.5">
              <button
                type="button"
                onClick={() => startEdit(s)}
                className="inline-flex min-h-[40px] items-center rounded-md bg-surface-subtle px-3.5 text-xs font-semibold text-heading hover:bg-brand hover:text-white"
              >
                Edit Department
              </button>
              <button
                type="button"
                onClick={() => handleDelete(s.id)}
                aria-label={`Delete ${s.title}`}
                className="inline-flex min-h-[40px] items-center gap-1 rounded-md px-3 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
