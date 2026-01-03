// src/lib/data.ts
import { db } from "@/lib/db";
import { visitors } from "@/db/schema"; // pastikan import projects ada
import { count } from "drizzle-orm";

export async function getDashboardStats() {
  const [visitorCount] = await db.select({ count: count() }).from(visitors);
  
  // Kalau tabel projects belum diisi, kita return 0 dulu atau count kalau sudah ada schema
  // const [projectCount] = await db.select({ count: count() }).from(projects);

  return {
    visitors: visitorCount.count,
    projects: 0, // Placeholder sampai tabel projects siap
  };
}