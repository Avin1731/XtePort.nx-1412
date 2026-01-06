"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  guestbook,
  guestbookLikes,
  guestbookReplies,
  guestbookReplyLikes,
  notifications,
  users, // ✅ PASTIKAN users DI-IMPORT
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
  console.log("Starting toggleGuestbookLike...");
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
 * SUBMIT REPLY (WITH NESTED TARGET LOGIC)
 */
export async function submitReply(
  guestbookId: string, 
  content: string, 
  replyToId?: string
) {
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

    // 2. Tentukan Target Notifikasi
    let targetUserId = "";
    let targetEmail = "";
    let targetName = "";

    if (replyToId) {
      // A. Jika membalas komentar orang lain
      const parentReply = await db.query.guestbookReplies.findFirst({
        where: eq(guestbookReplies.id, replyToId),
      });

      if (parentReply) {
        targetUserId = parentReply.userId;
        
        // Query user secara terpisah
        const parentUser = await db.query.users.findFirst({
          where: eq(users.id, parentReply.userId),
        });
        
        if (parentUser) {
          targetEmail = parentUser.email || "";
          targetName = parentUser.name || "User";
        }
      }
    } else {
      // B. Jika membalas postingan utama
      const post = await db.query.guestbook.findFirst({
        where: eq(guestbook.id, guestbookId),
      });

      if (post) {
        targetUserId = post.userId;
        
        // Query user secara terpisah
        const postUser = await db.query.users.findFirst({
          where: eq(users.id, post.userId),
        });
        
        if (postUser) {
          targetEmail = postUser.email || "";
          targetName = postUser.name || "User";
        }
      }
    }

    // 3. Kirim Notifikasi
    if (targetUserId && targetUserId !== userId) {
      await db.insert(notifications).values({
        userId: targetUserId,
        triggerUserId: userId,
        type: "REPLY",
        referenceId: guestbookId,
        isRead: false,
      });

      // Email notification
      if (targetEmail && process.env.RESEND_API_KEY) {
        try {
          await resend.emails.send({
            from: "Guestbook A-1412 <noreply@xteonlyone1412.my.id>", 
            to: targetEmail, 
            subject: replyToId ? "💬 Someone replied to your comment" : "💬 New reply on your Guestbook post",
            react: ReplyNotificationEmail({
              recipientName: targetName,
              senderName: userName,
              replyContent: content.trim(),
              postUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/guestbook`,
            }),
          });
          console.log(`✅ Email sent to ${targetEmail}`);
        } catch (emailError) {
          console.error("❌ Failed to send email:", emailError);
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