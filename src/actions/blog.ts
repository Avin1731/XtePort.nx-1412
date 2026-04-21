"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { posts, postLikes } from "@/db/schema";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Helper: Simple Slug Generator
function generateSlug(title: string) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// Helper: Normalize Images
function normalizeImages(images: unknown): string[] {
    if (!images) return [];
    if (Array.isArray(images)) return images as string[];
    if (typeof images === "string") {
        try {
            const parsed = JSON.parse(images);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [images];
        }
    }
    return [];
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
        slug,
        excerpt: formData.excerpt,
        content: formData.content,
        images: formData.images,
        tags: formData.tags,
        isPublished: formData.isPublished || false,
    });

    revalidatePath("/blog");
    revalidatePath("/dashboard/blog");
}

export async function updatePost(
    id: string,
    formData: {
        title: string;
        excerpt: string;
        content: string;
        images: string[];
        tags?: string;
        isPublished?: boolean;
    }
) {
    const session = await auth();
    if (session?.user?.role !== "admin") throw new Error("Unauthorized");

    await db
        .update(posts)
        .set({
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content,
            images: formData.images,
            tags: formData.tags,
            isPublished: formData.isPublished,
            updatedAt: new Date(),
        })
        .where(eq(posts.id, id));

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

    return db.select().from(posts).orderBy(desc(posts.createdAt));
}

// ==========================================
// 🌍 PUBLIC ACTIONS (TAG + KEYWORD SEARCH)
// ==========================================

export async function getPublishedPosts(
    page: number = 1,
    limit: number = 6,
    tag?: string,
    query?: string
) {
    const offset = (page - 1) * limit;
    const normalizedTag = tag?.trim();
    const normalizedQuery = query?.trim();

    let whereCondition = eq(posts.isPublished, true);

    if (normalizedTag) {
        whereCondition = and(whereCondition, ilike(posts.tags, `%${normalizedTag}%`))!;
    }

    if (normalizedQuery) {
        const queryCondition = or(
            ilike(posts.title, `%${normalizedQuery}%`),
            ilike(posts.excerpt, `%${normalizedQuery}%`),
            ilike(posts.content, `%${normalizedQuery}%`),
            ilike(posts.tags, `%${normalizedQuery}%`)
        );

        if (queryCondition) {
            whereCondition = and(whereCondition, queryCondition)!;
        }
    }

    const rawData = await db.query.posts.findMany({
        where: whereCondition,
        orderBy: desc(posts.createdAt),
        limit,
        offset,
        with: {
            likes: true,
        },
    });

    const data = rawData.map((post) => ({
        ...post,
        images: normalizeImages(post.images),
    }));

    const totalPosts = await db.select({ count: count() }).from(posts).where(whereCondition);
    const total = totalPosts[0].count;
    const totalPages = Math.ceil(total / limit);

    return {
        data,
        metadata: {
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            totalItems: total,
        },
    };
}

export async function getPostBySlug(slug: string) {
    const post = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
        with: {
            likes: true,
        },
    });

    if (!post) return null;

    return {
        ...post,
        images: normalizeImages(post.images),
    };
}

// ==========================================
// 👁️ VIEW COUNTING (SMART COOKIE CHECK)
// ==========================================

export async function incrementPostView(slug: string) {
    const cookieStore = await cookies();
    const cookieName = `viewed_${slug}`;

    if (cookieStore.has(cookieName)) {
        return;
    }

    const post = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
        columns: { id: true, viewCount: true },
    });

    if (!post) return;

    await db
        .update(posts)
        .set({ viewCount: (post.viewCount || 0) + 1 })
        .where(eq(posts.id, post.id));

    cookieStore.set(cookieName, "true", {
        maxAge: 60 * 60 * 24,
        path: "/",
        httpOnly: true,
    });

    revalidatePath(`/blog/${slug}`);
}

// ==========================================
// ❤️ LIKE ACTIONS
// ==========================================

export async function toggleBlogLike(postId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const existingLike = await db.query.postLikes.findFirst({
        where: and(eq(postLikes.postId, postId), eq(postLikes.userId, session.user.id)),
    });

    if (existingLike) {
        await db
            .delete(postLikes)
            .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, session.user.id)));
    } else {
        await db.insert(postLikes).values({
            postId,
            userId: session.user.id,
        });
    }

    revalidatePath("/blog");
    return { liked: !existingLike };
}

export async function getLikeStatus(postId: string) {
    const session = await auth();

    const totalLikes = await db
        .select({ count: count() })
        .from(postLikes)
        .where(eq(postLikes.postId, postId));
    const likesCount = totalLikes[0].count;

    if (!session?.user?.id) {
        return { hasLiked: false, likesCount };
    }

    const like = await db.query.postLikes.findFirst({
        where: and(eq(postLikes.postId, postId), eq(postLikes.userId, session.user.id)),
    });

    return { hasLiked: !!like, likesCount };
}