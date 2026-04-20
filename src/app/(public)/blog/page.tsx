import { getPublishedPosts } from "@/actions/blog";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { PostCarousel } from "@/components/dashboard/PostCarousel"; 
import { Button } from "@/components/ui/button";
import { auth } from "@/auth"; 
import { LikeButton } from "@/components/dashboard/like-button"; 
import { ContentSearchForm } from "@/components/search/content-search-form";

export const metadata = {
  title: "Blog - My Awesome Project",
  description: "Read our latest articles and tutorials.",
};

function buildBlogHref({
  page,
  tag,
  q,
}: {
  page?: number;
  tag?: string;
  q?: string;
}) {
  const params = new URLSearchParams();

  if (page && page > 1) {
    params.set("page", String(page));
  }

  if (tag) {
    params.set("tag", tag);
  }

  if (q) {
    params.set("q", q);
  }

  const queryString = params.toString();

  return queryString ? `/blog?${queryString}` : "/blog";
}

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string; q?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const currentTag = params.tag?.trim();
  const currentQuery = params.q?.trim() ?? "";
  const limit = 6; 

  const session = await auth(); 

  const {
    data: posts,
    metadata: pagination,
  } = await getPublishedPosts(currentPage, limit, currentTag, currentQuery || undefined);

  const activeFilters = [
    currentTag ? `tag "${currentTag}"` : null,
    currentQuery ? `keyword "${currentQuery}"` : null,
  ].filter(Boolean);

  const isFiltered = activeFilters.length > 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col items-center text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Our Blog</h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Insights, tutorials, and updates from our team.
        </p>

        <div className="w-full max-w-2xl pt-2">
          <ContentSearchForm
            actionPath="/blog"
            query={currentQuery}
            placeholder="Search by title, excerpt, content, or tags..."
            hiddenParams={{ tag: currentTag }}
            clearHref={buildBlogHref({ tag: currentTag })}
          />
        </div>
        
        {isFiltered && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 animate-in fade-in zoom-in duration-300">
                <span className="text-sm text-muted-foreground">Filtered by:</span>

                {currentTag && (
                  <Badge variant="secondary" className="pl-3 pr-1 py-1 text-sm gap-2 hover:bg-secondary flex items-center">
                      #{currentTag}
                      <Link
                        href={buildBlogHref({ q: currentQuery || undefined })}
                        className="hover:text-destructive transition-colors p-1 rounded-full hover:bg-muted ml-1"
                      >
                          <X className="w-3 h-3" />
                      </Link>
                  </Badge>
                )}

                {currentQuery && (
                  <Badge variant="outline" className="pl-3 pr-1 py-1 text-sm gap-2 hover:bg-muted flex items-center">
                      <span>{`"${currentQuery}"`}</span>
                      <Link
                        href={buildBlogHref({ tag: currentTag })}
                        className="hover:text-destructive transition-colors p-1 rounded-full hover:bg-muted ml-1"
                      >
                          <X className="w-3 h-3" />
                      </Link>
                  </Badge>
                )}
            </div>
        )}
      </div>

      {posts.length > 0 && (
        <div className="mb-6 text-sm text-muted-foreground">
          Showing {posts.length} of {pagination.totalItems} post{pagination.totalItems === 1 ? "" : "s"}
          {currentQuery ? ` for "${currentQuery}"` : ""}
          {currentTag ? ` in #${currentTag}` : ""}.
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
          <p className="text-muted-foreground text-lg">
            {isFiltered ? `No posts found for ${activeFilters.join(" and ")}.` : "No posts published yet."}
          </p>
          {isFiltered && (
             <Link href="/blog">
                <Button variant="link" className="mt-2 text-primary">Clear filter</Button>
             </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const likesCount = post.likes.length;
            const hasLiked = session?.user?.id 
                ? post.likes.some((like: { userId: string }) => like.userId === session.user.id)
                : false;
            
            // Ambil tag pertama & bersihkan spasi
            const firstTag = post.tags ? post.tags.split(',')[0].trim() : null;

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
                  {/* 👇 TAGS JADI LINK */}
                  {firstTag && (
                     <div className="-mt-9 mb-3 flex justify-between items-end">
                       <Link href={buildBlogHref({ tag: firstTag, q: currentQuery || undefined })}>
                         <Badge className="shadow-sm cursor-pointer hover:bg-primary/90 transition-colors">
                           {firstTag}
                         </Badge>
                       </Link>
                     </div>
                  )}

                  {/* Metadata Row */}
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

                    <div className="transform scale-90 origin-right"> 
                        <LikeButton 
                            postId={post.id} 
                            initialLiked={hasLiked} 
                            initialCount={likesCount} 
                            isLoggedIn={!!session?.user}
                        />
                    </div>
                  </div>

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

        {/* PAGINATION (PRESERVE TAG + QUERY) */}
        {posts.length > 0 && (pagination.hasPrevPage || pagination.hasNextPage) && (
        <div className="flex justify-center gap-2 mt-12">
            <Link 
            href={buildBlogHref({
              page: pagination.currentPage - 1,
              tag: currentTag,
              q: currentQuery || undefined,
            })}
            className={!pagination.hasPrevPage ? "pointer-events-none" : ""}
            >
            <Button variant="outline" disabled={!pagination.hasPrevPage}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                </Button>
            </Link>
            
            <div className="flex items-center px-4 font-medium text-sm">
            Page {pagination.currentPage} of {pagination.totalPages}
            </div>

            <Link 
            href={buildBlogHref({
              page: pagination.currentPage + 1,
              tag: currentTag,
              q: currentQuery || undefined,
            })}
            className={!pagination.hasNextPage ? "pointer-events-none" : ""}
            >
            <Button variant="outline" disabled={!pagination.hasNextPage}>
                    Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </Link>
        </div>
      )}
    </div>
  );
}