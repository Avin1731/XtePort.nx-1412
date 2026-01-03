import { db } from "@/lib/db";
import { projects } from "@/db/schema";
import { ProjectForm } from "@/components/dashboard/project-form";
import { deleteProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { desc } from "drizzle-orm";
import { Trash2, ExternalLink } from "lucide-react";

export default async function ProjectsPage() {
  // Fetch data urut dari yang terbaru
  const allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Projects Manager</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Kolom Kiri: Form */}
        <div>
           <ProjectForm />
        </div>

        {/* Kolom Kanan: List Project */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Existing Projects</h3>
          {allProjects.length === 0 ? (
            <p className="text-muted-foreground">No projects yet.</p>
          ) : (
            allProjects.map((project) => (
              <div key={project.id} className="flex flex-col gap-2 p-4 border rounded-lg bg-card shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{project.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  </div>
                  <form action={deleteProject.bind(null, project.id)}>
                    <Button variant="destructive" size="icon" type="submit">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
                
                <div className="flex gap-2 mt-2 text-xs text-blue-500">
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" className="flex items-center hover:underline">
                      Live Demo <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  )}
                  {project.repoUrl && (
                     <a href={project.repoUrl} target="_blank" className="flex items-center hover:underline">
                      Repository <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}