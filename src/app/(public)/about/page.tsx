import Link from "next/link";
import { BriefcaseBusiness, ExternalLink, MapPin, UserRound } from "lucide-react";

import { getPublicProfileData } from "@/actions/profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatMonthYear(dateValue: Date | null) {
  if (!dateValue) return "Present";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(dateValue);
}

export const metadata = {
  title: "About - A-1412.dev",
  description: "Get to know the profile, journey, and work experience behind A-1412.",
};

export default async function AboutPage() {
  const data = await getPublicProfileData();

  const displayName = data.profile?.fullName || "A-1412";
  const headline = data.profile?.headline || "Building web experiences with reliable architecture.";
  const bio =
    data.profile?.bio ||
    "This profile is being prepared. Please check back soon for full timeline and career details.";

  return (
    <div className="container mx-auto max-w-5xl space-y-10 px-4 py-12">
      <header className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative h-28 w-28 overflow-hidden rounded-full border bg-muted/30">
            {data.profile?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.profile.avatarUrl} alt={`${displayName} avatar`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <UserRound className="h-10 w-10" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{displayName}</h1>
            <p className="text-lg text-muted-foreground">{headline}</p>

            <div className="flex flex-wrap items-center gap-2">
              {data.profile?.location && (
                <Badge variant="secondary" className="gap-1 px-3 py-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {data.profile.location}
                </Badge>
              )}

              {data.profile?.cvUrl && (
                <Button asChild size="sm" variant="outline">
                  <Link href={data.profile.cvUrl} target="_blank" rel="noreferrer noopener">
                    View CV
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">{bio}</p>
      </header>

      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">Experience Timeline</h2>
        </div>

        {data.experiences.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center">
            <p className="text-muted-foreground">Experience timeline has not been published yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.experiences.map((item) => (
              <article key={item.id} className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{item.role}</h3>
                    <p className="font-medium text-muted-foreground">{item.company}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.isCurrent && <Badge>Current</Badge>}
                    <Badge variant="outline">
                      {formatMonthYear(item.startDate)} - {item.isCurrent ? "Present" : formatMonthYear(item.endDate)}
                    </Badge>
                  </div>
                </div>

                {item.description && (
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
