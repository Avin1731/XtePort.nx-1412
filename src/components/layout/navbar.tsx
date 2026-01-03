import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

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

        {/* Desktop Menu (Hidden on Mobile) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/about" className="transition-colors hover:text-primary">
            About
          </Link>
          <Link href="/blog" className="transition-colors hover:text-primary">
            Blog
          </Link>
          <Link href="/projects" className="transition-colors hover:text-primary">
            Projects
          </Link>
        </nav>

        {/* Right Side (Theme Toggle + Login) */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="default" size="sm">
            Login
          </Button>
        </div>
      </div>
    </header>
  )
}