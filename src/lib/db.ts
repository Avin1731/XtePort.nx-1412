import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { 
  schema: {
    // === Existing Tables ===
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
    
    // === 👇 NEW BLOG TABLES (Tambahkan ini) ===
    posts: schema.posts,
    postLikes: schema.postLikes,

    // === Relations ===
    usersRelations: schema.usersRelations,
    guestbookRelations: schema.guestbookRelations,
    guestbookRepliesRelations: schema.guestbookRepliesRelations,
    guestbookLikesRelations: schema.guestbookLikesRelations,
    guestbookReplyLikesRelations: schema.guestbookReplyLikesRelations,
    notificationsRelations: schema.notificationsRelations,

    // === 👇 NEW BLOG RELATIONS (Tambahkan ini) ===
    postsRelations: schema.postsRelations,
    postLikesRelations: schema.postLikesRelations,
  }
});