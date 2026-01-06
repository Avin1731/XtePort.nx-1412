import { auth } from "@/auth";
import { db } from "@/lib/db";
import { 
  guestbook, 
  users, 
  guestbookLikes, 
  guestbookReplies, 
  guestbookReplyLikes 
} from "@/db/schema";
import { desc, eq, asc } from "drizzle-orm";
import { GuestbookForm } from "@/components/guestbook/guestbook-form";
import { GuestbookEntry } from "@/components/guestbook/guestbook-entry"; 
import { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // ✅ Tambahkan ini jika ada

export const metadata: Metadata = {
  title: "Guestbook | A-1412",
  description: "Join the discussion forum.",
};

// --- CONSTANTS & HELPERS ---
const TOPICS = [
  { name: "All Topics", slug: undefined },
  { name: "General", slug: "General" },
  { name: "Tech Talk", slug: "Tech Talk" },
  { name: "Feedback", slug: "Feedback" },
  { name: "Bug Report", slug: "Bug Report" },
  { name: "Hire Me", slug: "Hire Me" },
];

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ topic?: string }>;
};

// Type yang diharapkan oleh GuestbookEntry component
interface GuestbookEntryData {
  id: string;
  message: string;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
  likes: { userId: string }[];
  replies: {
    id: string;
    content: string;
    createdAt: Date;
    author: {
      name: string | null;
      image: string | null;
    };
    likes: { userId: string }[];
  }[];
}

export default async function GuestbookPage({ searchParams }: Props) {
  const session = await auth();
  const params = await searchParams;
  const topicFilter = params.topic;

  // 1. Ambil entri guestbook dasar
  const entries = await db.query.guestbook.findMany({
    where: topicFilter ? eq(guestbook.topic, topicFilter) : undefined,
    orderBy: [desc(guestbook.createdAt)],
  });

  // 2. Jika ada entries, ambil data relasi secara manual
  const entriesWithRelations: GuestbookEntryData[] = await Promise.all(
    entries.map(async (entry) => {
      // Ambil user
      const user = await db.query.users.findFirst({
        where: eq(users.id, entry.userId),
      });

      // Ambil likes untuk entry ini
      const likes = await db.query.guestbookLikes.findMany({
        where: eq(guestbookLikes.guestbookId, entry.id),
      });

      // Ambil replies untuk entry ini
      const replies = await db.query.guestbookReplies.findMany({
        where: eq(guestbookReplies.guestbookId, entry.id),
        orderBy: [asc(guestbookReplies.createdAt)],
      });

      // Untuk setiap reply, ambil user dan likes
      const repliesWithDetails = await Promise.all(
        replies.map(async (reply) => {
          const replyUser = await db.query.users.findFirst({
            where: eq(users.id, reply.userId),
          });

          const replyLikes = await db.query.guestbookReplyLikes.findMany({
            where: eq(guestbookReplyLikes.replyId, reply.id),
          });

          return {
            id: reply.id,
            content: reply.content,
            createdAt: reply.createdAt,
            author: {
              name: replyUser?.name || null,
              image: replyUser?.image || null,
            },
            likes: replyLikes.map(like => ({ userId: like.userId })),
          };
        })
      );

      return {
        id: entry.id,
        message: entry.message,
        createdAt: entry.createdAt,
        user: {
          name: user?.name || null,
          image: user?.image || null,
        },
        likes: likes.map(like => ({ userId: like.userId })),
        replies: repliesWithDetails,
      };
    })
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Guestbook</h1>
        <p className="text-muted-foreground">
          Join the conversation. Share your thoughts.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* MAIN CONTENT (KIRI) */}
        <div className="lg:w-3/4">
          {/* GUESTBOOK FORM */}
          <GuestbookForm user={session?.user} />

          {/* GUESTBOOK ENTRIES */}
          <div className="space-y-0">
            {entriesWithRelations.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-muted-foreground/50" />
                </div>
                <p className="text-muted-foreground font-medium">No messages found yet.</p>
                <p className="text-xs text-muted-foreground mt-1">Be the first to start the conversation!</p>
              </div>
            ) : (
              entriesWithRelations.map((entry) => (
                <GuestbookEntry 
                  key={entry.id} 
                  entry={entry} 
                  currentUserId={session?.user?.id}
                />
              ))
            )}
          </div>
        </div>

        {/* SIDEBAR (KANAN) */}
        <div className="lg:w-1/4">
          <div className="sticky top-8 space-y-6">
            {/* TOPIC FILTER CARD */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-2">
                  {TOPICS.map((item) => (
                    <a
                      key={item.name}
                      href={item.slug ? `/guestbook?topic=${item.slug}` : "/guestbook"}
                      className={`
                        block px-3 py-2 rounded-md text-sm transition-all
                        ${(item.slug === topicFilter || (!item.slug && !topicFilter))
                          ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                          : "hover:bg-secondary/50 text-secondary-foreground"}
                      `}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* COMMUNITY GUIDELINES CARD */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Community Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium text-primary">1</span>
                    </div>
                    <span>Be respectful to others</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium text-primary">2</span>
                    </div>
                    <span>No spam or self-promotion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium text-primary">3</span>
                    </div>
                    <span>Keep conversations relevant and constructive</span>
                  </li>
                </ul>
                
                {/* STATS (Optional) */}
                <div className="mt-6 pt-4 border-t border-border/30">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-primary">
                        {entriesWithRelations.length}
                      </div>
                      <div className="text-xs text-muted-foreground">Messages</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-primary">
                        {entriesWithRelations.reduce((acc, entry) => acc + entry.replies.length, 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">Replies</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}