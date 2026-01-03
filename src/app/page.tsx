import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold tracking-tight">Setup Ready! 🚀</h1>
      <p className="text-muted-foreground">Next.js 16 + Tailwind v4 + shadcn/ui</p>
      <div className="flex gap-2">
        <Button variant="default">Primary Button</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </div>
      <ThemeToggle />
    </div>
  )
}