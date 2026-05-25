"use client";

import { useEffect, useState, useTransition } from "react";

import { NOTICE_TYPES } from "@/lib/constants";
import type { NoticeRecord } from "@/lib/types";

interface TagModalProps {
  notice: NoticeRecord | null;
  onClose: () => void;
  onSaved: () => void;
}

export function TagModal({ notice, onClose, onSaved }: TagModalProps) {
  const [tag, setTag] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setTag(notice?.userPrimaryTag ?? "");
    setError(null);
  }, [notice]);

  useEffect(() => {
    if (!notice) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [notice, onClose, pending]);

  if (!notice) return null;

  function handleSave() {
    if (!notice) return;

    if (!tag) {
      setError("Choose a notice type before saving.");
      return;
    }

    const noticeId = notice.id;

    startTransition(async () => {
      try {
        const response = await fetch("/api/tags", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ noticeId, tag }),
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error ?? "Unable to save tag.");
        }

        onSaved();
        onClose();
      } catch (saveError) {
        setError(saveError instanceof Error ? saveError.message : "Unable to save tag.");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-hero-deep/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[1.8rem] border border-white/20 bg-surface p-6 shadow-[0_30px_80px_rgba(9,26,48,0.28)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Notice Type</p>
        <h3 className="mt-2 font-serif-ui text-2xl font-semibold text-ink">{notice.title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted">
          Set the primary notice type used for client-side filtering.
        </p>

        <select
          value={tag}
          onChange={(event) => setTag(event.target.value)}
          className="mt-5 w-full rounded-[1rem] border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-hero-mid focus:ring-2 focus:ring-hero-mid/15"
        >
          <option value="">Select a type</option>
          {NOTICE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {error ? <p className="mt-3 text-sm font-medium text-red-700">{error}</p> : null}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-muted transition hover:border-hero-mid/30 hover:text-ink disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="rounded-full bg-hero-deep px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-hero-mid disabled:opacity-60"
          >
            {pending ? "Saving..." : "Save Tag"}
          </button>
        </div>
      </div>
    </div>
  );
}
