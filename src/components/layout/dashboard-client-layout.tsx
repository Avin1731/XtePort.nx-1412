"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/layout/admin-sidebar" 
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserProps {
  name?: string | null
  email?: string | null
  image?: string | null
}

// 👇 1. UPDATE INTERFACE
interface DashboardClientLayoutProps {
  children: React.ReactNode
  user: UserProps | undefined
  counts?: { messages: number; guestbook: number }
}

export function DashboardClientLayout({
  children,
  user,
  counts = { messages: 0, guestbook: 0 } // 👇 2. Default value object
}: DashboardClientLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

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
                <div className="mr-4 flex">
                    <span className="font-bold text-xl tracking-tight">
                        A-1412.dev
                    </span>
                </div>
                <div className="flex items-center gap-2">
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

      {/* SIDEBAR WRAPPER */}
      <aside 
        className={cn(
          "fixed inset-y-0 right-0 z-40 bg-card border-l shadow-2xl transition-transform duration-300 ease-in-out",
          "w-[85%] sm:w-[350px] lg:w-[25%]", 
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* 👇 3. OPER COUNTS KE SIDEBAR */}
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