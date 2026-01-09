import { db } from "@/lib/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import EditPostForm from "@/components/dashboard/edit-form"; // Pastikan path ini sesuai lokasi file form kamu

// 👇 Update Tipe Props: params adalah Promise
export default async function EditPostPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 👇 WAJIB: Unwrapping params dengan await
  const { id } = await params;

  const post = await db.query.posts.findFirst({
    where: eq(posts.id, id), // Gunakan variable id yang sudah di-await
  });

  if (!post) {
    redirect("/dashboard/blog");
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <p className="text-muted-foreground">Updating: {post.title}</p>
      </div>
      <EditPostForm post={post} />
    </div>
  );
}