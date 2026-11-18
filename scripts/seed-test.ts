import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/db/schema";

if (process.env.USE_LOCAL_PG !== "1" || process.env.VERCEL || process.env.VERCEL_ENV) {
  throw new Error(
    "Refusing to run test seed outside local Postgres test environment (USE_LOCAL_PG=1)."
  );
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for test seeding.");
}

async function seedTestDatabase() {
  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  try {
    // Clear tables in safe dependency order so seeding is idempotent
    await db.delete(schema.postLikes);
    await db.delete(schema.posts);
    await db.delete(schema.guestbookReplyLikes);
    await db.delete(schema.guestbookLikes);
    await db.delete(schema.guestbookReplies);
    await db.delete(schema.guestbook);
    await db.delete(schema.notifications);
    await db.delete(schema.messages);
    await db.delete(schema.visitors);
    await db.delete(schema.experience);
    await db.delete(schema.profile);
    await db.delete(schema.projects);
    await db.delete(schema.techStack);
    await db.delete(schema.users);

    const [adminUser, visitorUser] = await db
      .insert(schema.users)
      .values([
        {
          id: "e2e-admin-id",
          name: "E2E Admin",
          email: process.env.ADMIN_EMAIL || "admin@example.com",
          role: "admin",
        },
        {
          id: "e2e-user-id",
          name: "E2E Visitor",
          email: "visitor@example.com",
          role: "user",
        },
      ])
      .returning();

    const [seededProfile] = await db
      .insert(schema.profile)
      .values({
        fullName: "Avin E2E",
        headline: "Fullstack Developer & Automation Tester",
        bio: "Building reliable Next.js applications with automated testing.",
        location: "Indonesia",
        cvUrl: "https://example.com/cv.pdf",
      })
      .returning();

    await db.insert(schema.experience).values({
      profileId: seededProfile.id,
      company: "A-1412 Labs",
      role: "Lead Fullstack Engineer",
      description: "Architected dynamic portfolio system and CI/CD pipelines.",
      startDate: new Date("2025-01-01"),
      isCurrent: true,
      sortOrder: 1,
    });

    await db.insert(schema.techStack).values([
      { name: "Next.js", category: "Frontend", iconName: "nextjs" },
      { name: "TypeScript", category: "Language", iconName: "typescript" },
    ]);

    await db.insert(schema.projects).values([
      {
        title: "A-1412 Automated Portfolio",
        description: "Dynamic portfolio built with Next.js, Drizzle, and Playwright.",
        demoUrl: "https://example.com/demo",
        repoUrl: "https://github.com/Avin1731/XtePort.nx-1412",
        techStack: "Next.js, TypeScript, Drizzle",
        isFeatured: true,
      },
      {
        title: "CLI Starter Kit",
        description: "Reusable CLI helper for automated workflows.",
        repoUrl: "https://github.com/Avin1731/cli-kit",
        techStack: "Node.js, TypeScript",
        isFeatured: false,
      },
    ]);

    await db.insert(schema.posts).values([
      {
        title: "Automated CI & GFM Tables Guide",
        slug: "automated-ci-gfm-tables",
        excerpt: "Testing markdown table rendering and search indexing in E2E.",
        content: [
          "## Overview",
          "",
          "This post verifies **GitHub Flavored Markdown** table rendering.",
          "",
          "| Check | Status |",
          "| :--- | :--- |",
          "| TypeScript | Passing |",
          "| Playwright E2E | Active |",
        ].join("\n"),
        images: [],
        tags: "DevOps, Playwright",
        isPublished: true,
      },
      {
        title: "Second Sample Post",
        slug: "second-sample-post",
        excerpt: "Used to verify tag filtering and search queries.",
        content: "## Details\n\nSecond article body for filter validation.",
        images: [],
        tags: "Next.js",
        isPublished: true,
      },
    ]);

    await db.insert(schema.guestbook).values({
      userId: visitorUser.id,
      message: "Hello from E2E seed data!",
      topic: "General",
      isRead: false,
    });

    console.log(
      `Seeded E2E test data (admin=${adminUser.email}, visitor=${visitorUser.email})`
    );
  } finally {
    await pool.end();
  }
}

seedTestDatabase().catch((err) => {
  console.error("Failed to seed E2E database:", err);
  process.exit(1);
});
