import { IntentKeywords } from "@/app/page";
import { getChatbotResponse, saveChatbotMessage } from "@/services/chatService";
import { normalizeString } from "@/utils/normalization";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json()

    try {
        const { prompt, conversationId, inboxId, sender } = body

        const response = await getChatbotResponse(prompt);

        // console.log(">>> Chatbot response:", response);

        const save = await saveChatbotMessage({
            prompt,
            response: typeof response[0] === 'object' && response[0] !== null && (IntentKeywords.some(keyword => normalizeString(prompt).includes(keyword)) || (response[0] as { score: number }).score >= 4)
                ? (response[0] as { content: string }).content
                : "Xin lỗi, tôi hiện không có đủ thông tin để đưa ra câu trả lời chính xác cho yêu cầu của bạn.",
            conversationId,
            inboxId,
            sender,
        });

        if (!save) {
            return NextResponse.json({
                error: "Failed to save message"
            }, {
                status: 500,
                headers: { "Content-Type": "application/json" }
            })
        }

        return NextResponse.json({
            message: "Message saved successfully!",
        }, {
            status: 200,
            headers: { "Content-Type": "application/json" }
        })
    } catch (error) {
        console.error("Error fetching user inboxes:", error);

        return NextResponse.json({
            error: "Failed to get Chatbot response"
        }, {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }
}