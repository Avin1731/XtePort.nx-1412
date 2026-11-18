import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const schemaMap = {
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
  profile: schema.profile,
  experience: schema.experience,
  techStack: schema.techStack,
  visitors: schema.visitors,
  messages: schema.messages,
  posts: schema.posts,
  postLikes: schema.postLikes,
  usersRelations: schema.usersRelations,
  guestbookRelations: schema.guestbookRelations,
  guestbookRepliesRelations: schema.guestbookRepliesRelations,
  guestbookLikesRelations: schema.guestbookLikesRelations,
  guestbookReplyLikesRelations: schema.guestbookReplyLikesRelations,
  notificationsRelations: schema.notificationsRelations,
  profileRelations: schema.profileRelations,
  experienceRelations: schema.experienceRelations,
  postsRelations: schema.postsRelations,
  postLikesRelations: schema.postLikesRelations,
};

const useLocalPg =
  process.env.USE_LOCAL_PG === "1" &&
  !process.env.VERCEL &&
  !process.env.VERCEL_ENV;

function createDb() {
  if (useLocalPg) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    return drizzlePg(pool, { schema: schemaMap }) as unknown as ReturnType<
      typeof drizzleNeon<typeof schemaMap>
    >;
  }

  const sql = neon(process.env.DATABASE_URL!);
  return drizzleNeon(sql, { schema: schemaMap });
}

export const db = createDb();
