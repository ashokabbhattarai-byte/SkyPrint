"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Save, Trash2 } from "lucide-react";
import type { PortfolioItem } from "@/types";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminPortfolio, saveAdminPortfolio } from "@/lib/adminStore";

const CATEGORIES: PortfolioItem["category"][] = [
  "Large Format & Flex",
  "Print & Stationery",
  "Signboards & LED",
  "Packaging",
  "Promotional",
];

export default function AdminShowcasePage() {
  const [items, setItems] = useState<PortfolioItem[]>(() => getAdminPortfolio());
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [savedMsg, setSavedMsg] = useState("");

  const startNew = () => {
    setEditing({
      id: `proof-${Date.now()}`,
      title: "",
      category: "Large Format & Flex",
      image: "/images/studio-press.webp",
      finishSpec: "",
      dimensions: "",
      description: "",
      isRepresentativeSample: true,
    });
    setSavedMsg("");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const exists = items.some((i) => i.id === editing.id);
    const next = exists
      ? items.map((i) => (i.id === editing.id ? editing : i))
      : [editing, ...items];
    setItems(saveAdminPortfolio(next));
    setEditing(null);
    setSavedMsg("Showcase proof saved.");
  };

  const handleDelete = (id: string) => {
    setItems(saveAdminPortfolio(items.filter((i) => i.id !== id)));
    if (editing?.id === id) setEditing(null);
  };

  return (
    <AdminShell
      title="Showcase & Proofs"
      subtitle="Manage representative work proofs shown on the Selected Showcase and Work pages."
      actions={
        <button
          type="button"
          onClick={startNew}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-brand-action px-4 py-2 text-sm font-semibold text-white hover:bg-brand-secondary"
        >
          <Plus className="h-4 w-4" />
          <span>Add Proof</span>
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
            {items.some((i) => i.id === editing.id)
              ? "Edit Showcase Proof"
              : "New Showcase Proof"}
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-heading">
                Title
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
                Category
              </label>
              <select
                value={editing.category}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    category: e.target.value as PortfolioItem["category"],
                  })
                }
                className="min-h-[44px] w-full rounded-md border border-border-subtle bg-surface-subtle px-3 py-2 text-base text-body sm:text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-heading">
                Finish Specification
              </label>
              <input
                type="text"
                required
                value={editing.finishSpec}
                onChange={(e) =>
                  setEditing({ ...editing, finishSpec: e.target.value })
                }
                className="min-h-[44px] w-full rounded-md border border-border-subtle bg-surface-subtle px-3 py-2 text-base text-body sm:text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-heading">
                Dimensions / Scale
              </label>
              <input
                type="text"
                required
                value={editing.dimensions}
                onChange={(e) =>
                  setEditing({ ...editing, dimensions: e.target.value })
                }
                className="min-h-[44px] w-full rounded-md border border-border-subtle bg-surface-subtle px-3 py-2 text-base text-body sm:text-sm"
              />
            </div>
            <div className="sm:col-span-2">
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
            <div className="sm:col-span-2">
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
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-brand-action px-5 py-2 text-sm font-semibold text-white hover:bg-brand-secondary"
            >
              <Save className="h-4 w-4" />
              <span>Save Proof</span>
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface"
          >
            <div className="relative aspect-[16/10] w-full bg-slate-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-4">
              <div>
                <span className="text-[11px] font-bold text-brand uppercase">
                  {item.category}
                </span>
                <h3 className="mt-1 font-display text-base font-bold text-heading">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-body/70">{item.finishSpec}</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3">
                <button
                  type="button"
                  onClick={() => setEditing({ ...item })}
                  className="inline-flex min-h-[40px] items-center rounded-md bg-surface-subtle px-3 text-xs font-semibold text-heading hover:bg-brand hover:text-white"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  aria-label={`Delete ${item.title}`}
                  className="inline-flex min-h-[40px] items-center gap-1 px-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
