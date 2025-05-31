import { getInboxes } from "@/services/userService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const { conversationId } = body;

        const inboxes = await getInboxes(conversationId);

        return NextResponse.json({
            inboxes: inboxes || []
        }, {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error fetching user inboxes:", error);

        return NextResponse.json({
            error: "Failed to get user inboxes"
        }, {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}