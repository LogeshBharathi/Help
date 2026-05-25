"use client";

import { useMemo, useState } from "react";

import {
  CATEGORY_CONFIG,
  type CategoryConfig,
} from "@/lib/categories";
import { COVERAGE_MODE_LABELS, EXAM_CATEGORIES, type ExamCategory } from "@/lib/constants";
import { cn } from "@/lib/cn";

interface ExamCoverageModalProps {
  category?: ExamCategory;
  triggerLabel?: string;
  className?: string;
}

export function ExamCoverageModal({
  category,
  triggerLabel = "View tab coverage",
  className,
}: ExamCoverageModalProps) {
  const [open, setOpen] = useState(false);

  const tabs = useMemo(() => {
    if (!category) return [...EXAM_CATEGORIES];
    return [category, ...EXAM_CATEGORIES.filter((tab) => tab !== category)];
  }, [category]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "rounded-full border border-white/18 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/14",
          className
        )}
      >
        {triggerLabel}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-hero-deep/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-[1.9rem] border border-white/12 bg-surface p-6 shadow-[0_35px_90px_rgba(9,26,48,0.32)] md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                  Tab Coverage
                </p>
                <h3 className="mt-2 font-serif-ui text-3xl font-semibold text-ink">
                  How the current tabs map to the founder exam tree
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Direct tabs map one-to-one to SSC exam families. Grouped tabs are
                  temporary rollups used during the extraction-first phase, so the
                  frontend can stay stable while you refine tagging and dedicated views.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted transition hover:border-hero-mid/25 hover:text-ink"
              >
                Close
              </button>
            </div>

            <div className="mt-6 max-h-[70vh] space-y-4 overflow-y-auto pr-1">
              {tabs.map((tab) => (
                <CoverageSection
                  key={tab}
                  tab={tab}
                  config={CATEGORY_CONFIG[tab]}
                  highlight={tab === category}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function CoverageSection({
  tab,
  config,
  highlight,
}: {
  tab: ExamCategory;
  config: CategoryConfig;
  highlight: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-[1.4rem] border border-line bg-surface-soft p-5",
        highlight && "border-hero-mid/30 bg-[#f6fbff]"
      )}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-hero-mid/15 bg-hero-deep px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
              {config.shortName}
            </span>
            <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {COVERAGE_MODE_LABELS[config.coverageMode]}
            </span>
            {highlight ? (
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Current tab
              </span>
            ) : null}
          </div>
          <h4 className="mt-3 font-serif-ui text-2xl font-semibold text-ink">
            {config.fullName}
          </h4>
          <p className="mt-2 text-sm leading-7 text-muted">{config.description}</p>
        </div>
        <div className="rounded-[1rem] border border-line bg-white px-4 py-3 text-sm text-muted">
          <p className="font-semibold text-ink">{config.examIds.length} SSC exam ids</p>
          <p className="mt-1">Verified source ids synced from the live SSC API.</p>
        </div>
      </div>

      {config.coverageNote ? (
        <div className="mt-4 rounded-[1rem] border border-dashed border-line bg-white px-4 py-3 text-sm leading-6 text-muted">
          {config.coverageNote}
        </div>
      ) : null}

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
          Official exam references under this tab
        </p>
        <div className="mt-3 space-y-3">
          {config.officialReferences.map((reference) => (
            <div
              key={`${tab}-${reference.shortLabel}`}
              className="rounded-[1rem] border border-line bg-white px-4 py-3"
            >
              <p className="text-sm font-semibold text-ink">{reference.fullLabel}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                {reference.shortLabel}
              </p>
              {reference.note ? (
                <p className="mt-2 text-sm leading-6 text-muted">{reference.note}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
