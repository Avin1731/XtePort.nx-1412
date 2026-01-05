"use client";

import { useOptimistic, useTransition } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toggleGuestbookLike } from "@/actions/guestbook-social";
import { toast } from "sonner";

interface LikeButtonProps {
  guestbookId: string;
  initialLikes: number;
  isLiked: boolean;
  currentUserId?: string; // Biar tau kalau user belum login
}

export function LikeButton({
  guestbookId,
  initialLikes,
  isLiked,
  currentUserId,
}: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();

  // Optimistic State: [likesCount, isLiked]
  const [optimisticState, setOptimisticState] = useOptimistic(
    { likes: initialLikes, isLiked: isLiked },
    (state, newIsLiked: boolean) => ({
      likes: newIsLiked ? state.likes + 1 : state.likes - 1,
      isLiked: newIsLiked,
    })
  );

  const handleToggle = async () => {
    if (!currentUserId) {
      toast.error("Please login to like messages!");
      return;
    }

    // 1. Update UI Instan (Optimistic)
    const newState = !optimisticState.isLiked;
    startTransition(() => {
      setOptimisticState(newState);
    });

    // 2. Request ke Server
    const result = await toggleGuestbookLike(guestbookId);
    
    // 3. Rollback kalau gagal
    if (result?.error) {
      toast.error("Failed to update like");
      // Secara otomatis next.js akan revalidate path dan memulihkan state asli
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "flex items-center gap-1.5 px-2 hover:text-red-500 hover:bg-red-50/10 transition-colors",
        optimisticState.isLiked ? "text-red-500" : "text-muted-foreground"
      )}
    >
      <Heart
        className={cn(
          "w-4 h-4 transition-all",
          optimisticState.isLiked ? "fill-current scale-110" : "scale-100"
        )}
      />
      <span className="text-xs font-medium tabular-nums">
        {optimisticState.likes > 0 ? optimisticState.likes : "Like"}
      </span>
    </Button>
  );
}