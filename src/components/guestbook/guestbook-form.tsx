"use client";

import { createGuestbookEntry } from "@/actions/guestbook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRef, useState } from "react";
import { Send, LogIn, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface GuestbookFormProps {
  user: { name?: string | null; image?: string | null } | undefined;
}

const TOPICS = ["General", "Tech Talk", "Feedback", "Bug Report", "Hire Me"];

export function GuestbookForm({ user }: GuestbookFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedTopic, setSelectedTopic] = useState("General");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    if (!formData.get("message")?.toString().trim()) return;

    setIsPending(true);
    formData.append("topic", selectedTopic);
    
    try {
        await createGuestbookEntry(formData);
        formRef.current?.reset();
        toast.success("Message signed to Guestbook!");
    } catch {
        toast.error("Failed to sign guestbook.");
    } finally {
        setIsPending(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-secondary/50 to-background border rounded-xl p-5 mb-8 shadow-sm">
      <div className="mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            Sign the Guestbook 
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Leave a mark, share feedback, or just say hello to the community.
          </p>
      </div>

      {user ? (
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          {/* Topic Selector */}
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
                <button
                    key={topic}
                    type="button"
                    onClick={() => setSelectedTopic(topic)}
                    className={cn(
                        "text-xs font-medium px-3 py-1.5 rounded-full border transition-all",
                        selectedTopic === topic
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-muted-foreground hover:border-foreground/50"
                    )}
                >
                    {topic}
                </button>
            ))}
          </div>

          <div className="flex gap-2">
              <Input
                name="message"
                placeholder={`Type your message in #${selectedTopic}...`}
                required
                autoComplete="off"
                className="flex-1 bg-background/50 h-11 border-muted-foreground/20 focus-visible:ring-offset-0"
              />
              <Button type="submit" size="icon" disabled={isPending} className="h-11 w-11 shrink-0 rounded-lg">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between bg-background p-4 rounded-lg border border-dashed gap-4">
            <span className="text-sm font-medium text-muted-foreground">
                Login with Google to join the discussion.
            </span>
            <Button onClick={() => signIn("google")} variant="outline" size="sm" className="gap-2 hover:bg-secondary">
                <LogIn className="h-3.5 w-3.5" />
                Login
            </Button>
        </div>
      )}
    </div>
  );
}