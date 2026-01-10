"use client";

import { toggleBlogLike } from "@/actions/blog";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface LikeButtonProps {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  isLoggedIn: boolean;
}

export function LikeButton({ postId, initialLiked, initialCount, isLoggedIn }: LikeButtonProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (!isLoggedIn) {
      toast.error("Please login to like posts");
      return;
    }

    const previousLiked = liked;
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);
    setLoading(true);

    try {
      await toggleBlogLike(postId);
      router.refresh(); 
    } catch { 
      // 👇 PERBAIKAN: Hapus (error) jadi catch saja
      setLiked(previousLiked);
      setCount(previousLiked ? count - 1 : count + 1);
      toast.error("Failed to like post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button 
        variant={liked ? "default" : "outline"} 
        size="sm" 
        onClick={handleLike} 
        disabled={loading}
        className={`gap-2 transition-all ${liked ? "bg-red-500 hover:bg-red-600 text-white" : "hover:text-red-500 hover:bg-red-50"}`}
    >
      <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
      <span>{count}</span>
    </Button>
  );
}