import { renameInbox } from "@/services/userService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const { inboxId, newName } = body;

        const res = await renameInbox({
            inboxId,
            newName
        });

        if (!res) {
            return NextResponse.json({
                error: "Failed to rename inbox"
            }, {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        return NextResponse.json({
            message: "Inbox renamed successfully!",
        }, {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error renaming inbox:", error);

        return NextResponse.json({
            error: "Failed to rename inbox"
        }, {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}