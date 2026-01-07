import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  varchar,
  uuid
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import type { AdapterAccountType } from "next-auth/adapters"

// =========================================
// 1. TABLES
// =========================================

export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: text("role").default("user"),
})

export const accounts = pgTable("account", {
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [primaryKey({ columns: [account.provider, account.providerAccountId] })]
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable("verificationToken", {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [primaryKey({ columns: [verificationToken.identifier, verificationToken.token] })]
)

export const guestbook = pgTable("guestbook", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  topic: text("topic").default("General").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
})

export const projects = pgTable("projects", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  demoUrl: text("demo_url"),
  repoUrl: text("repo_url"),
  techStack: text("tech_stack"),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
})

export const techStack = pgTable("tech_stack", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  category: text("category"),
  iconName: text("icon_name"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const visitors = pgTable("visitors", {
  id: serial("id").primaryKey(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  visitedAt: timestamp("visited_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id"),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const guestbookReplies = pgTable("guestbook_replies", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  guestbookId: text("guestbook_id").notNull().references(() => guestbook.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const guestbookLikes = pgTable("guestbook_likes", {
    guestbookId: text("guestbook_id").notNull().references(() => guestbook.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.guestbookId, table.userId] })]
);

export const guestbookReplyLikes = pgTable("guestbook_reply_likes", {
    replyId: text("reply_id").notNull().references(() => guestbookReplies.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.replyId, table.userId] })]
);

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  triggerUserId: text("trigger_user_id").references(() => users.id, { onDelete: "set null" }),
  type: text("type").notNull(),
  referenceId: text("reference_id"),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// =========================================
// 2. RELATIONS - LENGKAP & SIMETRIS
// =========================================

// GUESTBOOK
export const guestbookRelations = relations(guestbook, ({ one, many }) => ({
  user: one(users, {
    fields: [guestbook.userId],
    references: [users.id],
  }),
  replies: many(guestbookReplies),  
  likes: many(guestbookLikes),      
}));

// REPLIES
export const guestbookRepliesRelations = relations(guestbookReplies, ({ one, many }) => ({
  user: one(users, {
    fields: [guestbookReplies.userId],
    references: [users.id],
  }),
  guestbook: one(guestbook, {
    fields: [guestbookReplies.guestbookId],
    references: [guestbook.id],
  }),
  likes: many(guestbookReplyLikes),  
}));

// LIKES
export const guestbookLikesRelations = relations(guestbookLikes, ({ one }) => ({
  user: one(users, {
    fields: [guestbookLikes.userId],
    references: [users.id],
  }),
  guestbook: one(guestbook, {
    fields: [guestbookLikes.guestbookId],
    references: [guestbook.id],
  }),
}));

// REPLY LIKES
export const guestbookReplyLikesRelations = relations(guestbookReplyLikes, ({ one }) => ({
  user: one(users, {
    fields: [guestbookReplyLikes.userId],
    references: [users.id],
  }),
  reply: one(guestbookReplies, {
    fields: [guestbookReplyLikes.replyId],
    references: [guestbookReplies.id],
  }),
}));

// USERS
export const usersRelations = relations(users, ({ many }) => ({
  guestbooks: many(guestbook),
  guestbookReplies: many(guestbookReplies),
  guestbookLikes: many(guestbookLikes),
  guestbookReplyLikes: many(guestbookReplyLikes),
  notifications: many(notifications),
}));

// NOTIFICATIONS
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  triggerUser: one(users, {
    fields: [notifications.triggerUserId],
    references: [users.id],
  }),
}));