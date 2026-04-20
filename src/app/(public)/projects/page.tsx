import Link from "next/link";
import { ExternalLink, FolderOpen, Github } from "lucide-react";

import { getPublicProjects } from "@/actions/projects";
import { ContentSearchForm } from "@/components/search/content-search-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PublicProject = Awaited<ReturnType<typeof getPublicProjects>>[number];

export const metadata = {
  title: "Projects - A-1412.dev",
  description: "Explore featured and latest projects built in A-1412 portfolio.",
};

function parseTechStack(rawTechStack: string | null) {
  if (!rawTechStack) return [];

  return rawTechStack
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function ProjectCard({ project, featured = false }: { project: PublicProject; featured?: boolean }) {
  const techItems = parseTechStack(project.techStack);

  return (
    <article className="overflow-hidden rounded-xl border bg-card shadow-sm transition hover:shadow-md">
      <div className="relative aspect-video w-full overflow-hidden border-b bg-muted/30">
        {project.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.imageUrl}
            alt={`${project.title} preview`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No preview image
          </div>
        )}

        {featured && (
          <Badge className="absolute left-3 top-3 shadow-sm">Featured</Badge>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <h3 className="text-xl font-bold leading-tight">{project.title}</h3>
          <p className="line-clamp-3 text-sm text-muted-foreground">{project.description}</p>
        </div>

        {techItems.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {techItems.slice(0, 5).map((tech) => (
              <Badge key={`${project.id}-${tech}`} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          {project.demoUrl && (
            <Button asChild size="sm">
              <Link href={project.demoUrl} target="_blank" rel="noreferrer noopener">
                Live Demo
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}

          {project.repoUrl && (
            <Button asChild variant="outline" size="sm">
              <Link href={project.repoUrl} target="_blank" rel="noreferrer noopener">
                Source
                <Github className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}

          {!project.demoUrl && !project.repoUrl && (
            <p className="text-xs text-muted-foreground">No public links available yet.</p>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const currentQuery = params.q?.trim() ?? "";
  const projects = await getPublicProjects(currentQuery || undefined);

  const featuredProjects = projects.filter((project) => Boolean(project.isFeatured));
  const regularProjects = projects.filter((project) => !project.isFeatured);

  return (
    <div className="container mx-auto max-w-6xl space-y-10 px-4 py-12">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Projects</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Collection of builds, experiments, and production work from the A-1412 journey.
        </p>

        <div className="mx-auto w-full max-w-2xl pt-2">
          <ContentSearchForm
            actionPath="/projects"
            query={currentQuery}
            placeholder="Search by project name, description, or stack..."
            clearHref="/projects"
          />
        </div>

        <p className="text-sm text-muted-foreground">
          Found {projects.length} project{projects.length === 1 ? "" : "s"}
          {currentQuery ? ` for "${currentQuery}"` : ""}.
        </p>
      </header>

      {projects.length === 0 ? (
        <section className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
          <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
            <FolderOpen className="h-8 w-8 text-muted-foreground" />
            <h2 className="text-xl font-semibold">
              {currentQuery ? "No matching projects" : "No projects yet"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {currentQuery
                ? "Try another keyword or clear search to view all projects."
                : "Projects will appear here as soon as they are published from dashboard."}
            </p>

            {currentQuery && (
              <Button asChild variant="outline" size="sm" className="mt-1">
                <Link href="/projects">Clear search</Link>
              </Button>
            )}
          </div>
        </section>
      ) : (
        <>
          {featuredProjects.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold tracking-tight">Featured Projects</h2>
                <Badge variant="outline">{featuredProjects.length}</Badge>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} featured />
                ))}
              </div>
            </section>
          )}

          {regularProjects.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {featuredProjects.length > 0 ? "More Projects" : "All Projects"}
                </h2>
                <Badge variant="outline">{regularProjects.length}</Badge>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {regularProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
