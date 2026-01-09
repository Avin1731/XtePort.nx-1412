import { getPostBySlug } from "@/actions/blog";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Eye, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PostCarousel } from "@/components/dashboard/PostCarousel"; // Import Carousel yang benar
import ReactMarkdown from "react-markdown";

// Generate Metadata untuk SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return { title: "Post Not Found" };
    
    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            images: Array.isArray(post.images) && post.images.length > 0 ? [post.images[0]] : [],
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params (Next.js 15/16 requirement)
  const { slug } = await params;
  
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Pastikan images adalah array
  const images = Array.isArray(post.images) 
    ? (post.images as string[]) 
    : typeof post.images === 'string' 
        ? [post.images] 
        : [];

  return (
    <article className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="-ml-4 text-muted-foreground">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Blog
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-wrap gap-2">
            {post.tags?.split(',').map((tag, i) => (
                <Badge key={i} variant="secondary">{tag.trim()}</Badge>
            ))}
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-8">
            <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.viewCount} views</span>
            </div>
             {/* Hitung estimasi baca (200 kata/menit) */}
            <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{Math.ceil(post.content.length / 1000)} min read</span>
            </div>
        </div>
      </div>

      {/* CAROUSEL GALLERY */}
      {images.length > 0 && (
        <div className="mb-10">
            <PostCarousel images={images} aspectRatio="video" />
            <p className="text-center text-sm text-muted-foreground mt-2 italic">
                {images.length > 1 ? "Swipe or use arrows to see more photos" : "Article Cover"}
            </p>
        </div>
      )}

      {/* CONTENT BODY */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

    </article>
  );
}