import Link from "next/link";

import type { CategoryConfig } from "@/lib/categories";
import { COVERAGE_MODE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/cn";

interface ExamCategoryCardProps {
  config: CategoryConfig;
  animationDelayMs: number;
}

export function ExamCategoryCard({ config, animationDelayMs }: ExamCategoryCardProps) {
  const visibleReferences = config.officialReferences.slice(0, 2);
  const hiddenCount = Math.max(0, config.officialReferences.length - visibleReferences.length);

  return (
    <Link
      href={`/exam/${config.shortName}`}
      className={cn(
        "group relative overflow-hidden rounded-[1.8rem] border border-line bg-surface/95 p-6 shadow-panel transition duration-300 hover:-translate-y-1 hover:border-hero-mid/30"
      )}
      style={{ animationDelay: `${animationDelayMs}ms` }}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-hero-deep via-hero-mid to-accent" />

      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="rounded-full border border-hero-mid/20 bg-hero-deep px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
          {config.shortName}
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.24em] text-muted">
          {COVERAGE_MODE_LABELS[config.coverageMode]}
        </span>
      </div>

      <h3 className="font-serif-ui text-2xl font-semibold leading-tight text-ink">
        {config.fullName}
      </h3>
      <p className="mt-3 max-w-[28ch] text-sm leading-6 text-muted">{config.description}</p>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
          Maps to
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {visibleReferences.map((reference) => (
            <span
              key={`${config.shortName}-${reference.shortLabel}`}
              className="rounded-full border border-line bg-surface-soft px-3 py-1 text-xs font-semibold text-muted"
            >
              {reference.shortLabel}
            </span>
          ))}
          {hiddenCount > 0 ? (
            <span className="rounded-full border border-line bg-surface-soft px-3 py-1 text-xs font-semibold text-muted">
              +{hiddenCount} more
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-line pt-4 text-sm">
        <span className="text-muted">
          {config.examIds.length} SSC id{config.examIds.length === 1 ? "" : "s"}
        </span>
        <span className="font-semibold text-accent transition group-hover:text-accent-strong">
          Open
        </span>
      </div>
    </Link>
  );
}
