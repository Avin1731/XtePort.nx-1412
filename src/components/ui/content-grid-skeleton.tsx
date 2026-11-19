import { Skeleton } from "@/components/ui/skeleton";

interface ContentGridSkeletonProps {
  centered?: boolean;
  columnsClassName?: string;
  cardCount?: number;
}

/**
 * Shared loading placeholder for searchable card-grid pages such as Projects and Blog.
 */
export function ContentGridSkeleton({
  centered = false,
  columnsClassName = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  cardCount = 6,
}: ContentGridSkeletonProps) {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div
        className={
          centered
            ? "mb-12 flex flex-col items-center space-y-4 text-center"
            : "mb-10 flex flex-col space-y-4"
        }
      >
        <Skeleton className="h-10 w-56 md:h-12 md:w-72" />
        <Skeleton className="h-5 w-full max-w-xl" />
        <Skeleton className="mt-2 h-10 w-full max-w-2xl" />
      </div>

      <div className={`grid gap-6 ${columnsClassName}`}>
        {Array.from({ length: cardCount }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm"
          >
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="space-y-3 p-5">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
