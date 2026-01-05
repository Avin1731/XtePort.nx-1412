"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Heart, MessageCircle } from "lucide-react";
import { markNotificationAsRead } from "@/actions/notifications";
import { useRouter } from "next/navigation";

interface NotificationItemProps {
  notification: {
    id: string;
    type: string;
    isRead: boolean;
    createdAt: Date;
    triggerUser: {
      name: string | null;
      image: string | null;
    } | null;
  };
  onClose: () => void;
}

export function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const router = useRouter();

  const handleClick = async () => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification.id);
    }
    onClose();
    // Redirect ke guestbook (bisa dikembangkan scroll ke item spesifik)
    router.push("/guestbook"); 
  };

  return (
    <div 
        onClick={handleClick}
        className={cn(
            "flex items-start gap-3 p-3 text-sm cursor-pointer transition-colors hover:bg-muted/50 rounded-md",
            !notification.isRead && "bg-blue-50/50 dark:bg-blue-900/10"
        )}
    >
      <div className="relative">
        <Avatar className="w-8 h-8 border">
          <AvatarImage src={notification.triggerUser?.image || ""} referrerPolicy="no-referrer" />
          <AvatarFallback>{notification.triggerUser?.name?.[0]}</AvatarFallback>
        </Avatar>
        {/* Icon Badge Kecil */}
        <div className={cn(
            "absolute -bottom-1 -right-1 rounded-full p-0.5 border border-background",
            notification.type === "LIKE" ? "bg-red-100 text-red-500" : "bg-blue-100 text-blue-500"
        )}>
            {notification.type === "LIKE" ? <Heart className="w-2.5 h-2.5 fill-current" /> : <MessageCircle className="w-2.5 h-2.5 fill-current" />}
        </div>
      </div>

      <div className="flex-1 space-y-0.5">
        <p className="leading-snug">
          <span className="font-semibold text-foreground">{notification.triggerUser?.name}</span>
          <span className="text-muted-foreground">
            {notification.type === "LIKE" ? " liked your post." : " replied to your comment."}
          </span>
        </p>
        <p className="text-[10px] text-muted-foreground">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>

      {!notification.isRead && (
        <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
      )}
    </div>
  );
}