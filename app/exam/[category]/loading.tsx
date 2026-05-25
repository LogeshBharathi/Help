import { NoticeSkeletonList } from "@/components/exam/NoticeSkeleton";

export default function ExamLoading() {
  return (
    <div className="space-y-8">
      <div className="h-64 animate-pulse rounded-[2rem] border border-line bg-surface" />
      <div className="h-40 animate-pulse rounded-[1.8rem] border border-line bg-surface" />
      <NoticeSkeletonList />
    </div>
  );
}
