"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  guestbook,
  guestbookLikes,
  guestbookReplies,
  guestbookReplyLikes, // 👈 Pastikan tabel ini di-import
  notifications,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * TOGGLE LIKE POSTINGAN UTAMA
 */
export async function toggleGuestbookLike(guestbookId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const userId = session.user.id;

  try {
    const existingLike = await db.query.guestbookLikes.findFirst({
      where: and(
        eq(guestbookLikes.guestbookId, guestbookId),
        eq(guestbookLikes.userId, userId)
      ),
    });

    if (existingLike) {
      await db
        .delete(guestbookLikes)
        .where(
          and(
            eq(guestbookLikes.guestbookId, guestbookId),
            eq(guestbookLikes.userId, userId)
          )
        );
    } else {
      await db.insert(guestbookLikes).values({ guestbookId, userId });

      const post = await db.query.guestbook.findFirst({
        where: eq(guestbook.id, guestbookId),
        columns: { userId: true },
      });

      if (post && post.userId !== userId) {
        await db.insert(notifications).values({
          userId: post.userId,
          triggerUserId: userId,
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
 */
export async function submitReply(guestbookId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const userId = session.user.id;

  if (!content.trim()) return { error: "Content cannot be empty" };

  try {
    await db.insert(guestbookReplies).values({
      guestbookId,
      userId,
      content: content.trim(),
    });

    const post = await db.query.guestbook.findFirst({
      where: eq(guestbook.id, guestbookId),
      columns: { userId: true },
    });

    if (post && post.userId !== userId) {
      await db.insert(notifications).values({
        userId: post.userId,
        triggerUserId: userId,
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

/**
 * TOGGLE LIKE BALASAN (NEW)
 */
export async function toggleReplyLike(replyId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const userId = session.user.id;

  try {
    const existingLike = await db.query.guestbookReplyLikes.findFirst({
      where: and(
        eq(guestbookReplyLikes.replyId, replyId),
        eq(guestbookReplyLikes.userId, userId)
      ),
    });

    if (existingLike) {
      await db
        .delete(guestbookReplyLikes)
        .where(
          and(
            eq(guestbookReplyLikes.replyId, replyId),
            eq(guestbookReplyLikes.userId, userId)
          )
        );
    } else {
      await db.insert(guestbookReplyLikes).values({ replyId, userId });
    }

    revalidatePath("/guestbook");
    return { success: true };
  } catch (error) {
    console.error("Error toggling reply like:", error);
    return { error: "Failed" };
  }
}