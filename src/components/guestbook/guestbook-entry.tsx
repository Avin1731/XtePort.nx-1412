"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { LikeButton } from "./like-button";
import { ReplyButton } from "./reply-button";
import { motion } from "framer-motion";

// Tipe data yang kompleks (Pesan + User + Likes + Replies)
interface GuestbookEntryProps {
  entry: {
    id: string;
    message: string;
    createdAt: Date;
    user: {
      name: string | null;
      image: string | null;
    };
    likes: { userId: string }[];
    replies: {
      id: string;
      content: string;
      createdAt: Date;
      author: {
        name: string | null;
        image: string | null;
      };
    }[];
  };
  currentUserId?: string;
}

export function GuestbookEntry({ entry, currentUserId }: GuestbookEntryProps) {
  // Cek apakah user yang login sudah like pesan ini
  const isLiked = entry.likes.some((like) => like.userId === currentUserId);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 p-4 border rounded-xl bg-card/50 hover:bg-card/80 transition-colors"
    >
      {/* Avatar User Utama */}
      <Avatar className="w-10 h-10 border">
        <AvatarImage 
            src={entry.user.image || ""} 
            alt={entry.user.name || "User"} 
            referrerPolicy="no-referrer" // 👈 WAJIB ADA: Biar gambar Google muncul
        />
        <AvatarFallback>{entry.user.name?.[0] || "?"}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        {/* Header Pesan */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{entry.user.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Isi Pesan Utama */}
        <p className="text-sm text-foreground/90 leading-relaxed">
          {entry.message}
        </p>

        {/* Action Buttons (Like & Reply) */}
        <div className="flex items-center gap-4 pt-2 border-t border-border/40 mt-3">
          <LikeButton
            guestbookId={entry.id}
            initialLikes={entry.likes.length}
            isLiked={isLiked}
            currentUserId={currentUserId}
          />
          
          <ReplyButton
            guestbookId={entry.id}
            authorName={entry.user.name || "User"}
            currentUserId={currentUserId}
          />
        </div>

        {/* --- THREAD BALASAN (REPLIES) --- */}
        {entry.replies.length > 0 && (
          <div className="mt-4 space-y-3 pl-4 border-l-2 border-border/50">
            {entry.replies.map((reply) => (
              <div key={reply.id} className="flex gap-3 bg-muted/30 p-3 rounded-lg">
                <Avatar className="w-6 h-6 mt-1">
                  <AvatarImage 
                    src={reply.author.image || ""} 
                    referrerPolicy="no-referrer" // 👈 WAJIB ADA: Untuk avatar reply juga
                  />
                  <AvatarFallback className="text-[10px]">{reply.author.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold">{reply.author.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(reply.createdAt))} ago
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {reply.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}