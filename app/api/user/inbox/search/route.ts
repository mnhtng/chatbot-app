import { searchChats } from "@/services/userService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const { query, conversationId } = body;

        const inboxes = await searchChats({ query, conversationId });

        return NextResponse.json({
            results: inboxes || []
        }, {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error in search route:", error);

        return NextResponse.json({
            error: "Failed to search inboxes"
        }, {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}