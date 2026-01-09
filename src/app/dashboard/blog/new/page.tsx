"use client";

import { createPost } from "@/actions/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState, useRef } from "react"; // 👈 Tambah useRef
import { useRouter } from "next/navigation";
import { Loader2, Save, X, ImageIcon, Link as LinkIcon, UploadCloud } from "lucide-react";
import { toast } from "sonner";

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // State Data
  const [imageUrl, setImageUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  
  // State Khusus Upload Gambar
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 👇 FUNGSI SAKTI BUAT UPLOAD KE CLOUDINARY TANPA WIDGET
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran (misal max 4MB)
    if (file.size > 4 * 1024 * 1024) {
        toast.error("File size too big (Max 4MB)");
        return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!); // 👈 Ambil dari ENV

    try {
        // Tembak langsung ke API Cloudinary
        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: "POST", body: formData }
        );
        const data = await res.json();

        if (data.secure_url) {
            setImageUrl(data.secure_url);
            toast.success("Image uploaded successfully!");
        } else {
            throw new Error("Upload failed");
        }
    } catch (error) {
        toast.error("Error uploading image");
        console.error(error);
    } finally {
        setIsUploading(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get("title") as string,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      coverImage: imageUrl, 
      tags: formData.get("tags") as string,
      isPublished: isPublished,
    };

    try {
      await createPost(data);
      toast.success("Post created successfully!");
      router.push("/dashboard/blog");
    } catch (error) {
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

          {/* BAGIAN COVER IMAGE CUSTOM UI */}
          <div className="space-y-3 p-4 border rounded-xl bg-muted/20">
            <div className="flex items-center justify-between">
                <Label>Cover Image</Label>
                <div className="flex gap-2">
                    <Button type="button" variant={uploadMode === "file" ? "default" : "outline"} size="sm" onClick={() => setUploadMode("file")} className="h-7 text-xs">
                        <ImageIcon className="w-3 h-3 mr-1"/> Upload
                    </Button>
                    <Button type="button" variant={uploadMode === "url" ? "default" : "outline"} size="sm" onClick={() => setUploadMode("url")} className="h-7 text-xs">
                        <LinkIcon className="w-3 h-3 mr-1"/> URL
                    </Button>
                </div>
            </div>

            {imageUrl ? (
                <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border bg-muted group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Cover preview" className="object-cover w-full h-full" />
                    <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" 
                        onClick={() => setImageUrl("")}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : uploadMode === "file" ? (
                // 👇 UI KOTAK PUTUS-PUTUS CUSTOM (Gak Pake Widget Cloudinary)
                <div 
                    onClick={() => fileInputRef.current?.click()} // Trigger input file saat div diklik
                    className="cursor-pointer border-2 border-dashed border-muted-foreground/25 rounded-lg bg-background hover:bg-muted/50 transition flex flex-col justify-center items-center min-h-[150px] gap-2 p-4 text-muted-foreground hover:text-primary"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <span className="text-sm font-medium animate-pulse">Uploading to Cloud...</span>
                        </>
                    ) : (
                        <>
                            <div className="p-3 bg-muted rounded-full">
                                <UploadCloud className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-medium">Click to Upload Image</span>
                            <span className="text-xs text-muted-foreground">Max file size 4MB</span>
                        </>
                    )}
                    {/* Hidden Input File */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        disabled={isUploading}
                    />
                </div>
            ) : (
                <Input placeholder="https://example.com/image.jpg" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            )}
            
            <input type="hidden" name="coverImage" value={imageUrl} />
          </div>

          {/* ... SISA FORM SAMA ... */}
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label>Excerpt (Short Description)</Label>
                <Textarea name="excerpt" placeholder="Brief summary for SEO cards..." className="h-24" required />
             </div>
             <div className="space-y-2">
                <Label>Tags (Comma separated)</Label>
                <Input name="tags" placeholder="Next.js, React, Tutorial" />
                
                <div className="flex items-center space-x-2 pt-4 bg-muted/30 p-3 rounded-lg border">
                    <Switch 
                        id="publish-mode" 
                        checked={isPublished} 
                        onCheckedChange={setIsPublished} 
                    />
                    <Label htmlFor="publish-mode" className="cursor-pointer select-none">
                        Publish Immediately?
                    </Label>
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