"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  guestbook,
  guestbookLikes,
  guestbookReplies,
  guestbookReplyLikes,
  notifications,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Resend } from "resend"; 
import ReplyNotificationEmail from "@/components/emails/reply-notification";

// Inisialisasi Resend
const resend = new Resend(process.env.RESEND_API_KEY);

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
 * SUBMIT REPLY (FINAL PRODUCTION VERSION)
 */
export async function submitReply(guestbookId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const userId = session.user.id;
  const userName = session.user.name || "Someone";

  if (!content.trim()) return { error: "Content cannot be empty" };

  try {
    // 1. Simpan Balasan ke Database
    await db.insert(guestbookReplies).values({
      guestbookId,
      userId,
      content: content.trim(),
    });

    // 2. Ambil data pemilik postingan asli
    const post = await db.query.guestbook.findFirst({
      where: eq(guestbook.id, guestbookId),
      with: {
        user: true, 
      },
    });

    // 3. Logic Notifikasi
    if (post && post.userId !== userId) {
      // A. Notif DB (Lonceng Website)
      await db.insert(notifications).values({
        userId: post.userId,
        triggerUserId: userId,
        type: "REPLY",
        referenceId: guestbookId,
        isRead: false,
      });

      // B. Notif Email (Resend Production)
      if (post.user.email && process.env.RESEND_API_KEY) {
        try {
          await resend.emails.send({
            // 👇 UPDATE: Pakai domain barumu
            from: "Guestbook A-1412 <noreply@xteonlyone1412.my.id>", 
            
            // 👇 UPDATE: Kirim ke pemilik postingan asli (Bukan hardcode admin lagi)
            to: post.user.email, 
            
            subject: "💬 New reply on your Guestbook post",
            react: ReplyNotificationEmail({
              recipientName: post.user.name || "User",
              senderName: userName,
              replyContent: content.trim(),
              postUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/guestbook`,
            }),
          });
        } catch (emailError) {
          // Kita log error tapi jangan gagalkan proses reply di UI
          console.error("❌ Failed to send email via Resend:", emailError);
        }
      }
    }

    revalidatePath("/guestbook");
    return { success: true };
  } catch (error) {
    console.error("Error submitting reply:", error);
    return { error: "Failed to reply" };
  }
}

/**
 * TOGGLE LIKE BALASAN
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