"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { deleteReply, getRepliesForAdmin } from "@/actions/admin-guestbook";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

// Definisi tipe data reply untuk state
type AdminReply = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
    email: string | null;
  } | null;
};

interface ThreadSheetProps {
  guestbookId: string;
  triggerCount?: number;
}

export function ThreadSheet({ guestbookId, triggerCount = 0 }: ThreadSheetProps) {
  const [replies, setReplies] = useState<AdminReply[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = async (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setIsLoading(true);
      try {
        const data = await getRepliesForAdmin(guestbookId);
        // Mapping hasil query ke tipe state yang aman
        const mappedData: AdminReply[] = data.map(item => ({
            id: item.id,
            content: item.content,
            createdAt: item.createdAt,
            user: item.user ? {
                name: item.user.name,
                image: item.user.image,
                email: item.user.email
            } : null
        }));
        setReplies(mappedData);
      } catch {
        toast.error("Failed to fetch replies");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async (replyId: string) => {
    if (!confirm("Delete this reply permanently?")) return;

    const res = await deleteReply(replyId);
    if (res.success) {
      setReplies((prev) => prev.filter((r) => r.id !== replyId));
      toast.success("Reply deleted");
    } else {
      toast.error("Failed to delete");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-8 relative">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Thread</span>
            {triggerCount > 0 && (
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {triggerCount}
                </span>
            )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Manage Thread</SheetTitle>
          <SheetDescription>Moderate replies for this post.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : replies.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-xl">
                <p className="text-muted-foreground">No replies found.</p>
            </div>
          ) : (
            replies.map((reply) => (
              <div key={reply.id} className="flex gap-3 p-4 border rounded-lg bg-card/50">
                <Avatar className="w-8 h-8 border">
                  <AvatarImage src={reply.user?.image || ""} />
                  <AvatarFallback>{reply.user?.name?.[0] || "?"}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold truncate pr-2">
                        {reply.user?.name || "Unknown"}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 break-words">{reply.content}</p>
                  <p className="text-[10px] text-muted-foreground pt-1">{reply.user?.email}</p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-red-600 h-7 w-7"
                  onClick={() => handleDelete(reply.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}