// src/lib/data.ts
import { db } from "@/lib/db"; // Sesuaikan path
import { visitors, projects } from "@/db/schema";
import { count } from "drizzle-orm";

export async function getDashboardStats() {
  const [visitorCount] = await db.select({ count: count() }).from(visitors);
  const [projectCount] = await db.select({ count: count() }).from(projects);

  return {
    visitors: visitorCount.count,
    projects: projectCount.count,
  };
}