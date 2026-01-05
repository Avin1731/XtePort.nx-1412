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
// SECTION 1: AUTHENTICATION (NextAuth)
// =========================================

// --- Table: Users ---
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: text("role").default("user"), // 'admin' or 'user'
})

// --- Table: Accounts ---
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
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
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
)

// --- Table: Sessions ---
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

// --- Table: Verification Tokens ---
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ]
)

// =========================================
// SECTION 2: FEATURES
// =========================================

// --- Table: Guestbook ---
export const guestbook = pgTable("guestbook", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  topic: text("topic").default("General").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
})

// =========================================
// SECTION 3: CMS & PORTFOLIO
// =========================================

// --- Table: Projects ---
export const projects = pgTable("projects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  demoUrl: text("demo_url"),
  repoUrl: text("repo_url"),
  techStack: text("tech_stack"), // Comma separated
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
})

// --- Table: Tech Stack ---
export const techStack = pgTable("tech_stack", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  category: text("category"), // Frontend, Backend, Tools
  iconName: text("icon_name"), // Lucide/SimpleIcons name
  createdAt: timestamp("created_at").defaultNow(),
})

// =========================================
// SECTION 4: ANALYTICS
// =========================================

// --- Table: Visitors ---
export const visitors = pgTable("visitors", {
  id: serial("id").primaryKey(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  visitedAt: timestamp("visited_at").defaultNow(),
});

// --- Table: Messages (from Chat Widget) ---
export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id"),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// =========================================
// SECTION 5: SOCIAL FEATURES (PHASE 6)
// =========================================

// --- Table: Guestbook Replies ---
export const guestbookReplies = pgTable("guestbook_replies", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  guestbookId: text("guestbook_id") // Wajib text karena guestbook.id adalah text
    .notNull()
    .references(() => guestbook.id, { onDelete: "cascade" }),
  userId: text("user_id") // Wajib text karena users.id adalah text
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Table: Guestbook Likes ---
export const guestbookLikes = pgTable(
  "guestbook_likes",
  {
    guestbookId: text("guestbook_id")
      .notNull()
      .references(() => guestbook.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
      // Composite Primary Key: 1 User cuma bisa Like 1x per Post
      primaryKey({ columns: [table.guestbookId, table.userId] }),
  ]
);

// --- Table: User Notifications ---
export const notifications = pgTable("notifications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id") // Penerima notif
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  triggerUserId: text("trigger_user_id") // Pelaku (User A like User B)
    .references(() => users.id, { onDelete: "set null" }),
  type: text("type").notNull(), // 'LIKE', 'REPLY', 'ADMIN_REPLY'
  referenceId: text("reference_id"), // ID Guestbook / Reply terkait
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// =========================================
// SECTION 6: RELATIONS
// =========================================

// Relasi Guestbook (Induk)
export const guestbookRelations = relations(guestbook, ({ one, many }) => ({
  user: one(users, {
    fields: [guestbook.userId],
    references: [users.id],
  }),
  replies: many(guestbookReplies),
  likes: many(guestbookLikes),
}));

// Relasi Replies
export const guestbookRepliesRelations = relations(guestbookReplies, ({ one }) => ({
  parent: one(guestbook, {
    fields: [guestbookReplies.guestbookId],
    references: [guestbook.id],
  }),
  author: one(users, {
    fields: [guestbookReplies.userId],
    references: [users.id],
  }),
}));

// Relasi Likes
export const guestbookLikesRelations = relations(guestbookLikes, ({ one }) => ({
  guestbook: one(guestbook, {
    fields: [guestbookLikes.guestbookId],
    references: [guestbook.id],
  }),
  user: one(users, {
    fields: [guestbookLikes.userId],
    references: [users.id],
  }),
}));

// Relasi Notifications
export const notificationsRelations = relations(notifications, ({ one }) => ({
  recipient: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  triggerUser: one(users, {
    fields: [notifications.triggerUserId],
    references: [users.id],
  }),
}));