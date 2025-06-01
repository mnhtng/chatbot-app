import { getInboxes } from "@/services/userService";
import { normalizeString } from "@/utils/normalization";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const { query, conversationId } = body;

        const getUserInboxes = await getInboxes(conversationId)

        const inboxes = getUserInboxes.filter((inbox) => {
            return normalizeString(inbox.name).includes(normalizeString(query))
        })

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