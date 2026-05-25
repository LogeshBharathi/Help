export default function HomeLoading() {
  return (
    <div className="space-y-8">
      <div className="h-64 animate-pulse rounded-[2rem] border border-line bg-surface" />
      <div className="h-40 animate-pulse rounded-[1.8rem] border border-line bg-surface" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-56 animate-pulse rounded-[1.8rem] border border-line bg-surface/80"
          />
        ))}
      </div>
    </div>
  );
}
