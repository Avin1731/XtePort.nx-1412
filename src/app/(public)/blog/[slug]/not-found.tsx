import Link from "next/link";
import { ArrowLeft, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusView } from "@/components/ui/status-view";

export default function BlogPostNotFound() {
  return (
    <StatusView
      badge="404 • Article Not Found"
      title="Article could not be found"
      description="This blog post may still be a draft, might have been unpublished, or the link may be outdated."
      icon={<FileSearch className="h-6 w-6" />}
    >
      <Button asChild>
        <Link href="/blog">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/">Home</Link>
      </Button>
    </StatusView>
  );
}
