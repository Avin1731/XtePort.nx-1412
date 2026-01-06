"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { LikeButton } from "./like-button";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, MoreHorizontal, Send, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitReply } from "@/actions/guestbook-social";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Definisi tipe data yang ketat (No any)
interface GuestbookEntryProps {
  entry: {
    id: string;
    message: string;
    createdAt: Date;
    user: { name: string | null; image: string | null };
    likes: { userId: string }[];
    replies: {
      id: string;
      content: string;
      createdAt: Date;
      author: { name: string | null; image: string | null };
      likes: { userId: string }[];
    }[];
  };
  currentUserId?: string;
}

const VISIBLE_REPLIES_COUNT = 2;

export function GuestbookEntry({ entry, currentUserId }: GuestbookEntryProps) {
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const isLiked = entry.likes.some((like) => like.userId === currentUserId);
  const visibleReplies = showAllReplies ? entry.replies : entry.replies.slice(0, VISIBLE_REPLIES_COUNT);

  const getUserInitial = (name: string | null) => name ? name[0].toUpperCase() : "?";

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [replyContent]);

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !currentUserId) return;
    
    setIsSubmitting(true);
    try {
      const result = await submitReply(entry.id, replyContent.trim(), replyingTo || undefined);
      if (result?.success) {
        toast.success("Reply posted!");
        setReplyContent("");
        setShowReplyForm(false);
        setReplyingTo(null);
        // Otomatis buka reply list agar user melihat balasannya
        if (entry.replies.length >= VISIBLE_REPLIES_COUNT) setShowAllReplies(true);
        router.refresh();
      } else {
        toast.error("Failed to post reply.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplyClick = (authorName: string, replyId?: string) => {
    if (!currentUserId) {
        toast.error("Please login to reply.");
        return;
    }
    setReplyingTo(replyId || null);
    setReplyContent(authorName ? `@${authorName} ` : "");
    setShowReplyForm(true);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 p-5 bg-card/50 border rounded-xl hover:border-primary/20 transition-colors"
    >
      {/* Avatar User */}
      <Avatar className="w-10 h-10 border shrink-0 shadow-sm">
        <AvatarImage src={entry.user.image || ""} className="object-cover" />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
          {getUserInitial(entry.user.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Header */}
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-bold text-sm text-foreground">
                    {entry.user.name || "Anonymous"}
                </h4>
                <p className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                </p>
            </div>
            <button className="text-muted-foreground/50 hover:text-foreground transition-colors">
                <MoreHorizontal className="w-4 h-4" />
            </button>
        </div>

        {/* Message */}
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
          {entry.message}
        </p>

        {/* Action Bar */}
        <div className="flex items-center gap-5 pt-1">
          <LikeButton 
            itemId={entry.id} 
            initialLikes={entry.likes.length} 
            isLiked={isLiked} 
            currentUserId={currentUserId} 
          />

          <button
            onClick={() => handleReplyClick("", undefined)}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <MessageCircle className="w-4 h-4 group-hover:text-blue-500 transition-colors" />
            <span>Reply</span>
          </button>
        </div>

        {/* REPLY FORM */}
        <AnimatePresence>
            {showReplyForm && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden pt-2"
                >
                    <div className="flex gap-2 bg-muted/30 p-2 rounded-lg border focus-within:ring-1 ring-primary/50 transition-all">
                        <Textarea
                            ref={textareaRef}
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
                            className="min-h-[40px] border-none shadow-none focus-visible:ring-0 bg-transparent resize-none text-sm py-1.5 px-2"
                            rows={1}
                        />
                        <Button 
                            size="icon" 
                            className="h-8 w-8 shrink-0 self-end mb-0.5" 
                            disabled={isSubmitting || !replyContent.trim()}
                            onClick={handleSubmitReply}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                    {replyingTo && <p className="text-[10px] text-blue-500 mt-1 pl-1">Replying to comment...</p>}
                </motion.div>
            )}
        </AnimatePresence>

        {/* THREAD REPLIES */}
        <div className="space-y-4 pt-2">
            {visibleReplies.map((reply) => (
                <div key={reply.id} className="flex gap-3 relative group">
                     {/* Connector Lines */}
                    <div className="absolute -left-[27px] top-[-10px] bottom-0 w-px bg-border/40" />
                    <div className="absolute -left-[27px] top-3 w-4 h-[1.5px] bg-border/40 rounded-full" />

                    <Avatar className="w-7 h-7 border shrink-0 mt-0.5">
                        <AvatarImage src={reply.author.image || ""} />
                        <AvatarFallback className="text-[9px] bg-secondary text-secondary-foreground">
                            {getUserInitial(reply.author.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0 bg-secondary/20 p-2.5 rounded-r-lg rounded-bl-lg">
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-semibold">{reply.author.name || "Anonymous"}</span>
                            <span className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(reply.createdAt))} ago</span>
                        </div>
                        <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">
                            {reply.content}
                        </p>
                        
                        <div className="flex items-center gap-3 mt-2">
                            <LikeButton 
                                itemId={reply.id} 
                                initialLikes={reply.likes.length} 
                                isLiked={reply.likes.some(l => l.userId === currentUserId)} 
                                currentUserId={currentUserId}
                                isReply 
                            />
                             <button
                                onClick={() => handleReplyClick(reply.author.name || "User", reply.id)}
                                className="text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Reply
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* View More Button */}
            {entry.replies.length > VISIBLE_REPLIES_COUNT && (
                <button
                    onClick={() => setShowAllReplies(!showAllReplies)}
                    className="text-xs font-medium text-blue-500 hover:text-blue-600 flex items-center gap-1 ml-9 mt-1"
                >
                    {showAllReplies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {showAllReplies ? "Show less" : `View ${entry.replies.length - VISIBLE_REPLIES_COUNT} more replies`}
                </button>
            )}
        </div>
      </div>
    </motion.div>
  );
}