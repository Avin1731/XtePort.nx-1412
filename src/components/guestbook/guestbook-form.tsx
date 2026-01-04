"use client";

import { createGuestbookEntry } from "@/actions/guestbook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRef } from "react";
import { Send, LogIn, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

interface GuestbookFormProps {
  user: {
    name?: string | null;
    image?: string | null;
  } | undefined;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="icon" disabled={pending} className="shrink-0">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
    </Button>
  );
}

export function GuestbookForm({ user }: GuestbookFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="bg-card/50 border rounded-xl p-6 shadow-sm mb-10 backdrop-blur-sm">
      <div className="mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            Sign the Guestbook 
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Public</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Leave a mark, feedback, or just say hello!
          </p>
      </div>

      {user ? (
        // --- SUDAH LOGIN ---
        <form
          ref={formRef}
          action={async (formData) => {
            await createGuestbookEntry(formData);
            formRef.current?.reset();
          }}
          className="flex gap-3"
        >
          <Input
            name="message"
            placeholder="Type your message here..."
            required
            autoComplete="off"
            className="flex-1 bg-background"
          />
          <SubmitButton />
        </form>
      ) : (
        // --- BELUM LOGIN ---
        <div className="flex flex-col sm:flex-row items-center justify-between bg-muted/30 p-4 rounded-lg border border-dashed gap-4">
            <span className="text-sm text-muted-foreground text-center sm:text-left">
                Please login to leave a message (Anti-spam).
            </span>
            <Button onClick={() => signIn("google")} variant="secondary" size="sm" className="gap-2 font-semibold">
                <LogIn className="h-4 w-4" />
                Login with Google
            </Button>
        </div>
      )}
    </div>
  );
}