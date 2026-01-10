import { getPublishedPosts } from "@/actions/blog";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PostCarousel } from "@/components/dashboard/PostCarousel"; 
import { Button } from "@/components/ui/button";
import { auth } from "@/auth"; 
import { LikeButton } from "@/components/dashboard/like-button"; 

export const metadata = {
  title: "Blog - My Awesome Project",
  description: "Read our latest articles and tutorials.",
};

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = 6; 

  const session = await auth(); 

  const { data: posts, metadata } = await getPublishedPosts(currentPage, limit);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col items-center text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Our Blog</h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Insights, tutorials, and updates from our team.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
          <p className="text-muted-foreground text-lg">No posts published yet.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            // 👇 FIX: Ganti 'any' jadi '{ userId: string }'
            const likesCount = post.likes.length;
            const hasLiked = session?.user?.id 
                ? post.likes.some((like: { userId: string }) => like.userId === session.user.id)
                : false;

            return (
              <div 
                key={post.id} 
                className="flex flex-col bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* 1. CAROUSEL AREA */}
                <div className="w-full">
                    {post.images.length > 0 ? (
                        <PostCarousel images={post.images} slug={post.slug} />
                    ) : (
                        <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground">
                            No Image
                        </div>
                    )}
                </div>

                {/* 2. CONTENT AREA */}
                <div className="flex flex-col flex-1 p-6 relative">
                  {/* Tags Melayang */}
                  {post.tags && (
                     <div className="-mt-9 mb-3 flex justify-between items-end">
                       <Badge className="shadow-sm">
                         {post.tags.split(',')[0]}
                       </Badge>
                     </div>
                  )}

                  {/* Metadata Row: Date, Views, Likes */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.viewCount}
                        </div>
                    </div>

                    {/* Tombol Like */}
                    <div className="transform scale-90 origin-right"> 
                        <LikeButton 
                            postId={post.id} 
                            initialLiked={hasLiked} 
                            initialCount={likesCount} 
                            isLoggedIn={!!session?.user}
                        />
                    </div>
                  </div>

                  {/* Judul sebagai Link */}
                  <Link href={`/blog/${post.slug}`} className="group/title">
                      <h2 className="text-xl font-bold mb-2 line-clamp-2 group-hover/title:text-primary transition-colors">
                        {post.title}
                      </h2>
                  </Link>
                  
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                    {post.excerpt}
                  </p>

                  <Link href={`/blog/${post.slug}`} className="flex items-center text-primary text-sm font-medium mt-auto group/btn">
                    Read Article <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      {posts.length > 0 && (metadata.hasPrevPage || metadata.hasNextPage) && (
        <div className="flex justify-center gap-2 mt-12">
            <Link href={`/blog?page=${metadata.currentPage - 1}`} className={!metadata.hasPrevPage ? "pointer-events-none" : ""}>
                <Button variant="outline" disabled={!metadata.hasPrevPage}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                </Button>
            </Link>
            <div className="flex items-center px-4 font-medium text-sm">
                Page {metadata.currentPage} of {metadata.totalPages}
            </div>
            <Link href={`/blog?page=${metadata.currentPage + 1}`} className={!metadata.hasNextPage ? "pointer-events-none" : ""}>
                <Button variant="outline" disabled={!metadata.hasNextPage}>
                    Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </Link>
        </div>
      )}
    </div>
  );
}