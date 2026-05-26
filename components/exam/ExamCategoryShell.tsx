"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import { CategoryEligibilityPanel } from "@/components/eligibility/CategoryEligibilityPanel";
import { NoticeBoard } from "@/components/exam/NoticeBoard";
import type { ExamCategory } from "@/lib/constants";
import { cn } from "@/lib/cn";

type ExamView = "notices" | "eligibility";

interface ExamCategoryShellProps {
  category: ExamCategory;
}

export function ExamCategoryShell({ category }: ExamCategoryShellProps) {
  const searchParams = useSearchParams();
  const initialView =
    searchParams.get("view") === "eligibility" ? "eligibility" : "notices";
  const [view, setView] = useState<ExamView>(initialView);

  const setViewAndUrl = useCallback((next: ExamView) => {
    setView(next);
    const url = new URL(window.location.href);
    if (next === "eligibility") {
      url.searchParams.set("view", "eligibility");
    } else {
      url.searchParams.delete("view");
    }
    window.history.replaceState({}, "", url.toString());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-line pb-1">
        <button
          type="button"
          onClick={() => setViewAndUrl("notices")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition",
            view === "notices"
              ? "bg-hero-deep text-white"
              : "border border-line bg-surface-soft text-muted hover:text-ink"
          )}
        >
          Official notices
        </button>
        <button
          type="button"
          onClick={() => setViewAndUrl("eligibility")}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
            view === "eligibility"
              ? "bg-[#D95F2A] text-white"
              : "border border-line bg-surface-soft text-muted hover:text-ink"
          )}
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Eligibility
        </button>
      </div>

      {view === "notices" ? <NoticeBoard category={category} /> : null}
      {view === "eligibility" ? <CategoryEligibilityPanel category={category} /> : null}
    </div>
  );
}
