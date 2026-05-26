"use client";

import Link from "next/link";

import { EligibilityBadge } from "@/components/eligibility/EligibilityBadge";
import { EligibilityGuide } from "@/components/eligibility/EligibilityGuide";
import { EligibilityProfileForm } from "@/components/eligibility/EligibilityProfileForm";
import type { ExamCategory } from "@/lib/constants";
import { CATEGORY_CONFIG } from "@/lib/categories";
import { evaluateCategory } from "@/lib/eligibility/evaluate";
import { useEligibilityProfile } from "@/lib/hooks/useEligibilityProfile";

interface CategoryEligibilityPanelProps {
  category: ExamCategory;
}

export function CategoryEligibilityPanel({ category }: CategoryEligibilityPanelProps) {
  const { profile, hasProfile } = useEligibilityProfile();
  const config = CATEGORY_CONFIG[category];
  const result = evaluateCategory(profile, category);

  return (
    <div className="space-y-8">
      <section className="rounded-[1.8rem] border border-line bg-surface p-5 shadow-panel md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              Your eligibility — {category}
            </p>
            <h2 className="mt-2 font-serif-ui text-2xl font-semibold text-ink">
              {config.fullName}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{result.summary}</p>
          </div>
          <EligibilityBadge status={result.status} />
        </div>

        {!hasProfile ? (
          <p className="mt-4 rounded-[1rem] border border-dashed border-line bg-surface-soft px-4 py-3 text-sm text-muted">
            Save your profile below or on the{" "}
            <Link href="/eligibility" className="font-semibold text-accent hover:text-accent-strong">
              eligibility checker
            </Link>{" "}
            to see a personalised result here and on the homepage.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {result.reasons.map((reason) => (
              <li
                key={reason}
                className="rounded-[1rem] border border-line bg-surface-soft px-4 py-2.5 text-sm leading-6 text-muted"
              >
                {reason}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/eligibility"
            className="rounded-full bg-hero-deep px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-hero-mid"
          >
            Open full eligibility checker
          </Link>
          <Link
            href={`/exam/${category}`}
            className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-muted transition hover:border-hero-mid/30 hover:text-ink"
          >
            Back to notices
          </Link>
        </div>
      </section>

      <EligibilityProfileForm />

      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          {category} reference — May 2026 update
        </p>
        <EligibilityGuide initialTab={category === "CGL" ? "cgl" : "comparison"} />
      </div>
    </div>
  );
}
