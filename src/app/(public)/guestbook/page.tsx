import { auth } from "@/auth";
import { db } from "@/lib/db";
import { guestbook } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { GuestbookForm } from "@/components/guestbook/guestbook-form";
import { GuestbookEntry } from "@/components/guestbook/guestbook-entry"; 
import { Badge } from "@/components/ui/badge";
import { Hash, Filter, MessageSquare, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

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

export const getTopicColor = (topic: string) => {
  switch (topic) {
    case "Bug Report": return "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20";
    case "Hire Me": return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20";
    case "Tech Talk": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20";
    case "Feedback": return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20";
    default: return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
  }
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ topic?: string }>;
};

export default async function GuestbookPage({ searchParams }: Props) {
  const session = await auth();
  const params = await searchParams;
  const topicFilter = params.topic;

  // 🔥 1. FETCH DATA WITH RELATIONS (User + Likes + Replies w/ Likes)
  const entries = await db.query.guestbook.findMany({
    where: topicFilter ? eq(guestbook.topic, topicFilter) : undefined,
    orderBy: [desc(guestbook.createdAt)],
    with: {
      user: true,        
      likes: true,       
      replies: {         
        with: {
          author: true,  
          likes: true, // 👈 PENTING: Ambil data likes milik reply
        },
        orderBy: (replies, { asc }) => [asc(replies.createdAt)],
      },
    },
  });

  return (
    <div className="container mx-auto max-w-6xl py-24 px-6 min-h-screen">
      
      {/* HEADER */}
      <div className="mb-12 text-center md:text-left border-b border-border/40 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Guestbook Forum
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
           Join the discussion! Share your thoughts, give feedback, or just say hi.
           Use the sidebar to filter topics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* KIRI: CONTENT MAIN */}
        <div className="lg:col-span-3 space-y-8">
            <GuestbookForm user={session?.user} />

            <div className="space-y-6">
                <div className="flex items-center justify-between pb-2">
                    <h3 className="font-bold flex items-center gap-2 text-lg">
                        <MessageSquare className="w-5 h-5 text-primary" /> 
                        {topicFilter ? `${topicFilter} Discussions` : "Recent Discussions"}
                    </h3>
                    <Badge variant="secondary" className="px-3 py-1">
                        {entries.length} posts
                    </Badge>
                </div>

                {entries.length === 0 ? (
                    <div className="text-center py-16 bg-secondary/20 rounded-2xl border border-dashed border-border/60">
                        <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                             <MessageSquare className="w-6 h-6 text-muted-foreground/50" />
                        </div>
                        <p className="text-muted-foreground font-medium">No messages found in this topic yet.</p>
                        <p className="text-xs text-muted-foreground mt-1">Be the first to start the conversation!</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {entries.map((entry) => (
                           <GuestbookEntry 
                              key={entry.id} 
                              entry={entry} 
                              currentUserId={session?.user?.id}
                           />
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* KANAN: SIDEBAR (Sticky) */}
        <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
                <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/40">
                        <div className="p-1.5 bg-primary/10 rounded-md">
                            <Filter className="w-4 h-4 text-primary" /> 
                        </div>
                        <h3 className="font-bold text-sm text-foreground">Filter by Topic</h3>
                    </div>
                    
                    <div className="space-y-1">
                        {TOPICS.map((item) => (
                            <Link 
                                key={item.name} 
                                href={item.slug ? `/guestbook?topic=${item.slug}` : "/guestbook"}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all group",
                                    (item.slug === topicFilter || (!item.slug && !topicFilter))
                                        ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                            >
                                <span className="flex items-center gap-3">
                                    <Hash className={cn(
                                        "w-3.5 h-3.5 transition-opacity",
                                        (item.slug === topicFilter || (!item.slug && !topicFilter)) ? "opacity-100" : "opacity-40 group-hover:opacity-100"
                                    )} />
                                    {item.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/10 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Info className="w-16 h-16 text-blue-500" />
                    </div>
                    <h4 className="text-blue-500 font-bold text-sm mb-2 relative z-10">Community Rules</h4>
                    <ul className="text-xs text-muted-foreground space-y-2 relative z-10 list-disc pl-4">
                        <li>Be respectful to others.</li>
                        <li>No spam or self-promotion.</li>
                        <li>Use correct tags for topics.</li>
                    </ul>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}