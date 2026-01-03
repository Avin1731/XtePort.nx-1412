import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [Google],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token }) {
      // Ambil role terbaru dari database setiap kali token dibuat
      if (!token.sub) return token;
      
      const existingUser = await db.select().from(users).where(eq(users.id, token.sub)).limit(1);
      
      if (!existingUser || existingUser.length === 0) return token;

      token.role = existingUser[0].role;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      // Masukkan role ke session user biar bisa dibaca di frontend/middleware
      if (session.user && token.role) {
        // @ts-expect-error // (Abaikan error typescript sebentar, nanti kita fix type-nya)
        session.user.role = token.role; 
      }
      return session
    },
  },
})