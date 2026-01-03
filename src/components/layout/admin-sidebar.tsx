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
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

const sidebarItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Projects", href: "/dashboard/projects", icon: FolderOpen },
  { title: "Tech Stack", href: "/dashboard/tech", icon: Layers },
  { title: "Guestbook", href: "/dashboard/guestbook", icon: MessageSquare },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <nav className="flex h-screen w-64 flex-col border-r bg-card px-4 py-6">
      <div className="mb-8 flex items-center px-2">
        <h1 className="text-xl font-bold tracking-tight">
          Admin<span className="text-primary">Panel</span>
        </h1>
      </div>

      <div className="flex-1 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </div>

      <div className="mt-auto space-y-2 border-t pt-4">
        <Button variant="ghost" className="w-full justify-start gap-3" asChild>
          <Link href="/">
            <Home className="h-4 w-4" />
            Back to Website
          </Link>
        </Button>
        <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </nav>
  )
}