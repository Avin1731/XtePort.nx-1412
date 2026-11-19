import { ContentGridSkeleton } from "@/components/ui/content-grid-skeleton";

export default function ProjectsLoading() {
  return (
    <ContentGridSkeleton
      centered={false}
      columnsClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      cardCount={6}
    />
  );
}
