import { string, z } from "zod";

export const registerSchema = z.object({
    name: string({ required_error: "Name is required" })
        .min(1, "Name is required")
        .min(2, "Name must be more than 2 characters"),
    email: string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    password: string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(3, "Password must be more than 3 characters")
})

export const loginSchema = z.object({
    email: string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    password: string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(3, "Password must be more than 3 characters")
})