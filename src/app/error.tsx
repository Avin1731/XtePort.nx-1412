"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusView } from "@/components/ui/status-view";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled route error:", error);
  }, [error]);

  return (
    <StatusView
      badge={error.digest ? `500 • Ref ${error.digest}` : "500 • Application Error"}
      title="Something went wrong"
      description="An unexpected error occurred while rendering this page. You can try again or return to the homepage."
      icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
    >
      <Button type="button" onClick={() => reset()}>
        <RotateCcw className="h-4 w-4" />
        Try again
      </Button>
      <Button asChild variant="outline">
        <Link href="/">
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </Button>
    </StatusView>
  );
}
