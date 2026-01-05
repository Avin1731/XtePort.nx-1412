"use server";

import { db } from "@/lib/db";
import { messages, guestbook } from "@/db/schema";
import { auth } from "@/auth";
import { eq, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- SEND MESSAGE (PUBLIC) ---
export async function sendMessage(content: string) {
  const session = await auth();

  if (!content || content.trim().length === 0) {
    return { success: false, error: "Message cannot be empty" };
  }

  try {
    await db.insert(messages).values({
      content: content.slice(0, 500), // Limit 500 char
      userId: session?.user?.id || null, // Simpan ID jika login, null jika guest
    });

    revalidatePath("/dashboard/messages");
    return { success: true };
  } catch (error) {
    console.error("Failed to send message:", error);
    return { success: false, error: "Something went wrong" };
  }
}

// --- DELETE MESSAGE (ADMIN ONLY) ---
export async function deleteMessage(id: string) {
  const session = await auth();

  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Unauthorized Access");
  }

  try {
    await db.delete(messages).where(eq(messages.id, id));
    revalidatePath("/dashboard/messages");
  } catch (error) {
    console.error("Failed to delete message:", error);
    throw new Error("Failed to delete message");
  }
}

// --- GET UNREAD COUNTS (DUAL) ---
export async function getUnreadCounts() {
  const session = await auth();
  
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return { messages: 0, guestbook: 0 };
  }

  try {
    // 1. Hitung Pesan Chat
    const msgResult = await db
        .select({ count: count() })
        .from(messages)
        .where(eq(messages.isRead, false));

    // 2. Hitung Guestbook
    const gbResult = await db
        .select({ count: count() })
        .from(guestbook)
        .where(eq(guestbook.isRead, false));

    return { 
        messages: msgResult[0].count, 
        guestbook: gbResult[0].count 
    };
  } catch (error) {
    console.error("Failed to fetch counts:", error);
    return { messages: 0, guestbook: 0 };
  }
}

// --- MARK AS READ ---
export async function markMessageAsRead(id: string) {
  const session = await auth();
  if (session?.user?.email !== process.env.ADMIN_EMAIL) return;

  await db
    .update(messages)
    .set({ isRead: true })
    .where(eq(messages.id, id));
  
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/messages");
}