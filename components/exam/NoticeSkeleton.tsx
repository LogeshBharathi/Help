export function NoticeSkeletonList() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[1.35rem] border border-line bg-surface/80 p-5 shadow-panel animate-pulse"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="h-6 w-28 rounded-full bg-slate-200" />
            <div className="h-6 w-24 rounded-full bg-slate-200" />
          </div>
          <div className="mb-3 h-5 w-11/12 rounded-full bg-slate-200" />
          <div className="mb-3 h-5 w-8/12 rounded-full bg-slate-200" />
          <div className="flex gap-3">
            <div className="h-10 w-32 rounded-full bg-slate-200" />
            <div className="h-10 w-32 rounded-full bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
