"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";

import type { NoticeRecord } from "@/lib/types";
import { cn } from "@/lib/cn";

interface NoticeContentModalProps {
  notice: NoticeRecord | null;
  onClose: () => void;
}

type ContentTab = "pdf" | "text";

async function fetchContent(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Unable to load notice content.");
  }
  return response.json();
}

export function NoticeContentModal({ notice, onClose }: NoticeContentModalProps) {
  const [tab, setTab] = useState<ContentTab>("pdf");

  const { data, error, isLoading } = useSWR(
    notice ? `/api/notices/${notice.id}/content` : null,
    fetchContent,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    setTab("pdf");
  }, [notice?.id]);

  useEffect(() => {
    if (!notice) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [notice, onClose]);

  if (!notice) return null;

  const primaryTag = data?.userPrimaryTag ?? notice.userPrimaryTag;
  const tags = primaryTag
    ? [primaryTag, ...(data?.autoTags ?? notice.autoTags).filter((tag: string) => tag !== primaryTag)]
    : data?.autoTags ?? notice.autoTags;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-hero-deep/60 p-4 backdrop-blur-sm">
      <div className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[1.8rem] border border-white/12 bg-surface shadow-[0_35px_90px_rgba(9,26,48,0.32)]">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              Notice Document
            </p>
            <h3 className="mt-2 font-serif-ui text-2xl font-semibold text-ink">{notice.title}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag: string, index: number) => (
                <span
                  key={`${notice.id}-${tag}`}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
                    primaryTag && index === 0
                      ? "bg-hero-deep text-white"
                      : "border border-hero-mid/15 bg-[#eef5fb] text-hero-deep"
                  )}
                >
                  {tag}
                </span>
              ))}
              {data?.pageCount ? (
                <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  {data.pageCount} page{data.pageCount === 1 ? "" : "s"}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={notice.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-hero-mid/20 bg-surface-soft px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-hero-mid/40"
            >
              Open in new tab
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-muted transition hover:border-hero-mid/30 hover:text-ink"
            >
              Close
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 border-b border-line px-6 py-3">
          {(
            [
              { id: "pdf" as const, label: "PDF View" },
              { id: "text" as const, label: "Extracted Text" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                tab === item.id
                  ? "bg-hero-deep text-white"
                  : "border border-line bg-surface-soft text-ink hover:border-hero-mid/30"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto bg-[#f8f6ef] p-4 md:p-6">
          {tab === "pdf" ? (
            <div className="h-full overflow-hidden rounded-[1.2rem] border border-line bg-white">
              <iframe
                title={notice.title}
                src={notice.pdfUrl}
                className="h-full min-h-[65vh] w-full"
              />
            </div>
          ) : null}

          {tab === "text" ? (
            <div className="rounded-[1.2rem] border border-line bg-white p-5">
              <div className="rounded-[1rem] border border-dashed border-line bg-surface-soft px-4 py-3 text-sm leading-6 text-muted">
                This is the raw extracted text layer for search and copy support. The exact
                visual document is the PDF view tab above.
              </div>

              {isLoading ? (
                <div className="mt-5 space-y-3">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-11/12 animate-pulse rounded bg-slate-200" />
                </div>
              ) : null}

              {error ? (
                <p className="mt-5 text-sm font-medium text-red-700">{error.message}</p>
              ) : null}

              {!isLoading && !error ? (
                <pre className="mt-5 overflow-x-auto whitespace-pre-wrap rounded-[1rem] border border-line bg-surface-soft p-4 text-sm leading-7 text-ink">
                  {data?.pdfText?.trim()
                    ? data.pdfText
                    : "PDF text has not been extracted yet. Refresh this notice shortly."}
                </pre>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
