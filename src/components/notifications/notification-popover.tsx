"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getNotifications, markAllNotificationsAsRead } from "@/actions/notifications";
import { NotificationItem } from "./notification-item";
import { ScrollArea } from "@/components/ui/scroll-area"; // Pastikan sudah di-install
import { toast } from "sonner";

// 1. Definisi Tipe Data (Biar gak error 'any')
interface Notification {
  id: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  triggerUser: {
    name: string | null;
    image: string | null;
  } | null;
}

export function NotificationPopover() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // 2. Logic Fetch dipindah ke dalam useEffect atau dipanggil aman
  useEffect(() => {
    let isMounted = true;

    const fetchNotifs = async () => {
      const data = await getNotifications();
      if (isMounted) {
        // Casting manual karena data dari server action kadang dianggap unknown/any
        const typedData = data as unknown as Notification[];
        setNotifications(typedData);
        setUnreadCount(typedData.filter((n) => !n.isRead).length);
      }
    };

    fetchNotifs();
    
    // Polling interval
    const interval = setInterval(fetchNotifs, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Fetch ulang saat popover dibuka manual
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      getNotifications().then((data) => {
         const typedData = data as unknown as Notification[];
         setNotifications(typedData);
         setUnreadCount(typedData.filter((n) => !n.isRead).length);
      });
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    toast.success("All notifications marked as read");
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
            <h4 className="font-semibold text-sm">Notifications</h4>
            {unreadCount > 0 && (
                <Button 
                    variant="ghost" 
                    size="sm" // 3. Ganti 'xs' jadi 'sm' (Gunakan className untuk mengecilkan)
                    className="h-6 text-[10px] gap-1 text-muted-foreground hover:text-primary px-2"
                    onClick={handleMarkAllRead}
                >
                    <CheckCheck className="w-3 h-3" />
                    Mark all read
                </Button>
            )}
        </div>
        
        <ScrollArea className="h-[300px]">
            {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-8 text-muted-foreground">
                    <Bell className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-xs">No notifications yet</p>
                </div>
            ) : (
                <div className="p-1">
                    {notifications.map((notif) => (
                        <NotificationItem 
                            key={notif.id} 
                            notification={notif} 
                            onClose={() => setIsOpen(false)} 
                        />
                    ))}
                </div>
            )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}