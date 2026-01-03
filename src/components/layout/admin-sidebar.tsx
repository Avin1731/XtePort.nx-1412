"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FolderOpen,
  Layers,
  MessageSquare,
  Home,
  LogOut,
  X,
  Moon,
  Sun
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"
import { useTheme } from "next-themes"

interface AdminSidebarProps {
  user?: { name?: string | null; image?: string | null };
  onClose?: () => void;
}

export function AdminSidebar({ user, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()

  const sidebarItems = [
    { title: "Home Website", href: "/", icon: Home }, 
    { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { title: "Projects", href: "/dashboard/projects", icon: FolderOpen },
    { title: "Tech Stack", href: "/dashboard/tech", icon: Layers },
    { title: "Guestbook", href: "/dashboard/guestbook", icon: MessageSquare },
  ]

  return (
    <div className="flex h-full flex-col bg-card"> 
      
      {/* --- TOP CONTROLS --- */}
      <div className="flex items-center justify-between px-6 pt-6">
        {/* Kiri: Theme Toggle (Border Tebal & Jelas) */}
        <Button
            variant="ghost"
            size="icon"
            className="rounded-full border-2 border-primary/20 hover:border-primary text-foreground transition-all"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Kanan: Close Button (Border Merah Tebal) */}
        <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-all" 
            onClick={onClose}
        >
            <X className="h-5 w-5" />
        </Button>
      </div>

      {/* --- PROFILE SECTION --- */}
      <div className="flex flex-col items-center text-center mt-4 mb-6">
        <div className="p-1 rounded-full border-2 border-dashed border-muted-foreground/30 mb-4">
             <Avatar className="h-24 w-24 border-4 border-card shadow-xl">
                <AvatarImage src={user?.image || ""} alt="User" />
                <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                    {user?.name?.charAt(0) || "A"}
                </AvatarFallback>
            </Avatar>
        </div>
       
        <div className="space-y-1">
           <h2 className="font-bold text-lg max-w-[220px] truncate">{user?.name || "Admin"}</h2>
           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Administrator</p>
        </div>
      </div>
      
      {/* --- NAVIGATION --- */}
      <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
        <p className="text-xs font-semibold text-muted-foreground pl-2 mb-2 uppercase tracking-widest">Main Menu</p>
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 group border",
              pathname === item.href 
                // Active: Background gelap (secondary) + Border Primary tipis
                ? "bg-secondary border-primary/20 text-primary shadow-sm" 
                : "border-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
            {item.title}
          </Link>
        ))}
      </nav>

      {/* --- FOOTER LOGOUT --- */}
      <div className="p-6 mt-auto">
        <Button 
            className="w-full justify-center gap-2 rounded-xl py-6 text-md font-bold shadow-lg shadow-red-900/20 bg-red-600 hover:bg-red-700 text-white border-2 border-red-700"
            onClick={() => signOut()}
        >
          <LogOut className="h-5 w-5" />
          Logout Session
        </Button>
      </div>
    </div>
  )
}