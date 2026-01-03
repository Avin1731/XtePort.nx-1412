import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  varchar
} from "drizzle-orm/pg-core"
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