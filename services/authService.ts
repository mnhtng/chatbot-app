import db from "@/_lib/prisma"

interface AuthProps {
    name?: string
    email: string
    password: string
}

export const login = async (email: string) => {
    const userEmail = email.trim().toLocaleLowerCase()

    return await db.user.findFirst({
        where: {
            email: userEmail,
        }
    })
}

export const signup = async ({
    name,
    email,
    password
}: AuthProps) => {
    return await db.user.create({
        data: {
            name,
            email,
            password,
            accounts: {
                create: {
                    provider: "credentials",
                    type: "system",
                    providerAccountId: email,
                }
            },
            sessions: {
                create: {
                    sessionToken: email,
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                }
            },
            Conversation: {
                create: {}
            }
        }
    })
}