import { Skeleton } from "@/components/ui/skeleton";

export default function BlogDetailLoading() {
  return (
    <article className="container mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6">
        <Skeleton className="h-8 w-32" />
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        <Skeleton className="h-10 w-full max-w-2xl md:h-12" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <Skeleton className="mb-10 aspect-video w-full rounded-xl" />

      <div className="space-y-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="mt-6 h-5 w-full" />
        <Skeleton className="h-5 w-10/12" />
      </div>
    </article>
  );
}
