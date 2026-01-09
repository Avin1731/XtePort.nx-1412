import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard")
  
  const isAdmin = req.auth?.user?.role === "admin"

  if (isDashboardPage) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/api/auth/signin", req.nextUrl))
    }
    
    if (!isAdmin) {
      // Kalau login tapi bukan admin, lempar balik ke home
      return NextResponse.redirect(new URL("/", req.nextUrl))
    }
  }

  return NextResponse.next()
})

// Tentukan rute mana saja yang dijaga satpam
export const config = {
  matcher: ["/dashboard/:path*"],
}