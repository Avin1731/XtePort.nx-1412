"use client";

import { deletePost } from "@/actions/blog"; // Import action langsung ke sini
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface DeletePostButtonProps {
  postId: string;
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await deletePost(postId);
        toast.success("Post deleted successfully");
        setOpen(false);
      } catch (error) {
        toast.error("Failed to delete post");
        console.error(error);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
            <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            article and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
                e.preventDefault(); // Mencegah dialog nutup otomatis sebelum selesai
                handleDelete();
            }}
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            disabled={isPending}
          >
            {isPending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                </>
            ) : (
                "Delete Post"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}