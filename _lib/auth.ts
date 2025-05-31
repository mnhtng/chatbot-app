import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import type { Provider } from "next-auth/providers"
import { getUserFromDb } from "@/app/api/auth"
import db from "@/_lib/prisma";
import { loginSchema } from '@/_lib/schema';
import { createUserConversation } from '@/services/userService';
// import { v4 as uuid } from "uuid";
// import { encode as defaultEncode } from "next-auth/jwt";

const adapter = PrismaAdapter(db)

const providers: Provider[] = [
    Credentials({
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            if (!credentials) return null

            const validatedCredentials = await loginSchema.safeParse(credentials)

            if (!validatedCredentials.success) {
                return null
            }

            const { email, password } = validatedCredentials.data
            return await getUserFromDb(email, password)
        },
    }),
    Google,
    Github,
    // Google({
    //     clientId: process.env.GOOGLE_CLIENT_ID || "",
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    //     authorization: {
    //         params: {
    //             prompt: "consent",
    //             access_type: "offline",
    //             response_type: "code",
    //         },
    //     },
    // }),
    // Github({
    //     clientId: process.env.AUTH_GITHUB_ID || "",
    //     clientSecret: process.env.AUTH_GITHUB_SECRET || "",
    // }),
]

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter,
    providers,
    pages: {
        signIn: "/login",
        error: "/error",
    },
    callbacks: {
        async jwt({ token, account, user }) {
            if (account && user) {
                token.id = user.id;
                token.provider = account.provider;
            }

            // console.log(">>> JWT: ", token);
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                const conversation = await createUserConversation({
                    userId: token.id as string,
                })

                session.user.id = token.id as string;
                session.user.provider = token.provider as string;
                session.user.conversation = conversation.id;
            }

            // console.log(">>> Session: ", session);
            return session;
        },
    },
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
    jwt: {
        // encode: async function (params) {
        //     if (params.token?.provider === "credentials") {
        //         const sessionToken = uuid();
        //         if (!params.token.sub) {
        //             throw new Error("No user ID found in token");
        //         }

        //         const createdSession = await adapter?.createSession?.({
        //             sessionToken: sessionToken,
        //             userId: params.token.sub,
        //             expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        //         });

        //         if (!createdSession) {
        //             throw new Error("Failed to create session");
        //         }

        //         return sessionToken;
        //     }

        //     return defaultEncode(params);
        // },
    },
    trustHost: true,
})