import { db } from "@/lib/db"; 
import { visitors, projects, posts, guestbook } from "@/db/schema";
import { count, sum, sql } from "drizzle-orm";

export async function getDashboardStats() {
  const [
    visitorRes, 
    uniqueVisitorRes, // 👈 Data baru
    projectRes, 
    postRes, 
    postViewsRes, 
    guestbookRes
  ] = await Promise.all([
    // 1. Total Hits (Semua baris)
    db.select({ value: count() }).from(visitors),
    
    // 2. Unique Visitors (Hitung IP yang berbeda saja)
    db.select({ value: sql<number>`count(DISTINCT ${visitors.ipAddress})` }).from(visitors),

    db.select({ value: count() }).from(projects),
    db.select({ value: count() }).from(posts),
    db.select({ value: sum(posts.viewCount) }).from(posts),
    db.select({ value: count() }).from(guestbook),
  ]);

  return {
    totalVisits: visitorRes[0].value,
    uniqueVisitors: uniqueVisitorRes[0].value, // 👈 Return data baru
    projects: projectRes[0].value,
    posts: postRes[0].value,
    totalViews: Number(postViewsRes[0].value) || 0, 
    guestbook: guestbookRes[0].value,
  };
}