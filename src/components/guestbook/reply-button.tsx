"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReplyButtonProps {
  onClick: () => void;
  className?: string;
  count?: number; // Opsional: jika mau nampilin jumlah reply
}

export function ReplyButton({ onClick, className, count }: ReplyButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group",
        className
      )}
    >
      <MessageCircle className="w-4 h-4 group-hover:text-blue-500 transition-colors" />
      <span>Reply</span>
      {count !== undefined && count > 0 && (
        <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-full ml-0.5">
            {count}
        </span>
      )}
    </button>
  );
}