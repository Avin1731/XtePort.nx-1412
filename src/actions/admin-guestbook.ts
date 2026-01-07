"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { 
  guestbook, 
  guestbookReplies, 
  users, 
  guestbookReplyLikes,
  notifications 
} from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Resend } from "resend"; 
import AdminReplyNotificationEmail from "@/components/emails/admin-reply-notification"; 

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper: Cek Admin
async function checkAdmin() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

/**
 * [ADMIN] GET THREAD DATA (POST + REPLIES)
 * Mengambil Postingan Utama DAN Replies-nya sekaligus.
 */
export async function getThreadForAdmin(guestbookId: string) {
  const adminId = await checkAdmin();

  // 1. Ambil Postingan Utama
  const post = await db
    .select({
      id: guestbook.id,
      message: guestbook.message,
      createdAt: guestbook.createdAt,
      topic: guestbook.topic,
      user: {
        name: users.name,
        image: users.image,
        email: users.email,
      }
    })
    .from(guestbook)
    .leftJoin(users, eq(guestbook.userId, users.id))
    .where(eq(guestbook.id, guestbookId))
    .then(res => res[0]); // Ambil item pertama

  // 2. Ambil Replies (Logic Lama)
  const replies = await db
    .select({
      id: guestbookReplies.id,
      content: guestbookReplies.content,
      createdAt: guestbookReplies.createdAt,
      userId: guestbookReplies.userId,
      user: {
        name: users.name,
        image: users.image,
        email: users.email,
      },
      likeCount: sql<number>`(
        SELECT count(*) FROM ${guestbookReplyLikes} 
        WHERE ${guestbookReplyLikes.replyId} = ${guestbookReplies.id}
      )`.mapWith(Number),
      isLikedByAdmin: sql<number>`(
        SELECT count(*) FROM ${guestbookReplyLikes} 
        WHERE ${guestbookReplyLikes.replyId} = ${guestbookReplies.id} 
        AND ${guestbookReplyLikes.userId} = ${adminId}
      )`.mapWith(Number),
    })
    .from(guestbookReplies)
    .leftJoin(users, eq(guestbookReplies.userId, users.id))
    .where(eq(guestbookReplies.guestbookId, guestbookId))
    .orderBy(desc(guestbookReplies.createdAt));

  const mappedReplies = replies.map(r => ({
    ...r,
    isLiked: r.isLikedByAdmin > 0
  }));

  // Return paket lengkap
  return { post, replies: mappedReplies };
}

// ... (Fungsi submitAdminReply, markGuestbookAsRead, deleteReply, deleteGuestbookEntry BIARKAN SAMA SEPERTI SEBELUMNYA)
export async function submitAdminReply(guestbookId: string, content: string) {
  const adminId = await checkAdmin();
  if (!content.trim()) return { error: "Content cannot be empty" };

  try {
    await db.insert(guestbookReplies).values({
      guestbookId,
      userId: adminId!, 
      content: content.trim(),
    });

    const post = await db.query.guestbook.findFirst({
        where: eq(guestbook.id, guestbookId),
    });

    if (post) {
        const targetUserId = post.userId;
        if (targetUserId !== adminId) {
            await db.insert(notifications).values({
                userId: targetUserId,
                triggerUserId: adminId!,
                type: "REPLY",
                referenceId: guestbookId,
                isRead: false,
            });

            const targetUser = await db.query.users.findFirst({
                where: eq(users.id, targetUserId),
            });

            if (targetUser?.email && process.env.RESEND_API_KEY) {
                await resend.emails.send({
                    from: "Admin A-1412 <noreply@xteonlyone1412.my.id>", 
                    to: targetUser.email,
                    subject: "🔔 Official Admin Response",
                    react: AdminReplyNotificationEmail({
                        recipientName: targetUser.name || "User",
                        replyContent: content.trim(),
                        postUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/guestbook`,
                    }),
                });
            }
        }
    }
    revalidatePath("/dashboard/guestbook");
    revalidatePath("/guestbook");
    return { success: true };
  } catch (error) {
    console.error("Admin reply error:", error);
    return { error: "Failed to send reply" };
  }
}

export async function markGuestbookAsRead(id: string) {
  await checkAdmin();
  try {
    await db.update(guestbook).set({ isRead: true }).where(eq(guestbook.id, id));
    revalidatePath("/dashboard/guestbook");
    return { success: true };
  } catch (error) {
    console.error("Mark read error:", error); 
    return { error: "Failed to update status" };
  }
}

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