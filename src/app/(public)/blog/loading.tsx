import { ContentGridSkeleton } from "@/components/ui/content-grid-skeleton";

export default function BlogLoading() {
  return (
    <ContentGridSkeleton
      centered
      columnsClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      cardCount={6}
    />
  );
}
