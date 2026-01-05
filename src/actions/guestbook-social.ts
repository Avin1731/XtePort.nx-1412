"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  guestbook,
  guestbookLikes,
  guestbookReplies,
  notifications,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * TOGGLE LIKE
 * Check if user already liked the post.
 * - If yes: Delete like (Unlike).
 * - If no: Insert like & Create notification.
 */
export async function toggleGuestbookLike(guestbookId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    // 1. Cek apakah sudah like sebelumnya
    const existingLike = await db.query.guestbookLikes.findFirst({
      where: and(
        eq(guestbookLikes.guestbookId, guestbookId),
        eq(guestbookLikes.userId, userId)
      ),
    });

    if (existingLike) {
      // --- UNLIKE ---
      await db
        .delete(guestbookLikes)
        .where(
          and(
            eq(guestbookLikes.guestbookId, guestbookId),
            eq(guestbookLikes.userId, userId)
          )
        );
    } else {
      // --- LIKE ---
      await db.insert(guestbookLikes).values({
        guestbookId,
        userId,
      });

      // 2. Ambil data pemilik postingan asli untuk kirim notif
      const post = await db.query.guestbook.findFirst({
        where: eq(guestbook.id, guestbookId),
        columns: { userId: true },
      });

      // 3. Buat Notifikasi (Hanya jika yang nge-like BUKAN pemilik postingan)
      if (post && post.userId !== userId) {
        await db.insert(notifications).values({
          userId: post.userId, // Penerima (Pemilik Post)
          triggerUserId: userId, // Pelaku (Yang nge-like)
          type: "LIKE",
          referenceId: guestbookId,
          isRead: false,
        });
      }
    }

    revalidatePath("/guestbook");
    return { success: true };
  } catch (error) {
    console.error("Error toggling like:", error);
    return { error: "Failed to like" };
  }
}

/**
 * SUBMIT REPLY
 * Save reply to database & trigger notification.
 */
export async function submitReply(guestbookId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  if (!content.trim()) {
    return { error: "Content cannot be empty" };
  }

  try {
    // 1. Simpan Balasan
    await db.insert(guestbookReplies).values({
      guestbookId,
      userId,
      content: content.trim(),
    });

    // 2. Ambil data pemilik postingan asli
    const post = await db.query.guestbook.findFirst({
      where: eq(guestbook.id, guestbookId),
      columns: { userId: true },
    });

    // 3. Buat Notifikasi (Jika membalas orang lain)
    if (post && post.userId !== userId) {
      await db.insert(notifications).values({
        userId: post.userId, // Penerima
        triggerUserId: userId, // Pelaku
        type: "REPLY",
        referenceId: guestbookId,
        isRead: false,
      });
    }

    revalidatePath("/guestbook");
    return { success: true };
  } catch (error) {
    console.error("Error submitting reply:", error);
    return { error: "Failed to reply" };
  }
}