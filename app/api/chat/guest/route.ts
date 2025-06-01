import { getChatbotResponse } from "@/services/chatService";
import { marked } from "marked";
import { NextResponse } from "next/server";
import { normalizeString } from "@/utils/normalization";
import { IntentKeywords } from "@/app/page";

export async function POST(request: Request) {
    const body = await request.json()

    try {
        const { prompt } = body

        const response = await getChatbotResponse(prompt);

        // console.log(">>> Chatbot response:", response);

        return NextResponse.json({
            message: "Message saved successfully!",
            response: typeof response[0] === 'object' && response[0] !== null && (IntentKeywords.some(keyword => normalizeString(prompt).includes(keyword)) || (response[0] as { score: number }).score >= 4)
                ? marked.parse((response[0] as { content: string }).content)
                : "Xin lỗi, tôi hiện không có đủ thông tin để đưa ra câu trả lời chính xác cho yêu cầu của bạn.",
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