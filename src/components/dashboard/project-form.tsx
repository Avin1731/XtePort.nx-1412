"use client";

import { createProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRef } from "react";

export function ProjectForm() {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Add New Project</h3>
      <form
        ref={ref}
        action={async (formData) => {
          await createProject(formData);
          ref.current?.reset(); // Reset form setelah submit
        }}
        className="space-y-4"
      >
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required placeholder="Project Name" />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" required placeholder="Short description..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="demoUrl">Demo URL</Label>
            <Input id="demoUrl" name="demoUrl" placeholder="https://..." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="repoUrl">Repo URL</Label>
            <Input id="repoUrl" name="repoUrl" placeholder="https://github.com/..." />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input id="imageUrl" name="imageUrl" placeholder="/projects/image.png" />
        </div>

        <Button type="submit" className="w-full">Save Project</Button>
      </form>
    </div>
  );
}