export default function MainLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-48 animate-pulse rounded-lg bg-surface" />
        <div className="h-48 animate-pulse rounded-lg bg-surface" />
      </div>
      <div className="h-72 animate-pulse rounded-lg bg-surface" />
    </div>
  )
}
