"use client";

import { createGuestbookEntry } from "@/actions/guestbook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRef, useState } from "react";
import { Send, LogIn, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

interface GuestbookFormProps {
  user: {
    name?: string | null;
    image?: string | null;
  } | undefined;
}

const TOPICS = ["General", "Tech Talk", "Feedback", "Bug Report", "Hire Me"];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="icon" disabled={pending} className="shrink-0 h-10 w-10">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
    </Button>
  );
}

export function GuestbookForm({ user }: GuestbookFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedTopic, setSelectedTopic] = useState("General"); // Default Topic

  const handleSubmit = async (formData: FormData) => {
    formData.append("topic", selectedTopic); 
    await createGuestbookEntry(formData);
    formRef.current?.reset();
    setSelectedTopic("General");
  };

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
          action={handleSubmit}
          className="space-y-3"
        >
          {/* Topic Selection Pills */}
          <div className="flex flex-wrap gap-2 mb-2">
            {TOPICS.map((topic) => (
                <button
                    key={topic}
                    type="button"
                    onClick={() => setSelectedTopic(topic)}
                    className={cn(
                        "text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all",
                        selectedTopic === topic
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-background text-muted-foreground border-border hover:border-primary/50"
                    )}
                >
                    {topic}
                </button>
            ))}
          </div>

          <div className="flex gap-3">
              <Input
                name="message"
                placeholder={`Type your message in #${selectedTopic}...`}
                required
                autoComplete="off"
                className="flex-1 bg-background h-10"
              />
              <SubmitButton />
          </div>
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