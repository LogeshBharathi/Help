import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ExamCategoryShell } from "@/components/exam/ExamCategoryShell";
import { NoticeSkeletonList } from "@/components/exam/NoticeSkeleton";
import { CATEGORY_CONFIG, isExamCategory } from "@/lib/categories";
import { EXAM_CATEGORIES } from "@/lib/constants";

interface ExamPageProps {
  params: { category: string };
}

export function generateStaticParams() {
  return EXAM_CATEGORIES.map((category) => ({ category }));
}

export function generateMetadata({ params }: ExamPageProps): Metadata {
  if (!isExamCategory(params.category)) {
    return { title: "Exam not found | SSC Notice Intelligence Platform" };
  }

  return {
    title: `${params.category} | SSC Notice Intelligence Platform`,
  };
}

export default function ExamCategoryPage({ params }: ExamPageProps) {
  if (!isExamCategory(params.category)) {
    notFound();
  }

  const config = CATEGORY_CONFIG[params.category];

  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <div className="h-12 animate-pulse rounded-full bg-surface" />
          <NoticeSkeletonList />
        </div>
      }
    >
      <ExamCategoryShell category={config.shortName} />
    </Suspense>
  );
}
