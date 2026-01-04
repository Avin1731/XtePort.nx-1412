"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

// --- TYPE & DATA ---
type Message = {
  id: string;
  text: string;
  sender: 'bot' | 'user';
};

const FAQ_DATA = [
  { id: 1, question: "Who are you?", answer: "I'm Avin, a Fullstack Developer specializing in Next.js & Laravel." },
  { id: 2, question: "Tech stack?", answer: "My arsenal: Next.js 15, Tailwind v4, TypeScript, Drizzle ORM, and Kotlin." },
  { id: 3, question: "Open for work?", answer: "Always! I'm open for freelance or full-time opportunities. Let's talk." },
  { id: 4, question: "Contact info?", answer: "You can email me at example@email.com or reach out via LinkedIn." },
  { id: 5, question: "Location?", answer: "I am currently based in Indonesia, available for remote work worldwide." },
  { id: 6, question: "Pricing?", answer: "Depends on the project scope. Let's discuss your needs first!" },
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', text: "👋 Hi there! I'm A-1412's AI assistant. How can I help you today?", sender: 'bot' }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const chipsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleQuestionClick = async (q: string, a: string) => {
    const userMsg: Message = { id: crypto.randomUUID(), text: q, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const botMsg: Message = { id: crypto.randomUUID(), text: a, sender: 'bot' };
    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  // --- LOGIC SCROLL HALUS ---
  const scrollChips = (direction: 'left' | 'right') => {
    if (chipsContainerRef.current) {
      // scrollBy dengan behavior smooth agar "mengalir"
      chipsContainerRef.current.scrollBy({
        left: direction === 'left' ? -150 : 150, // Jarak dikurangi biar ga lompat jauh
        behavior: 'smooth'
      });
    }
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4"
      style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="origin-bottom-right"
          >
            {/* CONTAINER */}
            <div className="w-[360px] h-[500px] flex flex-col rounded-3xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/10">
              
              {/* HEADER */}
              <div className="bg-primary/10 p-4 flex items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border border-primary/20 shadow-sm">
                            <Bot className="h-6 w-6 text-primary" />
                        </div>
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-foreground">A-1412 Assistant</h3>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-yellow-500 fill-yellow-500" /> AI Powered
                        </p>
                    </div>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full hover:bg-background/50 text-muted-foreground" 
                    onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* CHAT AREA */}
              <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 scroll-smooth bg-gradient-to-b from-transparent to-background/5">
                {messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={cn("flex gap-3", msg.sender === 'user' ? "justify-end" : "justify-start")}
                  >
                    {msg.sender === 'bot' && (
                        <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1 border border-border">
                            <Bot className="h-4 w-4 text-muted-foreground" />
                        </div>
                    )}
                    
                    <div className={cn(
                        "p-3.5 text-sm max-w-[85%] leading-relaxed shadow-sm",
                        msg.sender === 'user' 
                            ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm" 
                            : "bg-secondary/80 text-secondary-foreground border border-border/50 rounded-2xl rounded-tl-sm backdrop-blur-sm"
                    )}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                        <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1">
                            <Bot className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="bg-secondary/50 p-3 rounded-2xl rounded-tl-sm flex gap-1 items-center h-9 border border-border">
                            <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce"></span>
                        </div>
                    </motion.div>
                )}
              </div>

              {/* FOOTER */}
              <div className="p-4 pt-2 bg-background/40 backdrop-blur-md border-t border-border/50">
                 
                 {/* Chips Container with Arrows */}
                 <div className="relative flex items-center w-full mb-3 group">
                    
                    {/* BUTTON KIRI (Hanya muncul jika hover container/group biar bersih) */}
                    <button 
                        onClick={() => scrollChips('left')}
                        className="absolute left-0 z-10 p-1.5 rounded-full bg-background/90 shadow-md border border-border hover:bg-primary hover:text-primary-foreground transition-all active:scale-95 disabled:opacity-0"
                    >
                        <ChevronLeft className="h-3 w-3" />
                    </button>

                    {/* SCROLL AREA dengan MASKING GRADIENT */}
                    <div 
                        ref={chipsContainerRef}
                        className="flex gap-2 overflow-x-auto w-full px-8 no-scrollbar"
                        style={{
                            scrollbarWidth: 'none',
                            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
                        }}
                    >
                        {FAQ_DATA.map((item) => (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                key={item.id}
                                disabled={isTyping}
                                onClick={() => handleQuestionClick(item.question, item.answer)}
                                className="whitespace-nowrap px-3 py-1.5 bg-secondary text-secondary-foreground text-[11px] font-medium rounded-full hover:bg-primary hover:text-primary-foreground transition-colors border border-border shrink-0 shadow-sm cursor-pointer"
                            >
                                {item.question}
                            </motion.button>
                        ))}
                    </div>

                    {/* BUTTON KANAN */}
                    <button 
                        onClick={() => scrollChips('right')}
                        className="absolute right-0 z-10 p-1.5 rounded-full bg-background/90 shadow-md border border-border hover:bg-primary hover:text-primary-foreground transition-all active:scale-95"
                    >
                        <ChevronRight className="h-3 w-3" />
                    </button>
                 </div>
                
                {/* Input Field */}
                <form className="relative flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
                  <Input 
                    placeholder="Type a message..." 
                    className="flex-1 h-11 rounded-full bg-secondary/50 border-transparent focus:bg-background focus:border-primary/30 transition-all pl-4 pr-10 text-sm" 
                    disabled={isTyping} 
                  />
                  <Button 
                    size="icon" 
                    type="submit" 
                    disabled 
                    className="absolute right-1.5 top-1.5 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-md"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB ICON */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="h-14 w-14 rounded-full shadow-xl bg-primary text-primary-foreground flex items-center justify-center relative overflow-visible group"
      >
        <AnimatePresence mode="wait">
            {isOpen ? (
                 <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X className="h-7 w-7" />
                 </motion.div>
            ) : (
                <motion.div key="chat" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                    <MessageCircle className="h-7 w-7" />
                </motion.div>
            )}
        </AnimatePresence>
        
        {!isOpen && (
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5 translate-x-[-2px] translate-y-[2px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-background"></span>
            </span>
        )}
      </motion.button>
    </div>
  );
}