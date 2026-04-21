import Link from "next/link";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ContentSearchFormProps = {
  actionPath: string;
  query: string;
  placeholder: string;
  clearHref: string;
  hiddenParams?: Record<string, string | undefined>;
};

export function ContentSearchForm({
  actionPath,
  query,
  placeholder,
  clearHref,
  hiddenParams,
}: ContentSearchFormProps) {
  const hiddenFields = Object.entries(hiddenParams ?? {}).filter(([, value]) => {
    return typeof value === "string" && value.trim().length > 0;
  });

  return (
    <form action={actionPath} method="get" className="w-full rounded-xl border bg-card p-3 shadow-sm">
      {hiddenFields.map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}

      <div className="flex flex-col gap-2 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={query}
            placeholder={placeholder}
            className="h-10 pl-9"
            aria-label={placeholder}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" className="w-full md:w-auto">
            Search
          </Button>

          {query && (
            <Button asChild variant="outline" className="w-full md:w-auto">
              <Link href={clearHref}>
                Clear
                <X className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
