import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { authConfig } from "@/auth.config"

const isTestAuthEnabled =
  process.env.PLAYWRIGHT_TEST === "1" &&
  !process.env.VERCEL &&
  !process.env.VERCEL_ENV &&
  Boolean(process.env.E2E_AUTH_SECRET)

const providers = [
  Google,
  ...(isTestAuthEnabled
    ? [
        Credentials({
          id: "e2e-credentials",
          name: "E2E Test Credentials",
          credentials: {
            email: { label: "Email", type: "email" },
            secret: { label: "Secret", type: "password" },
          },
          async authorize(credentials) {
            if (
              !credentials?.email ||
              typeof credentials.email !== "string" ||
              credentials.secret !== process.env.E2E_AUTH_SECRET
            ) {
              return null
            }

            const found = await db
              .select()
              .from(users)
              .where(eq(users.email, credentials.email))
              .limit(1)

            if (!found[0]) return null

            return {
              id: found[0].id,
              name: found[0].name,
              email: found[0].email,
              image: found[0].image,
            }
          },
        }),
      ]
    : []),
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db),
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token }) {
      // Ambil role terbaru dari database setiap kali token dibuat
      if (!token.sub) return token

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, token.sub))
        .limit(1)

      if (!existingUser || existingUser.length === 0) return token

      token.role = existingUser[0].role
      return token
    },
  },
})
