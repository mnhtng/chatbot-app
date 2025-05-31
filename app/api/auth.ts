"use server"

import { AuthenticatedUser } from "@/app/page";
import { signIn, signOut } from "@/_lib/auth";
import { login } from "@/services/authService";
import { verifyPassword } from "@/utils/hashUtil";

export const loginWithGoogle = async () => {
    await signIn("google", {
        redirectTo: "/",
    })
}

export const loginWithGithub = async () => {
    await signIn("github", {
        redirectTo: "/",
    })
}

export const loginWithCredentials = async (email: string, password: string) => {
    return await signIn("credentials", {
        email,
        password,
        redirect: false,
    })
}

export const logout = async () => {
    await signOut({
        redirect: false,
    })
}

export const getUserFromDb = async (
    email: string,
    password: string,
): Promise<AuthenticatedUser | null> => {
    try {
        const user = await login(email)

        if (!user) {
            return null
        }

        const isValid = await verifyPassword(password, user.password || "");
        if (!isValid) {
            return null
        }

        return userDTO(user)
    } catch {
        return null
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userDTO = (user: any) => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
    }
}