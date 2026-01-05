import { db } from "@/lib/db";
import { messages, users } from "@/db/schema";
import { deleteMessage, markMessageAsRead } from "@/actions/message";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { desc, eq } from "drizzle-orm";
import { Trash2, MailOpen, Mail } from "lucide-react";
import { formatDistance } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ReplyDialog } from "@/components/dashboard/reply-dialog"; // Import Reply Dialog

export default async function MessagesPage() {
  // Join table messages dengan users untuk dapat nama, foto, dan email
  const entries = await db
    .select({
      id: messages.id,
      content: messages.content,
      isRead: messages.isRead,
      createdAt: messages.createdAt,
      userName: users.name,
      userImage: users.image,
      userEmail: users.email,
    })
    .from(messages)
    .leftJoin(users, eq(messages.userId, users.id))
    .orderBy(desc(messages.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inbox Messages</h2>
        <div className="text-muted-foreground text-sm">
            Total: <span className="font-bold text-foreground">{entries.length}</span>
        </div>
      </div>

      <div className="grid gap-4">
        {entries.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl flex flex-col items-center">
             <Mail className="h-10 w-10 mb-3 opacity-20" />
             <p>No messages yet.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div 
                key={entry.id} 
                className={`flex flex-col sm:flex-row gap-4 p-4 border rounded-xl transition-all ${entry.isRead ? 'bg-card' : 'bg-primary/5 border-primary/20 shadow-sm'}`}
            >
              {/* Kolom Kiri: Avatar & Konten */}
              <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-10 w-10 border shadow-sm">
                    <AvatarImage src={entry.userImage || ""} />
                    <AvatarFallback>{entry.userName?.charAt(0) || "?"}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm">{entry.userName || "Guest"}</h4>
                            
                            {/* Email Display */}
                            <span className="text-xs text-muted-foreground hidden sm:inline">
                                ({entry.userEmail || "No Email"})
                            </span>

                            {/* Badge New */}
                            {!entry.isRead && (
                                <Badge variant="default" className="h-5 px-1.5 text-[10px] bg-blue-600 hover:bg-blue-700">
                                    New
                                </Badge>
                            )}
                        </div>
                        
                        {/* Waktu */}
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {entry.createdAt ? formatDistance(new Date(entry.createdAt), new Date(), { addSuffix: true }) : "-"}
                        </span>
                    </div>
                    
                    {/* Isi Pesan */}
                    <p className="text-sm leading-relaxed text-foreground/90">
                        {entry.content}
                    </p>
                  </div>
              </div>

              {/* Kolom Kanan: Actions */}
              <div className="flex items-center gap-1 sm:self-center justify-end border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                
                {/* 1. TOMBOL REPLY (Memanggil Dialog) */}
                <ReplyDialog 
                    messageId={entry.id} 
                    userName={entry.userName || "Guest"} 
                    userEmail={entry.userEmail} 
                />

                {/* 2. MARK AS READ (Hanya muncul jika belum dibaca) */}
                {!entry.isRead && (
                    <form action={markMessageAsRead.bind(null, entry.id)}>
                        <Button variant="ghost" size="icon" type="submit" title="Mark as Read">
                            <MailOpen className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </Button>
                    </form>
                )}

                {/* 3. DELETE */}
                <form action={deleteMessage.bind(null, entry.id)}>
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}