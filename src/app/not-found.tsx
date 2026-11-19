import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusView } from "@/components/ui/status-view";

export default function NotFound() {
  return (
    <StatusView
      badge="404 • Not Found"
      title="Page not found"
      description="The page you are looking for does not exist, may have been moved, or the URL might be misspelled."
      icon={<Compass className="h-6 w-6" />}
    >
      <Button asChild>
        <Link href="/">
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/projects">Explore Projects</Link>
      </Button>
      <Button asChild variant="ghost">
        <Link href="/blog">Read Blog</Link>
      </Button>
    </StatusView>
  );
}
