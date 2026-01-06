import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/layout/user-nav"
import { Home } from "lucide-react"
import { auth } from "@/auth" // 👈 Import auth
import { NotificationPopover } from "@/components/notifications/notification-popover" // 👈 Import Notification

export async function Navbar() { // 👈 Ubah jadi async
  const session = await auth(); // 👈 Ambil session

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold tracking-tight">
            A-1412<span className="text-primary">.dev</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="flex items-center gap-1 transition-colors hover:text-primary">
            <Home className="h-4 w-4" />
            Home
          </Link>
          
          <Link href="/about" className="transition-colors hover:text-primary">
            About
          </Link>
          <Link href="/blog" className="transition-colors hover:text-primary">
            Blog
          </Link>
          <Link href="/projects" className="transition-colors hover:text-primary">
            Projects
          </Link>
          <Link href="/guestbook" className="transition-colors hover:text-primary">
            Guestbook
          </Link>
        </nav>

        {/* Right Side (Theme Toggle + Notif + Login) */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {/* 👇 Notification Lonceng (Hanya muncul jika login) */}
          {session?.user && (
             <NotificationPopover />
          )}

          <UserNav />
        </div>
      </div>
    </header>
  )
}