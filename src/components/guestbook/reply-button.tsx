"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { submitReply } from "@/actions/guestbook-social";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ReplyButtonProps {
  guestbookId: string;
  authorName: string; // Nama pemilik postingan UTAMA
  replyToUser?: string; // (Opsional) Nama user yang mau dibalas di dalam thread
  currentUserId?: string;
  isReplyButton?: boolean; // Penanda visual kalau ini tombol kecil di dalam thread
}

export function ReplyButton({ 
  guestbookId, 
  authorName, 
  replyToUser, 
  currentUserId,
  isReplyButton = false
}: ReplyButtonProps) {
  const [open, setOpen] = useState(false);
  // Kalau ada replyToUser, pre-fill text dengan mention
  const [content, setContent] = useState(replyToUser ? `@${replyToUser} ` : "");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsLoading(true);
    const result = await submitReply(guestbookId, content);
    setIsLoading(false);

    if (result?.success) {
      toast.success("Reply sent!");
      setContent(""); // Reset
      setOpen(false);
      router.refresh();
    } else {
      toast.error(result?.error || "Failed to send reply");
    }
  };

  const handleOpen = () => {
    if (!currentUserId) {
      toast.error("Please login to reply!");
      return;
    }
    // Reset content saat dibuka, pasang mention kalau ada
    setContent(replyToUser ? `@${replyToUser} ` : "");
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleOpen}
          className={cn(
            "flex items-center gap-1.5 transition-colors text-muted-foreground hover:text-foreground",
            isReplyButton ? "h-6 px-1.5 text-[10px]" : "h-8 px-2 text-xs font-medium"
          )}
        >
          <MessageCircle className={cn(isReplyButton ? "w-3 h-3" : "w-4 h-4")} />
          <span>Reply</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {replyToUser ? `Replying to @${replyToUser}` : `Replying to ${authorName}`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <Textarea
            placeholder={replyToUser ? `Replying to @${replyToUser}...` : "Write your reply..."}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none"
            autoFocus
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !content.trim()}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Sending..." : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Post Reply
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}