"use server";

import { Resend } from "resend";
import { db } from "@/lib/db";
import { messages, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

// Inisialisasi Resend dengan API Key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReply(messageId: string, replyContent: string) {
  const session = await auth();

  // 1. Security Check: Pastikan yang akses adalah Admin
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return { success: false, error: "Unauthorized access" };
  }

  try {
    // 2. Ambil detail pesan & email pengirim dari database
    const result = await db
      .select({
        userName: users.name,
        userEmail: users.email,
        originalMessage: messages.content,
      })
      .from(messages)
      .leftJoin(users, eq(messages.userId, users.id))
      .where(eq(messages.id, messageId))
      .limit(1);

    const data = result[0];

    // Jika user tidak ditemukan atau tidak punya email (Guest tanpa login)
    if (!data || !data.userEmail) {
      return { success: false, error: "User email not found (Guest?)" };
    }

    // 3. Kirim Email via Resend
    // PENTING: Jika belum verifikasi domain sendiri, 'from' WAJIB 'onboarding@resend.dev'
    // dan 'to' hanya bisa ke email yang kamu pakai untuk daftar Resend (Testing Mode).
    await resend.emails.send({
      from: "Admin A-1412 <onboarding@resend.dev>", 
      to: data.userEmail,
      subject: "Reply to your message on A-1412.dev",
      html: `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <p>Hi <strong>${data.userName}</strong>,</p>
          <p>Thanks for reaching out! Here is the reply to your message:</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #ccc; margin: 20px 0; font-style: italic; color: #555;">
            "${data.originalMessage}"
          </div>
          
          <div style="font-size: 16px; margin-top: 20px;">
            ${replyContent.replace(/\n/g, "<br>")}
          </div>
          
          <br>
          <hr style="border: none; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 12px;">Best regards,<br>A-1412 Admin Dashboard</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: "Failed to send email via Resend" };
  }
}