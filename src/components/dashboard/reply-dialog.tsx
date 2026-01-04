"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Reply, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { sendReply } from "@/actions/reply";

interface ReplyDialogProps {
  messageId: string;
  userName: string;
  userEmail?: string | null;
}

export function ReplyDialog({ messageId, userName, userEmail }: ReplyDialogProps) {
  const [open, setOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSend() {
    if (!replyText.trim()) return;

    setIsSending(true);
    // Panggil Server Action
    const result = await sendReply(messageId, replyText);
    setIsSending(false);

    if (result.success) {
      toast.success("Reply sent successfully!");
      setOpen(false);
      setReplyText(""); // Reset form
    } else {
      toast.error(result.error || "Failed to send reply");
    }
  }

  // Jika user tidak punya email (Guest), tombol disable & transparan
  if (!userEmail) {
    return (
      <Button variant="ghost" size="icon" disabled title="No email available (Guest)">
        <Reply className="h-4 w-4 opacity-20" />
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10">
          <Reply className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reply to {userName}</DialogTitle>
          <DialogDescription>
            Sending email to <span className="font-mono text-xs bg-muted px-1 rounded">{userEmail}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reply">Your Message</Label>
            <Textarea
              id="reply"
              placeholder={`Hello ${userName}, thanks for your message...`}
              className="h-40 resize-none"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSend} disabled={isSending || !replyText.trim()}>
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Reply
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}