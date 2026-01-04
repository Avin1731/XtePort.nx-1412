import { db } from "@/lib/db";
import { guestbook, users } from "@/db/schema";
import { deleteGuestbookEntry } from "@/actions/guestbook";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { desc, eq } from "drizzle-orm";
import { Trash2, MessageSquare } from "lucide-react";
import { formatDistance } from "date-fns";

export default async function GuestbookPage() {
  const entries = await db
    .select({
      id: guestbook.id,
      message: guestbook.message,
      createdAt: guestbook.createdAt,
      userName: users.name,
      userImage: users.image,
      userEmail: users.email,
    })
    .from(guestbook)
    .leftJoin(users, eq(guestbook.userId, users.id))
    .orderBy(desc(guestbook.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Guestbook Moderation</h2>
        <div className="text-muted-foreground text-sm">
            Total Messages: <span className="font-bold text-foreground">{entries.length}</span>
        </div>
      </div>

      <div className="grid gap-4">
        {entries.length === 0 ? (
          <div className="text-center p-10 border border-dashed rounded-lg text-muted-foreground flex flex-col items-center">
            <MessageSquare className="h-10 w-10 mb-2 opacity-50" />
            <p>No messages yet.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="flex items-start gap-4 p-4 border rounded-lg bg-card hover:bg-accent/30 transition-colors">
              <Avatar className="h-10 w-10 border border-muted">
                <AvatarImage src={entry.userImage || ""} />
                <AvatarFallback>{entry.userName?.charAt(0) || "?"}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{entry.userName || "Anonymous"}</h4>
                        <span className="text-xs text-muted-foreground">({entry.userEmail})</span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {entry.createdAt ? formatDistance(new Date(entry.createdAt), new Date(), { addSuffix: true }) : "-"}
                    </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90 bg-muted/30 p-3 rounded-md border border-transparent hover:border-border transition-colors">
                    {entry.message}
                </p>
              </div>

              <form action={deleteGuestbookEntry.bind(null, entry.id)}>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    type="submit" 
                    className="text-muted-foreground hover:text-red-600 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}