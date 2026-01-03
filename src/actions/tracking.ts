"use server";

import { db } from "@/lib/db"; // Sesuaikan path db
import { visitors } from "@/db/schema";
import { headers } from "next/headers";

export async function trackVisitor() {
  try {
    const headersList = await headers();
    
    // Coba ambil IP dari x-forwarded-for (untuk prod/vercel), fallback ke string kosong
    const forwardedFor = headersList.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "unknown";
    const userAgent = headersList.get("user_agent") || "unknown";

    await db.insert(visitors).values({
      ipAddress: ip,
      userAgent: userAgent,
    });
    
  } catch (error) {
    console.error("Tracking error:", error);
    // Silent fail agar user tidak terganggu
  }
}