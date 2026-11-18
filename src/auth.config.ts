import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export const authConfig = {
  providers: [Google],
  session: { strategy: "jwt" },
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      // Masukkan role ke session user biar bisa dibaca di frontend/middleware
      if (session.user && token.role) {
        // @ts-expect-error // (Abaikan error typescript sebentar, nanti kita fix type-nya)
        session.user.role = token.role
      }
      return session
    },
  },
} satisfies NextAuthConfig
