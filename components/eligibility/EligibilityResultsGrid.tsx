"use client";

import Link from "next/link";

import { EligibilityBadge } from "@/components/eligibility/EligibilityBadge";
import { evaluateAllExams } from "@/lib/eligibility/evaluate";
import { useEligibilityProfile } from "@/lib/hooks/useEligibilityProfile";

export function EligibilityResultsGrid() {
  const { profile, hasProfile } = useEligibilityProfile();
  const results = evaluateAllExams(profile);

  if (!hasProfile) {
    return (
      <p className="rounded-[1rem] border border-dashed border-line bg-surface-soft px-4 py-3 text-sm text-muted">
        Save your profile above to see eligibility across all SSC exams.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((result) => (
        <div
          key={result.examKey}
          className="rounded-xl border border-line bg-surface p-4 shadow-panel"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-semibold text-ink">{result.examLabel}</div>
              <p className="mt-1 text-xs leading-relaxed text-muted">{result.summary}</p>
            </div>
            <EligibilityBadge status={result.status} compact />
          </div>
          {result.category ? (
            <Link
              href={`/exam/${result.category}?view=eligibility`}
              className="mt-3 inline-block text-xs font-semibold text-accent hover:text-accent-strong"
            >
              Open {result.category} tab →
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  );
}
