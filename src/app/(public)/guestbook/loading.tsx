import { Skeleton } from "@/components/ui/skeleton";

export default function GuestbookLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-5 w-72" />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="space-y-6 lg:w-3/4">
          <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
            <Skeleton className="h-24 w-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-9 w-36" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>

          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="space-y-3 rounded-xl border bg-card p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/4">
          <div className="space-y-3 rounded-xl border bg-card p-5 shadow-sm">
            <Skeleton className="h-5 w-24" />
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
