export default function JobsPage() {
  return (
    <div className="flex h-full min-h-[560px] flex-col rounded-[28px] border border-border/70 bg-background/80 p-6 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.35)]">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">
          Jobs
        </h2>

        <p className="text-sm text-muted-foreground">
          Search and manage jobs.
        </p>
      </div>
    </div>
  )
}