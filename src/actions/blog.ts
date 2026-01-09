"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { posts, postLikes } from "@/db/schema";
import { desc, eq, and, count } from "drizzle-orm"; // Tambah import count
import { revalidatePath } from "next/cache";

// Helper: Simple Slug Generator
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ==========================================
// 🔐 ADMIN ONLY ACTIONS
// ==========================================

export async function createPost(formData: {
  title: string;
  excerpt: string;
  content: string;
  images: string[];
  tags?: string;
  isPublished?: boolean;
}) {
  const session = await auth();
  
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized: Admin access required.");
  }

  const slug = generateSlug(formData.title);
  
  const existing = await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
  });

  if (existing) {
    throw new Error("Slug already exists. Please change the title.");
  }

  await db.insert(posts).values({
    title: formData.title,
    slug: slug,
    excerpt: formData.excerpt,
    content: formData.content,
    images: formData.images,
    tags: formData.tags,
    isPublished: formData.isPublished || false,
  });

  revalidatePath("/blog");
  revalidatePath("/dashboard/blog");
}

export async function updatePost(id: string, formData: {
    title: string;
    excerpt: string;
    content: string;
    images: string[];
    tags?: string;
    isPublished?: boolean;
}) {
    const session = await auth();

    if (session?.user?.role !== "admin") throw new Error("Unauthorized");

    await db.update(posts).set({
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        images: formData.images,
        tags: formData.tags,
        isPublished: formData.isPublished,
        updatedAt: new Date(),
    }).where(eq(posts.id, id));

    revalidatePath("/blog");
    revalidatePath("/dashboard/blog");
}

export async function deletePost(id: string) {
    const session = await auth();

    if (session?.user?.role !== "admin") throw new Error("Unauthorized");

    await db.delete(posts).where(eq(posts.id, id));
    revalidatePath("/blog");
    revalidatePath("/dashboard/blog");
}

export async function getAllPosts() {
    const session = await auth();

    if (session?.user?.role !== "admin") throw new Error("Unauthorized");

    return await db.select().from(posts).orderBy(desc(posts.createdAt));
}

// ==========================================
// 🌍 PUBLIC ACTIONS (READ ONLY + PAGINATION)
// ==========================================

export async function getPublishedPosts(page: number = 1, limit: number = 6) {
    const offset = (page - 1) * limit;

    // 1. Ambil Data
    const data = await db.query.posts.findMany({
        where: eq(posts.isPublished, true),
        orderBy: desc(posts.createdAt),
        limit: limit,
        offset: offset,
        with: {
            likes: true
        }
    });
    
    // 2. Hitung Total untuk Pagination
    const totalPosts = await db.select({ count: count() })
        .from(posts)
        .where(eq(posts.isPublished, true));
        
    const total = totalPosts[0].count;
    const totalPages = Math.ceil(total / limit);

    return {
        data,
        metadata: {
            currentPage: page,
            totalPages: totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
}

export async function getPostBySlug(slug: string) {
    const post = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
        with: {
            likes: true
        }
    });

    if (!post) return null;

    db.update(posts)
      .set({ viewCount: (post.viewCount || 0) + 1 })
      .where(eq(posts.id, post.id))
      .then(() => console.log(`View counted for: ${slug}`))
      .catch((err) => console.error("View count error", err));

    return post;
}

// ==========================================
// ❤️ LIKE ACTIONS (USER INTERACTION)
// ==========================================

export async function toggleBlogLike(slug: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Login required to like.");

    const post = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
        columns: { id: true }
    });

    if (!post) throw new Error("Post not found.");

    const existingLike = await db.query.postLikes.findFirst({
        where: and(
            eq(postLikes.postId, post.id),
            eq(postLikes.userId, session.user.id)
        )
    });

    if (existingLike) {
        await db.delete(postLikes).where(
            and(
                eq(postLikes.postId, post.id),
                eq(postLikes.userId, session.user.id)
            )
        );
    } else {
        await db.insert(postLikes).values({
            postId: post.id,
            userId: session.user.id
        });
    }

    revalidatePath(`/blog/${slug}`);
    revalidatePath("/blog");
}

export async function getBlogLikeStatus(slug: string) {
    const session = await auth();
    if (!session?.user?.id) return { hasLiked: false };

    const post = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
        columns: { id: true }
    });
    
    if (!post) return { hasLiked: false };

    const like = await db.query.postLikes.findFirst({
        where: and(
            eq(postLikes.postId, post.id),
            eq(postLikes.userId, session.user.id)
        )
    });

    return { hasLiked: !!like };
}