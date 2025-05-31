import { createUserInbox } from "@/services/userService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const { conversationId } = body;

        const inbox = await createUserInbox(conversationId);

        return NextResponse.json({
            message: "New chat created successfully!",
            chat: inbox
        }, {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error fetching user inboxes:", error);

        return NextResponse.json({
            error: "Failed to create new chat"
        }, {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}