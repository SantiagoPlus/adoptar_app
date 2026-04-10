export function AnimalsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl overflow-hidden border border-white/10 bg-white/5"
        >
          <div className="w-full h-64 bg-white/10 animate-pulse" />
          <div className="p-5 space-y-3">
            <div className="h-7 w-32 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
