import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface StatusViewProps {
  badge: string;
  title: string;
  description: string;
  icon?: ReactNode;
  children?: ReactNode;
}

/**
 * Shared centered feedback layout for 404 and runtime error boundaries.
 */
export function StatusView({
  badge,
  title,
  description,
  icon,
  children,
}: StatusViewProps) {
  return (
    <div className="container mx-auto flex min-h-[65vh] max-w-2xl items-center justify-center px-4 py-16">
      <div className="w-full rounded-2xl border bg-card p-8 text-center shadow-sm md:p-10">
        {icon && (
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            {icon}
          </div>
        )}

        <Badge variant="secondary" className="mb-3 font-mono text-xs">
          {badge}
        </Badge>

        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
          {description}
        </p>

        {children && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
