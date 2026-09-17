export default function ProductSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-square shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-16 shimmer rounded" />
        <div className="h-4 w-full shimmer rounded" />
        <div className="h-4 w-3/4 shimmer rounded" />
        <div className="h-5 w-20 shimmer rounded" />
      </div>
    </div>
  )
}
