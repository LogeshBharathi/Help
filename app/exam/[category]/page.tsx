import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NoticeBoard } from "@/components/exam/NoticeBoard";
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
    <div className="space-y-8">
      <NoticeBoard category={config.shortName} />
    </div>
  );
}
