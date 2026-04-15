import { getOrCreateConversation } from "@/services/userService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const { conversationId } = body;
        const conversation = await getOrCreateConversation({ conversationId });

        return NextResponse.json({
            conversation
        }, {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error initializing conversation:", error);

        return NextResponse.json({
            error: "Failed to initialize conversation"
        }, {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
