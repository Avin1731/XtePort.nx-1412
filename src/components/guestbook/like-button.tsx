"use client";

import { useOptimistic, useTransition } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleGuestbookLike, toggleReplyLike } from "@/actions/guestbook-social";
import { toast } from "sonner";

interface LikeButtonProps {
  itemId: string;
  initialLikes: number;
  isLiked: boolean;
  currentUserId?: string;
  isReply?: boolean;
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
    
    // Update UI immediately (Optimistic)
    startTransition(() => {
      setOptimisticState(newState);
    });

    // Server Action
    const action = isReply ? toggleReplyLike : toggleGuestbookLike;
    const result = await action(itemId);
    
    if (result?.error) {
      toast.error("Failed to update like");
      // Revert UI if error (handled by Next.js optimistic automatically usually, but good to know)
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "flex items-center gap-1.5 transition-all group",
        isReply ? "text-[10px]" : "text-xs",
        optimisticState.isLiked ? "text-red-500" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Heart className={cn(
        "transition-transform group-active:scale-75",
        isReply ? "w-3 h-3" : "w-4 h-4",
        optimisticState.isLiked ? "fill-red-500" : "fill-transparent"
      )} />
      
      {optimisticState.likes > 0 && (
        <span className={cn(
            "font-medium tabular-nums", 
            optimisticState.isLiked && "text-red-500"
        )}>
            {optimisticState.likes}
        </span>
      )}
    </button>
  );
}