"use server";

import { db } from "@/lib/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const demoUrl = formData.get("demoUrl") as string;
  const repoUrl = formData.get("repoUrl") as string;
  
  // Sesuaikan dengan schema: projects (id is UUID, isFeatured instead of isPublished)
  await db.insert(projects).values({
    title,
    description,
    imageUrl: imageUrl || null, // Handle empty string to null if needed, or keep string
    demoUrl: demoUrl || null,
    repoUrl: repoUrl || null,
    isFeatured: true, // Default featured
    techStack: "", // Default empty jika belum ada input
  });

  revalidatePath("/dashboard/projects");
}

export async function deleteProject(id: string) {
  // ID di schema adalah text/uuid, jadi parameter harus string
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/dashboard/projects");
}