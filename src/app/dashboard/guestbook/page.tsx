import { auth } from "@/auth";
import { db } from "@/lib/db";
import { guestbook, users, guestbookReplies } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { DeleteGuestbookButton } from "@/components/dashboard/guestbook/delete-button";
import { ThreadSheet } from "@/components/dashboard/guestbook/thread-sheet";
import { Badge } from "@/components/ui/badge";

export default async function GuestbookDashboard() {
  const session = await auth();
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  // 1. Fetch Entries + Count Replies (Subquery SQL Manual)
  // Ini aman karena tidak bergantung pada 'relations' di schema
  const entries = await db
    .select({
      id: guestbook.id,
      message: guestbook.message,
      topic: guestbook.topic,
      createdAt: guestbook.createdAt,
      user: {
        name: users.name,
        email: users.email,
        image: users.image,
      },
      // Menghitung jumlah reply secara manual lewat SQL
      replyCount: sql<number>`(
        SELECT count(*) FROM ${guestbookReplies} 
        WHERE ${guestbookReplies.guestbookId} = ${guestbook.id}
      )`.mapWith(Number)
    })
    .from(guestbook)
    .leftJoin(users, eq(guestbook.userId, users.id))
    .orderBy(desc(guestbook.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Guestbook Manager</h2>
      </div>

      <div className="grid gap-4">
        {entries.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
                <p className="text-muted-foreground">No entries found yet.</p>
            </div>
        ) : (
            entries.map((entry) => (
            <Card key={entry.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4 bg-muted/30">
                <Avatar className="h-10 w-10 border">
                    <AvatarImage src={entry.user?.image || ""} />
                    <AvatarFallback>{entry.user?.name?.[0] || "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm truncate">{entry.user?.name}</h3>
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5">{entry.topic}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                            {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{entry.user?.email}</p>
                </div>
                </CardHeader>
                <CardContent className="p-4 pt-4">
                <div className="mb-4 p-3 bg-background rounded-md border text-sm shadow-sm">
                    {entry.message}
                </div>
                
                <div className="flex items-center justify-end gap-2 border-t pt-3">
                    {/* TOMBOL THREAD MANAGER (New Feature) */}
                    <ThreadSheet 
                        guestbookId={entry.id} 
                        triggerCount={entry.replyCount} 
                    />

                    {/* TOMBOL DELETE UTAMA */}
                    <DeleteGuestbookButton id={entry.id} /> 
                </div>
                </CardContent>
            </Card>
            ))
        )}
      </div>
    </div>
  );
}