"use server";

import { auth } from "@/auth"; // Sesuai dengan auth.ts kamu
import { db } from "@/lib/db"; // Sesuai dengan db.ts kamu
import { posts, postLikes } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
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
  images: string[]; // 👈 Updated: Array of Strings
  tags?: string;
  isPublished?: boolean;
}) {
  const session = await auth();
  
  // Cek Role (sesuai auth.ts session callback)

  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized: Admin access required.");
  }

  const slug = generateSlug(formData.title);
  
  // Cek duplikat slug menggunakan db query API
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
    images: formData.images, // 👈 Insert Array JSON
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
    images: string[]; // 👈 Updated: Array of Strings
    tags?: string;
    isPublished?: boolean;
}) {
    const session = await auth();

    if (session?.user?.role !== "admin") throw new Error("Unauthorized");

    // Kita tidak update SLUG agar link SEO tidak rusak/berubah
    await db.update(posts).set({
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        images: formData.images, // 👈 Update Array JSON
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
// 🌍 PUBLIC ACTIONS (READ ONLY)
// ==========================================

export async function getPublishedPosts() {
    // Ambil semua artikel yang isPublished = true untuk halaman /blog user
    const data = await db.query.posts.findMany({
        where: eq(posts.isPublished, true),
        orderBy: desc(posts.createdAt),
        with: {
            likes: true // Mengambil relasi likes untuk menghitung jumlahnya di UI
        }
    });
    
    return data;
}

export async function getPostBySlug(slug: string) {
    // Mengambil detail artikel berdasarkan URL (slug)
    const post = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
        with: {
            likes: true
        }
    });

    if (!post) return null;

    // Increment View Count (Fire & Forget)
    // Tidak di-await agar loading page tidak menunggu database update
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

    // 1. Cari ID post berdasarkan slug
    const post = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
        columns: { id: true }
    });

    if (!post) throw new Error("Post not found.");

    // 2. Cek apakah user sudah like sebelumnya
    const existingLike = await db.query.postLikes.findFirst({
        where: and(
            eq(postLikes.postId, post.id),
            eq(postLikes.userId, session.user.id)
        )
    });

    if (existingLike) {
        // Jika sudah like -> HAPUS (Unlike)
        await db.delete(postLikes).where(
            and(
                eq(postLikes.postId, post.id),
                eq(postLikes.userId, session.user.id)
            )
        );
    } else {
        // Jika belum like -> TAMBAH (Like)
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
    // Jika tidak login, status liked = false
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