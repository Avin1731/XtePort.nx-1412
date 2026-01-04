import { auth } from "@/auth";
import { db } from "@/lib/db";
import { guestbook, users } from "@/db/schema";
import { GuestbookForm } from "@/components/guestbook/guestbook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { desc, eq } from "drizzle-orm";
import { formatDistance } from "date-fns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guestbook | A-1412",
  description: "Leave a message for the future visitors.",
};

export default async function GuestbookPage() {
  const session = await auth();

  // Ambil Data Guestbook
  const entries = await db
    .select({
      id: guestbook.id,
      message: guestbook.message,
      createdAt: guestbook.createdAt,
      userName: users.name,
      userImage: users.image,
    })
    .from(guestbook)
    .leftJoin(users, eq(guestbook.userId, users.id))
    .orderBy(desc(guestbook.createdAt))
    .limit(50);

  return (
    <section className="container max-w-3xl mx-auto px-4 py-20 min-h-screen">
      <div className="text-center mb-12 space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Guestbook</h1>
        <p className="text-muted-foreground">See what others are saying.</p>
      </div>

      <GuestbookForm user={session?.user} />

      <div className="space-y-6">
        {entries.length === 0 ? (
           <div className="text-center py-12 text-muted-foreground italic">
             No messages yet. Be the first one! 🚀
           </div>
        ) : (
            entries.map((entry) => (
            <div key={entry.id} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Avatar className="h-10 w-10 border shadow-sm mt-1">
                <AvatarImage src={entry.userImage || ""} />
                <AvatarFallback>{entry.userName?.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                <div className="flex items-baseline justify-between mb-1">
                    <h4 className="text-sm font-bold text-foreground mr-2">
                    {entry.userName}
                    </h4>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                        {entry.createdAt 
                            ? formatDistance(new Date(entry.createdAt), new Date(), { addSuffix: true }) 
                            : "just now"}
                    </span>
                </div>
                <div className="text-sm text-foreground/80 leading-relaxed bg-muted/20 p-3 rounded-br-xl rounded-bl-xl rounded-tr-xl border border-transparent group-hover:border-border transition-colors">
                    {entry.message}
                </div>
                </div>
            </div>
            ))
        )}
      </div>
    </section>
  );
}