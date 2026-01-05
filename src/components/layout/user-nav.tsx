import { auth, signIn, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LayoutDashboard, LogOut } from "lucide-react" 
import Link from "next/link"

export async function UserNav() {
  const session = await auth()

  if (!session?.user) {
    return (
      <form
        action={async () => {
          "use server"
          await signIn("google")
        }}
      >
        <Button variant="ghost" size="sm">
          Sign In
        </Button>
      </form>
    )
  }

  // 👇 Cek apakah user adalah admin berdasarkan email di .env
  const isAdmin = session.user.email === process.env.ADMIN_EMAIL;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* 👇 Menu Dashboard (Hanya Muncul Jika Admin) */}
        {isAdmin && (
            <>
                <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard Admin</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
            </>
        )}

        <DropdownMenuItem>
          <form
            action={async () => {
              "use server"
              // 👇 MODIFIKASI DI SINI: Redirect ke root setelah logout
              await signOut({ redirectTo: "/" })
            }}
            className="w-full"
          >
            <button type="submit" className="w-full text-left flex items-center text-red-500 hover:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}