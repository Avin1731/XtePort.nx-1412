"use client"

import { useState } from "react"
import Link from "next/link" // 👈 Import Link buat redirect
import { AdminSidebar } from "@/components/layout/admin-sidebar" 
import { Button } from "@/components/ui/button"
import { Menu, Bell, Mail, MessageSquare } from "lucide-react" // 👈 Tambah icon Bell, Mail, MessageSquare
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover" // 👈 Import Popover
import { Badge } from "@/components/ui/badge" // 👈 Import Badge

interface UserProps {
  name?: string | null
  email?: string | null
  image?: string | null
}

interface DashboardClientLayoutProps {
  children: React.ReactNode
  user: UserProps | undefined
  counts?: { messages: number; guestbook: number }
}

export function DashboardClientLayout({
  children,
  user,
  counts = { messages: 0, guestbook: 0 } 
}: DashboardClientLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // 1. Hitung Total Notif
  const totalUnread = counts.messages + counts.guestbook;

  return (
    <div className="relative flex w-full h-screen bg-background overflow-hidden">
      
      {/* AREA KONTEN */}
      <div 
        className={cn(
            "flex-1 flex flex-col h-full overflow-y-auto transition-all duration-300 ease-in-out no-scrollbar",
            isSidebarOpen ? "md:mr-[300px] lg:mr-[25%]" : "mr-0"
        )}
      >
        <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-between px-6">
                
                {/* LOGO */}
                <div className="mr-4 flex">
                    <Link href="/" className="font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
                        A-1412.dev
                    </Link>
                </div>

                {/* KANAN: NOTIFIKASI & HAMBURGER */}
                <div className="flex items-center gap-4"> {/* gap-4 biar agak lega */}
                    
                    {/* 👇 FITUR NOTIFIKASI BARU (Bell Icon) */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative rounded-full">
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                
                                {/* Badge Merah (Hanya muncul jika ada notif) */}
                                {totalUnread > 0 && (
                                    <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse border border-background" />
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 mr-6 p-0" align="end">
                            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                                <h4 className="font-semibold text-sm">Notifications</h4>
                                {totalUnread > 0 && (
                                    <Badge variant="destructive" className="text-[10px] h-5 px-1.5">
                                        {totalUnread} New
                                    </Badge>
                                )}
                            </div>
                            
                            <div className="grid">
                                {totalUnread === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground text-sm">
                                        No new notifications 💤
                                    </div>
                                ) : (
                                    <>
                                        {/* Link ke Inbox */}
                                        <Link 
                                            href="/dashboard/messages" 
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b last:border-0"
                                        >
                                            <div className="p-2 bg-blue-500/10 rounded-full text-blue-500">
                                                <Mail className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 space-y-0.5">
                                                <p className="text-sm font-medium leading-none">Inbox Messages</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {counts.messages > 0 
                                                        ? `${counts.messages} unread messages`
                                                        : "All caught up"}
                                                </p>
                                            </div>
                                            {counts.messages > 0 && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                                        </Link>

                                        {/* Link ke Guestbook */}
                                        <Link 
                                            href="/dashboard/guestbook" 
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="p-2 bg-purple-500/10 rounded-full text-purple-500">
                                                <MessageSquare className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 space-y-0.5">
                                                <p className="text-sm font-medium leading-none">Guestbook</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {counts.guestbook > 0 
                                                        ? `${counts.guestbook} new comments`
                                                        : "No new comments"}
                                                </p>
                                            </div>
                                            {counts.guestbook > 0 && <span className="h-2 w-2 rounded-full bg-purple-500" />}
                                        </Link>
                                    </>
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* HAMBURGER MENU (Muncul kalau sidebar tutup) */}
                    {!isSidebarOpen && (
                        <Button
                            variant="ghost" 
                            size="sm"
                            className="gap-2"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                            <span className="hidden sm:inline">Menu</span>
                        </Button>
                    )}
                </div>
            </div>
        </header>

        <main className="flex-1 p-6">
            {children}
        </main>
      </div>

      <aside 
        className={cn(
          "fixed inset-y-0 right-0 z-40 bg-card border-l shadow-2xl transition-transform duration-300 ease-in-out",
          "w-[85%] sm:w-[350px] lg:w-[25%]", 
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <AdminSidebar 
            user={user} 
            counts={counts} 
            onClose={() => setIsSidebarOpen(false)} 
        />
      </aside>

      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}