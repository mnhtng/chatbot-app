import { deleteInbox } from "@/services/userService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const { inboxId } = body;

        const res = await deleteInbox(inboxId);

        if (!res) {
            return NextResponse.json({
                error: "Failed to delete inbox"
            }, {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        return NextResponse.json({
            message: "Inbox deleted successfully!",
        }, {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error deleting inbox:", error);

        return NextResponse.json({
            error: "Failed to delete inbox"
        }, {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}