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

interface ReplyButtonProps {
  guestbookId: string;
  authorName: string;
  currentUserId?: string;
}

export function ReplyButton({ guestbookId, authorName, currentUserId }: ReplyButtonProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsLoading(true);
    const result = await submitReply(guestbookId, content);
    setIsLoading(false);

    if (result?.success) {
      toast.success("Reply sent!");
      setContent("");
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
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleOpen}
          className="flex items-center gap-1.5 px-2 text-muted-foreground hover:text-foreground"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs font-medium">Reply</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Replying to {authorName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <Textarea
            placeholder="Write your reply..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none"
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