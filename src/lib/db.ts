import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const sql = neon(process.env.DATABASE_URL);

// PERBAIKAN: Pastikan semua tabel dan relasi terekspor
export const db = drizzle(sql, { 
  schema: {
    // Semua tabel
    users: schema.users,
    accounts: schema.accounts,
    sessions: schema.sessions,
    verificationTokens: schema.verificationTokens,
    guestbook: schema.guestbook,
    guestbookReplies: schema.guestbookReplies,
    guestbookLikes: schema.guestbookLikes,
    guestbookReplyLikes: schema.guestbookReplyLikes,
    notifications: schema.notifications,
    projects: schema.projects,
    techStack: schema.techStack,
    visitors: schema.visitors,
    messages: schema.messages,
    
    // Semua relasi (WAJIB untuk query dengan 'with')
    usersRelations: schema.usersRelations,
    guestbookRelations: schema.guestbookRelations,
    guestbookRepliesRelations: schema.guestbookRepliesRelations,
    guestbookLikesRelations: schema.guestbookLikesRelations,
    guestbookReplyLikesRelations: schema.guestbookReplyLikesRelations,
    notificationsRelations: schema.notificationsRelations,
    
    // Jika ada relasi lain, tambahkan di sini
  }
});