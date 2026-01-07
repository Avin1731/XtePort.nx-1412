"use client";

import { usePathname } from "next/navigation";
import { ChatWidget } from "@/components/chat/chat-widget";

export default function ChatWidgetWrapper() {
  const pathname = usePathname();
  
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return <ChatWidget />;
}