"use client";

import { createPost } from "@/actions/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch"; // 👈 Error ini akan hilang setelah install switch
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export default function NewPostPage() {
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
      await createPost(data);
      toast.success("Post created successfully!");
      router.push("/dashboard/blog");
    } catch (error) {
      // 👇 FIX: Handling error tanpa 'any'
      const message = error instanceof Error ? error.message : "Failed to create post";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Write New Post</h1>
        <p className="text-muted-foreground">Share your thoughts with the world.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input name="title" placeholder="e.g. How to use Server Actions" required />
          </div>

          <div className="space-y-2">
            <Label>Slug (Cover Image URL)</Label>
            <Input name="coverImage" placeholder="https://images.unsplash.com/..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label>Excerpt (Short Description)</Label>
                <Textarea name="excerpt" placeholder="Brief summary for SEO cards..." className="h-24" required />
             </div>
             <div className="space-y-2">
                <Label>Tags (Comma separated)</Label>
                <Input name="tags" placeholder="Next.js, React, Tutorial" />
                <div className="flex items-center space-x-2 pt-4">
                    <Switch name="isPublished" id="publish-mode" />
                    <Label htmlFor="publish-mode">Publish Immediately?</Label>
                </div>
             </div>
          </div>

          <div className="space-y-2">
            <Label>Content (Markdown)</Label>
            <Textarea 
                name="content" 
                placeholder="# Hello World\n\nWrite your content here using markdown..." 
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
            Save Post
          </Button>
        </div>
      </form>
    </div>
  );
}