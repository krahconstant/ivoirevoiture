export function VehicleCatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card">
          <div className="relative aspect-[16/9] bg-muted animate-pulse" />
          <div className="p-4 space-y-4">
            <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
            <div className="h-8 w-full bg-muted animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

