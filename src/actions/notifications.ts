"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notifications } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const data = await db.query.notifications.findMany({
      where: eq(notifications.userId, session.user.id),
      orderBy: [desc(notifications.createdAt)],
      limit: 10, 
      with: {
        triggerUser: {
            columns: { name: true, image: true }
        }
      }
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  try {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, session.user.id)
        )
      );
    
    revalidatePath("/guestbook"); 
    return { success: true };
  } catch {
    return { error: "Failed to update" };
  }
}

export async function markAllNotificationsAsRead() {
    const session = await auth();
    if (!session?.user?.id) return;
  
    try {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, session.user.id));
      
      revalidatePath("/guestbook");
      return { success: true };
    } catch {
      return { error: "Failed to update" };
    }
  }