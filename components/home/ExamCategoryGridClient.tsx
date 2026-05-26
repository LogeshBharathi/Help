"use client";

import { ExamCategoryCard } from "@/components/home/ExamCategoryCard";
import { CATEGORY_CONFIG } from "@/lib/categories";
import { EXAM_CATEGORIES } from "@/lib/constants";
import { evaluateCategory } from "@/lib/eligibility/evaluate";
import { useEligibilityProfile } from "@/lib/hooks/useEligibilityProfile";

export function ExamCategoryGridClient() {
  const { profile, ready } = useEligibilityProfile();

  return (
    <section>
      <div className="mb-6 flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          Browse by Current Tabs
        </p>
        <h2 className="font-serif-ui text-3xl font-semibold text-ink">Choose an exam stream</h2>
        <p className="max-w-3xl text-sm leading-7 text-muted">
          These tabs follow the current extraction model. Direct streams stay one-to-one, and
          grouped tabs show the exact official exam families they currently include.
          {ready && profile ? (
            <span className="mt-2 block font-medium text-accent">
              Eligibility badges reflect your saved profile.
            </span>
          ) : null}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {EXAM_CATEGORIES.map((category, index) => {
          const result = ready ? evaluateCategory(profile, category) : null;
          return (
            <ExamCategoryCard
              key={category}
              config={CATEGORY_CONFIG[category]}
              animationDelayMs={index * 70}
              eligibilityStatus={result?.status}
            />
          );
        })}
      </div>
    </section>
  );
}
