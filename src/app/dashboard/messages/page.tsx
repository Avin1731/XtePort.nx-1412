import { db } from "@/lib/db";
import { messages } from "@/db/schema";
import { deleteMessage } from "@/actions/message";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { desc } from "drizzle-orm";
import { Trash2, Mail, Clock } from "lucide-react";
import { formatDistance } from "date-fns";

export default async function MessagesPage() {
  // Ambil data pesan
  const data = await db
    .select()
    .from(messages)
    .orderBy(desc(messages.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inbox Messages</h2>
        <div className="text-muted-foreground">
          Total: <span className="font-bold text-foreground">{data.length}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
            <Mail className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p>No messages yet.</p>
          </div>
        ) : (
          data.map((msg) => (
            <Card key={msg.id} className="group hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {msg.createdAt 
                        ? formatDistance(new Date(msg.createdAt), new Date(), { addSuffix: true }) 
                        : "Unknown date"}
                </div>
                
                {/* Delete Button */}
                <form action={deleteMessage.bind(null, msg.id)}>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 -mt-1 -mr-2"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </form>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground/90">
                    {msg.content}
                </p>
                {msg.userId ? (
                    <div className="mt-4 pt-3 border-t text-xs text-muted-foreground flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Sent by Registered User
                    </div>
                ) : (
                    <div className="mt-4 pt-3 border-t text-xs text-muted-foreground flex items-center gap-1">
                         <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                         Sent by Guest
                    </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}