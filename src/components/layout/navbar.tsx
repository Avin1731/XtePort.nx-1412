import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/layout/user-nav"
import { Home } from "lucide-react" // Import Icon Home

export function Navbar() {
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
          {/* 👇 Tambahan Menu Home dengan Icon */}
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

        {/* Right Side (Theme Toggle + Login) */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
}