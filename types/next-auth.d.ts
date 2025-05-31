import { DefaultSession } from "next-auth"

export interface User {
    id: string
    name?: string
    email?: string
    image?: string
    provider?: string
    conversation?: string
    access_token?: string
    refresh_token?: string
}

declare module "next-auth" {
    interface Session {
        user: User & DefaultSession["user"]
        access_token: string
        refresh_token: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: User
        access_token: string
        refresh_token: string
    }
}
