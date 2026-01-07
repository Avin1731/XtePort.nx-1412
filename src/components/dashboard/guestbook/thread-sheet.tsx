"use client";

import { useState, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Trash2, Loader2, Heart, Send, Reply } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { deleteReply, getThreadForAdmin, submitAdminReply } from "@/actions/admin-guestbook"; // Ganti import function
import { toggleReplyLike } from "@/actions/guestbook-social";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Tipe Data
type AdminUser = {
    name: string | null;
    image: string | null;
    email: string | null;
};

type AdminPost = {
    id: string;
    message: string;
    createdAt: Date;
    topic: string;
    user: AdminUser | null;
};

type AdminReply = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  isLiked: boolean;
  user: AdminUser | null;
};

interface ThreadSheetProps {
  guestbookId: string;
  triggerCount?: number;
}

export function ThreadSheet({ guestbookId, triggerCount = 0 }: ThreadSheetProps) {
  const [post, setPost] = useState<AdminPost | null>(null); // State Post Utama
  const [replies, setReplies] = useState<AdminReply[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Panggil fungsi baru yang return { post, replies }
      const data = await getThreadForAdmin(guestbookId);
      setPost(data.post || null);
      setReplies(data.replies);
    } catch {
      toast.error("Failed to fetch thread");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open) fetchData();
  };

  const handleDelete = async (replyId: string) => {
    if (!confirm("Delete this reply?")) return;
    const res = await deleteReply(replyId);
    if (res.success) {
      setReplies((prev) => prev.filter((r) => r.id !== replyId));
      toast.success("Deleted");
    } else {
      toast.error("Failed");
    }
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await submitAdminReply(guestbookId, replyContent);
      if (res?.success) {
        toast.success("Replied!");
        setReplyContent("");
        fetchData(); 
      } else {
        toast.error("Failed");
      }
    } catch {
      toast.error("Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (replyId: string) => {
    setReplies(prev => prev.map(r => 
        r.id === replyId ? { ...r, isLiked: !r.isLiked, likeCount: r.isLiked ? r.likeCount - 1 : r.likeCount + 1 } : r
    ));
    await toggleReplyLike(replyId);
  };

  const handleReplyToUser = (userName: string) => {
    const mention = `@${userName} `;
    setReplyContent((prev) => prev + mention);
    setTimeout(() => {
        textareaRef.current?.focus();
        const len = textareaRef.current?.value.length || 0;
        textareaRef.current?.setSelectionRange(len, len);
    }, 100);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpen}>
      <SheetTrigger asChild>
        <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground relative"
            title="View Thread"
        >
            <MessageSquare className="w-4 h-4" />
            {triggerCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-bold px-1 rounded-full min-w-[16px] h-[16px] flex items-center justify-center border-2 border-background shadow-sm">
                    {triggerCount}
                </span>
            )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:w-[540px] flex flex-col h-full p-0">
        <SheetHeader className="p-5 border-b bg-muted/5">
          <SheetTitle>Discussion Thread</SheetTitle>
          <SheetDescription>View context and moderate conversation.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
                {/* 1. POSTINGAN UTAMA (HIGHLIGHTED) */}
                {post && (
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6">
                        <div className="flex gap-3">
                            <Avatar className="w-10 h-10 border shadow-sm">
                                <AvatarImage src={post.user?.image || ""} />
                                <AvatarFallback>{post.user?.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold">{post.user?.name}</span>
                                        <Badge variant="outline" className="text-[10px] h-5 px-1.5">{post.topic}</Badge>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">
                                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-sm text-foreground leading-relaxed">{post.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* DIVIDER */}
                {replies.length > 0 && (
                    <div className="relative flex items-center justify-center py-2">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <span className="relative bg-background px-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            Replies ({replies.length})
                        </span>
                    </div>
                )}

                {/* 2. LIST REPLIES */}
                {replies.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm italic">
                        No replies yet.
                    </div>
                ) : (
                    replies.map((reply) => (
                    <div key={reply.id} className="flex gap-4 group">
                        <Avatar className="w-8 h-8 border mt-1 shrink-0">
                            <AvatarImage src={reply.user?.image || ""} />
                            <AvatarFallback className="text-[10px]">{reply.user?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold truncate">{reply.user?.name}</span>
                                <span className="text-[10px] text-muted-foreground">
                                    {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                </span>
                            </div>

                            <p className="text-sm text-foreground/90 leading-relaxed mb-2">{reply.content}</p>

                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => handleLike(reply.id)}
                                    className={cn("flex items-center gap-1.5 text-xs transition-colors", reply.isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500")}
                                >
                                    <Heart className={cn("w-3.5 h-3.5", reply.isLiked && "fill-current")} />
                                    {reply.likeCount > 0 && <span>{reply.likeCount}</span>}
                                </button>

                                <button 
                                    onClick={() => handleReplyToUser(reply.user?.name || "User")}
                                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Reply className="w-3.5 h-3.5" /> Reply
                                </button>

                                <button 
                                    onClick={() => handleDelete(reply.id)}
                                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 ml-auto"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                    ))
                )}
            </>
          )}
        </div>

        {/* FOOTER: REPLY FORM */}
        <div className="p-4 border-t bg-background">
            <div className="flex gap-2 items-end relative">
                <Textarea 
                    ref={textareaRef}
                    placeholder="Write a reply as Admin..." 
                    className="min-h-[44px] max-h-[120px] resize-none text-sm pr-12 py-3 bg-muted/30 focus:bg-background transition-colors"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={1}
                />
                <Button 
                    size="icon" 
                    className="absolute right-1 bottom-1 h-9 w-9" 
                    onClick={handleSubmitReply}
                    disabled={isSubmitting || !replyContent.trim()}
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}