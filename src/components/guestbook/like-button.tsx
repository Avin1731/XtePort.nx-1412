"use client";

import { useOptimistic, useTransition } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toggleGuestbookLike, toggleReplyLike } from "@/actions/guestbook-social";
import { toast } from "sonner";

interface LikeButtonProps {
  itemId: string; // Mengganti nama prop jadi 'itemId' agar general
  initialLikes: number;
  isLiked: boolean;
  currentUserId?: string;
  isReply?: boolean; // Penanda apakah ini tombol untuk reply
}

export function LikeButton({
  itemId,
  initialLikes,
  isLiked,
  currentUserId,
  isReply = false,
}: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();

  const [optimisticState, setOptimisticState] = useOptimistic(
    { likes: initialLikes, isLiked: isLiked },
    (state, newIsLiked: boolean) => ({
      likes: newIsLiked ? state.likes + 1 : state.likes - 1,
      isLiked: newIsLiked,
    })
  );

  const handleToggle = async () => {
    if (!currentUserId) {
      toast.error("Please login to like!");
      return;
    }

    const newState = !optimisticState.isLiked;
    startTransition(() => {
      setOptimisticState(newState);
    });

    // Pilih action sesuai tipe (Postingan atau Reply)
    const action = isReply ? toggleReplyLike : toggleGuestbookLike;
    const result = await action(itemId);
    
    if (result?.error) {
      toast.error("Failed to update like");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "flex items-center gap-1.5 transition-colors",
        isReply ? "h-6 px-1.5 text-[10px]" : "h-8 px-2 text-xs",
        optimisticState.isLiked 
          ? "text-red-500 hover:text-red-600 hover:bg-red-50/10" 
          : "text-muted-foreground hover:text-red-500 hover:bg-red-50/10"
      )}
    >
      <Heart
        className={cn(
          "transition-all",
          isReply ? "w-3 h-3" : "w-4 h-4",
          optimisticState.isLiked ? "fill-current scale-110" : "scale-100"
        )}
      />
      <span className="font-medium tabular-nums">
        {optimisticState.likes > 0 ? optimisticState.likes : (isReply ? "" : "Like")}
      </span>
    </Button>
  );
}