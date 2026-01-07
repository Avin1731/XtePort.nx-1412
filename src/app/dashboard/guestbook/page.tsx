import { auth } from "@/auth";
import { db } from "@/lib/db";
import { guestbook, users, guestbookReplies, guestbookLikes } from "@/db/schema"; // guestbookLikes dipakai di SQL
import { desc, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { DeleteGuestbookButton } from "@/components/dashboard/guestbook/delete-button";
import { ThreadSheet } from "@/components/dashboard/guestbook/thread-sheet";
import { MarkReadButton } from "@/components/dashboard/guestbook/mark-read-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Mail, ListFilter, X } from "lucide-react";
import Link from "next/link";

const TOPICS = [
    { name: "General", slug: "General" },
    { name: "Tech Talk", slug: "Tech Talk" },
    { name: "Feedback", slug: "Feedback" },
    { name: "Bug Report", slug: "Bug Report" },
    { name: "Hire Me", slug: "Hire Me" },
];

const getTopicColor = (topic: string) => {
    switch (topic) {
        case "Bug Report": return "bg-red-500/10 text-red-500 border-red-500/20";
        case "Hire Me": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        case "Tech Talk": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
        case "Feedback": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
        default: return "bg-secondary text-secondary-foreground";
    }
};

type Props = {
    searchParams: Promise<{ topic?: string }>;
};

export default async function GuestbookDashboard({ searchParams }: Props) {
  const session = await auth();
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  const params = await searchParams;
  const currentTopic = params.topic;

  const entries = await db
    .select({
      id: guestbook.id,
      message: guestbook.message,
      topic: guestbook.topic,
      createdAt: guestbook.createdAt,
      isRead: guestbook.isRead,
      user: {
        name: users.name,
        email: users.email,
        image: users.image,
      },
      replyCount: sql<number>`(
        SELECT count(*) FROM ${guestbookReplies} 
        WHERE ${guestbookReplies.guestbookId} = ${guestbook.id}
      )`.mapWith(Number),
      likeCount: sql<number>`(
        SELECT count(*) FROM ${guestbookLikes} 
        WHERE ${guestbookLikes.guestbookId} = ${guestbook.id}
      )`.mapWith(Number)
    })
    .from(guestbook)
    .leftJoin(users, eq(guestbook.userId, users.id))
    .where(currentTopic ? eq(guestbook.topic, currentTopic) : undefined)
    .orderBy(desc(guestbook.createdAt));

  // Gunakan unreadCount di UI
  const unreadCount = entries.filter(e => !e.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Guestbook Manager</h2>
            {/* Tampilkan Unread Count */}
            <div className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                Unread: <span className="font-bold text-foreground">{unreadCount}</span>
            </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-border/40">
            <div className="flex items-center gap-2 mr-2 text-sm text-muted-foreground">
                <ListFilter className="w-4 h-4" />
                <span>Filter:</span>
            </div>

            <Link
                href="/dashboard/guestbook"
                className={cn(
                    "text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1",
                    !currentTopic 
                        ? "bg-foreground text-background font-medium border-foreground" 
                        : "bg-background text-muted-foreground border-border hover:border-foreground/50"
                )}
            >
                All {currentTopic && <X className="w-3 h-3 ml-1" />} 
            </Link>

            {TOPICS.map((item) => {
                const isActive = currentTopic === item.slug;
                return (
                    <Link
                        key={item.name}
                        href={`/dashboard/guestbook?topic=${item.slug}`}
                        className={cn(
                            "text-xs px-3 py-1.5 rounded-full border transition-all",
                            isActive 
                                ? cn(getTopicColor(item.name), "border-current font-medium shadow-sm")
                                : "bg-background text-muted-foreground border-border hover:border-primary/50"
                        )}
                    >
                        {item.name}
                    </Link>
                );
            })}
        </div>
      </div>

      <div className="grid gap-4">
        {entries.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl flex flex-col items-center bg-muted/5">
                <Mail className="h-10 w-10 mb-3 opacity-20" />
                <p>No messages found {currentTopic && `in "${currentTopic}"`}.</p>
                {currentTopic && (
                    <Link href="/dashboard/guestbook" className="text-xs text-primary hover:underline mt-2">
                        Clear filter
                    </Link>
                )}
            </div>
        ) : (
            entries.map((entry) => (
            <div 
                key={entry.id} 
                className={cn(
                    "flex flex-col sm:flex-row gap-4 p-4 border rounded-xl transition-all duration-200 group",
                    !entry.isRead 
                        ? "bg-blue-50/50 dark:bg-blue-950/10 border-blue-200 dark:border-blue-900 shadow-sm" 
                        : "bg-card border-border/50 hover:border-primary/20"
                )}
            >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                    <Avatar className="h-10 w-10 border shadow-sm shrink-0">
                        <AvatarImage src={entry.user?.image || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {entry.user?.name?.[0] || "?"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-sm truncate">
                                    {entry.user?.name || "Guest"}
                                </h4>
                                <span className="text-xs text-muted-foreground hidden sm:inline truncate max-w-[120px]">
                                    ({entry.user?.email || "No Email"})
                                </span>
                                <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5 font-medium border", getTopicColor(entry.topic))}>
                                    {entry.topic}
                                </Badge>
                                {!entry.isRead && (
                                    <Badge variant="default" className="h-5 px-1.5 text-[10px] bg-blue-600 hover:bg-blue-700 border-none shadow-none">
                                        New
                                    </Badge>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                                {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                        <p className={cn(
                            "text-sm leading-relaxed break-words",
                            !entry.isRead ? "text-foreground font-medium" : "text-foreground/90"
                        )}>
                            {entry.message}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1 sm:self-center justify-end border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0 shrink-0">
                    <ThreadSheet 
                        guestbookId={entry.id} 
                        triggerCount={entry.replyCount} 
                    />
                    <DeleteGuestbookButton id={entry.id} />
                    {!entry.isRead && (
                        <MarkReadButton id={entry.id} />
                    )}
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
}