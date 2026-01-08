"use client";

import { updatePost } from "@/actions/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
// 👇 IMPORT TYPE HELPER
import { type InferSelectModel } from "drizzle-orm";
import { posts } from "@/db/schema";

// 👇 DEFINISI TYPE POST YANG BENAR
type Post = InferSelectModel<typeof posts>;

export default function EditPostForm({ post }: { post: Post }) { // 👈 Ganti 'any' dengan 'Post'
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get("title") as string,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      coverImage: formData.get("coverImage") as string,
      tags: formData.get("tags") as string,
      isPublished: formData.get("isPublished") === "on",
    };

    try {
      await updatePost(post.id, data);
      toast.success("Post updated successfully!");
      router.push("/dashboard/blog");
    } catch (error) {
      // 👇 FIX: Handling error yang aman
      const message = error instanceof Error ? error.message : "Failed to update post";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input name="title" defaultValue={post.title} required />
        </div>

        <div className="space-y-2">
          <Label>Cover Image URL</Label>
          <Input name="coverImage" defaultValue={post.coverImage || ""} />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea name="excerpt" defaultValue={post.excerpt} className="h-24" required />
            </div>
            <div className="space-y-2">
                <Label>Tags</Label>
                <Input name="tags" defaultValue={post.tags || ""} />
                <div className="flex items-center space-x-2 pt-4">
                    <Switch name="isPublished" id="publish-mode" defaultChecked={post.isPublished || false} />
                    <Label htmlFor="publish-mode">Published</Label>
                </div>
            </div>
        </div>

        <div className="space-y-2">
          <Label>Content (Markdown)</Label>
          <Textarea 
            name="content" 
            defaultValue={post.content} 
            className="font-mono text-sm min-h-[400px]" 
            required 
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Update Post
        </Button>
      </div>
    </form>
  );
}