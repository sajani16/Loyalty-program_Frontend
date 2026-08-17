export function ProductSkeleton() {
  return (
    <div className="pt-32 container mx-auto px-6 py-8">
      <div className="flex gap-8">
        {/* Sidebar Skeleton */}
        <div className="w-64 hidden md:block space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-8 w-full bg-muted/50 animate-pulse rounded" />
            </div>
          ))}
        </div>
        {/* Product Grid Skeleton */}
        <div className="flex-1 grid gap-6 grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] w-full bg-muted animate-pulse rounded-xl" />
              <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
              <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}