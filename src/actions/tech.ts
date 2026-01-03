"use server";

import { db } from "@/lib/db";
import { techStack } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createTech(formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const iconName = formData.get("iconName") as string;

  if (!name || !category) return; // Simple validation

  await db.insert(techStack).values({
    name,
    category,
    iconName: iconName || "Circle", // Default icon jika kosong
  });

  revalidatePath("/dashboard/tech");
}

export async function deleteTech(id: string) {
  await db.delete(techStack).where(eq(techStack.id, id));
  revalidatePath("/dashboard/tech");
}