"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteGuestbookEntry } from "@/actions/admin-guestbook";
import { toast } from "sonner";

interface DeleteGuestbookButtonProps {
  id: string;
}

export function DeleteGuestbookButton({ id }: DeleteGuestbookButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure? This will delete the post and all its replies.")) return;

    startTransition(async () => {
      const res = await deleteGuestbookEntry(id);
      if (res.success) {
        toast.success("Entry deleted");
      } else {
        toast.error("Failed to delete entry");
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
      onClick={handleDelete}
      disabled={isPending}
      title="Delete Post"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </Button>
  );
}