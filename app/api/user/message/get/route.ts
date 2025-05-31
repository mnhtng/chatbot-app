import { getMessages } from "@/services/userService";
import { marked } from "marked";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const { conversationId, inboxId } = body;

        const messages = await getMessages({ conversationId, inboxId });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = messages.map((message: any) => ({
            id: message.id,
            role: message.sender === "assistant" ? "assistant" : "user",
            content: message.sender === "assistant" ? marked.parse(message.message) : message.message,
        }));

        return NextResponse.json({
            messages: res || []
        }, {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.log("Error fetching user messages:", error);

        return NextResponse.json({
            error: "Failed to get user messages"
        }, {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}