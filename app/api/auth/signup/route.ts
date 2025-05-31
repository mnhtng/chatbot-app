import { registerSchema } from '@/_lib/schema';
import { signup } from '@/services/authService';
import { NextResponse } from 'next/server';
import { getUser } from '@/services/userService';
import { hashPassword } from '@/utils/hashUtil';

export async function POST(request: Request) {
    const body = await request.json();

    const validatedCredentials = await registerSchema.safeParse(body);
    if (!validatedCredentials.success) {
        return NextResponse.json({
            error: validatedCredentials.error.format(),
            status: 422
        });
    }

    const userEmail = validatedCredentials.data.email.trim().toLocaleLowerCase();
    const userPassword = await hashPassword(validatedCredentials.data.password.trim());
    const userName = validatedCredentials.data.name.trim();

    try {
        const existingUser = await getUser({ email: userEmail });
        if (existingUser) {
            return NextResponse.json({
                error: 'User already exists',
                status: 409
            });
        }

        const user = await signup({
            name: userName,
            email: userEmail,
            password: userPassword,
        });

        if (!user) {
            return NextResponse.json({
                error: 'Failed to create user',
                status: 404
            });
        }

        return NextResponse.json({
            user,
            status: 201
        });
    } catch (error) {
        console.error('Error:', error);

        return NextResponse.json({
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            status: 500
        });
    }
}