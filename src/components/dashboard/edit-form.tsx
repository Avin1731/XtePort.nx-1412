"use client";

import { updatePost } from "@/actions/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, X, Plus, ImageIcon, Link as LinkIcon, Check } from "lucide-react"; 
import { toast } from "sonner";
import { type InferSelectModel } from "drizzle-orm";
import { posts } from "@/db/schema";

type Post = InferSelectModel<typeof posts>;

export default function EditPostForm({ post }: { post: Post }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Initialize Images
  const [images, setImages] = useState<string[]>(() => {
    if (Array.isArray(post.images)) return post.images;
    if (typeof post.images === "string") {
      try {
        const parsed = JSON.parse(post.images);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return post.images ? [post.images] : [];
      }
    }
    return [];
  });
  
  const [isPublished, setIsPublished] = useState(post.isPublished || false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Upload File Logic
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
        toast.error("Max file size 4MB"); return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: "POST", body: formData }
        );
        const data = await res.json();
        if (data.secure_url) {
            setImages((prev) => [...prev, data.secure_url]); 
            toast.success("Image added!");
        }
    } catch (error) {
        toast.error("Upload failed");
        console.error(error);
    } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  // 2. Add URL Logic
  function handleAddUrl() {
    if (!urlInput.trim()) return;
    if (!urlInput.match(/^https?:\/\/.+\/.+$/)) {
        toast.error("Invalid URL format");
        return;
    }
    setImages((prev) => [...prev, urlInput]);
    setUrlInput("");
    toast.success("URL added!");
  }

  function removeImage(indexToRemove: number) {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get("title") as string,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      images: images, 
      tags: formData.get("tags") as string,
      isPublished: isPublished, 
    };

    try {
      await updatePost(post.id, data);
      toast.success("Post updated successfully!");
      router.push("/dashboard/blog");
      router.refresh(); 
    } catch (error) {
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

        {/* 👇 UI GALLERY UPLOADER (Updated: File & URL Support) */}
        <div className="space-y-3 p-4 border rounded-xl bg-muted/20">
            <div className="flex items-center justify-between mb-2">
                <Label>Gallery ({images.length} images)</Label>
                
                {/* Toggle Mode */}
                <div className="flex bg-background border rounded-lg p-1 gap-1">
                    <Button 
                        type="button" 
                        variant={uploadMode === "file" ? "secondary" : "ghost"} 
                        size="sm" 
                        onClick={() => setUploadMode("file")} 
                        className="h-7 text-xs px-2"
                    >
                        <ImageIcon className="w-3 h-3 mr-1"/> Upload
                    </Button>
                    <Button 
                        type="button" 
                        variant={uploadMode === "url" ? "secondary" : "ghost"} 
                        size="sm" 
                        onClick={() => setUploadMode("url")} 
                        className="h-7 text-xs px-2"
                    >
                        <LinkIcon className="w-3 h-3 mr-1"/> URL
                    </Button>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((url, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden border bg-background group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`img-${index}`} className="object-cover w-full h-full" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                        </button>
                        {index === 0 && <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-medium">Cover</span>}
                    </div>
                ))}

                {/* Input Area (Dynamic) */}
                {uploadMode === "file" ? (
                    <div 
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        className={`border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col justify-center items-center aspect-video cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition bg-background ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isUploading ? <Loader2 className="w-6 h-6 animate-spin text-primary"/> : <Plus className="w-8 h-8 text-muted-foreground mb-1"/>}
                        <span className="text-xs text-muted-foreground font-medium">{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col justify-center items-center aspect-video bg-background p-2 space-y-2">
                        <Input 
                            placeholder="https://..." 
                            className="h-8 text-xs" 
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault(); 
                                    handleAddUrl();
                                }
                            }}
                        />
                        <Button type="button" size="sm" variant="secondary" className="w-full h-7 text-xs" onClick={handleAddUrl}>
                            <Check className="w-3 h-3 mr-1"/> Add URL
                        </Button>
                    </div>
                )}
            </div>

            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
          </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Excerpt</Label> <Textarea name="excerpt" defaultValue={post.excerpt || ""} className="h-24" required />
            </div>
            <div className="space-y-2">
                <Label>Tags</Label> <Input name="tags" defaultValue={post.tags || ""} />
                <div className="flex items-center space-x-2 pt-4 bg-muted/30 p-3 rounded-lg border">
                    <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                    <Label>Published</Label>
                </div>
            </div>
        </div>

        <div className="space-y-2">
          <Label>Content (Markdown)</Label>
          <Textarea name="content" defaultValue={post.content} className="font-mono text-sm min-h-[400px]" required />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Update Post</Button>
      </div>
    </form>
  );
}