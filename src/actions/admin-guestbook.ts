"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { guestbook, guestbookReplies, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Helper: Cek Admin
async function checkAdmin() {
  const session = await auth();
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }
}

/**
 * [ADMIN] AMBIL REPLIES (MANUAL JOIN)
 */
export async function getRepliesForAdmin(guestbookId: string) {
  await checkAdmin();

  const replies = await db
    .select({
      id: guestbookReplies.id,
      content: guestbookReplies.content,
      createdAt: guestbookReplies.createdAt,
      user: {
        name: users.name,
        image: users.image,
        email: users.email,
      },
    })
    .from(guestbookReplies)
    .leftJoin(users, eq(guestbookReplies.userId, users.id))
    .where(eq(guestbookReplies.guestbookId, guestbookId))
    .orderBy(desc(guestbookReplies.createdAt));

  return replies;
}

/**
 * [ADMIN] MARK AS READ (ONE WAY)
 * Hanya mengubah status menjadi TRUE. Tidak bisa dibalikkan.
 */
export async function markGuestbookAsRead(id: string) {
  await checkAdmin();

  try {
    await db
        .update(guestbook)
        .set({ isRead: true })
        .where(eq(guestbook.id, id));

    revalidatePath("/dashboard/guestbook");
    return { success: true };
  } catch (error) {
    // FIX: Gunakan variable error agar linter tidak komplain
    console.error("Mark read error:", error);
    return { error: "Failed to update status" };
  }
}

/**
 * [ADMIN] HAPUS REPLY
 */
export async function deleteReply(replyId: string) {
  await checkAdmin();

  try {
    await db.delete(guestbookReplies).where(eq(guestbookReplies.id, replyId));
    revalidatePath("/dashboard/guestbook");
    revalidatePath("/guestbook");
    return { success: true };
  } catch (error) {
    console.error("Delete reply error:", error);
    return { error: "Failed to delete" };
  }
}

/**
 * [ADMIN] HAPUS POSTINGAN UTAMA
 */
export async function deleteGuestbookEntry(id: string) {
  await checkAdmin();

  try {
    await db.delete(guestbook).where(eq(guestbook.id, id));
    revalidatePath("/dashboard/guestbook");
    revalidatePath("/guestbook");
    return { success: true };
  } catch (error) {
    console.error("Delete entry error:", error); 
    return { error: "Failed to delete entry" };
  }
}