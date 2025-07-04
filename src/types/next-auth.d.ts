import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      plan: string
      pdfDownloads: number
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    plan: string
    pdfDownloads: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    plan: string
    pdfDownloads: number
  }
}
