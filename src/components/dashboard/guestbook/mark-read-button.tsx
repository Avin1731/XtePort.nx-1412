"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { MailOpen, Loader2 } from "lucide-react";
import { markGuestbookAsRead } from "@/actions/admin-guestbook";
import { toast } from "sonner";

interface MarkReadButtonProps {
  id: string;
}

export function MarkReadButton({ id }: MarkReadButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleMarkRead = () => {
    startTransition(async () => {
      const res = await markGuestbookAsRead(id);
      if (res.success) {
        toast.success("Message marked as read");
      } else {
        toast.error("Failed to update status");
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleMarkRead}
      disabled={isPending}
      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
      title="Mark as Read"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <MailOpen className="w-4 h-4" />
      )}
    </Button>
  );
}