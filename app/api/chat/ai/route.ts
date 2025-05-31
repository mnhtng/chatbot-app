import { saveAiMessage } from "@/services/chatService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json()

    try {
        const { prompt, conversationId, inboxId, sender } = body

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-r1:free",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            })
        });

        const data = await response.json()

        const message = data.choices[0]?.message?.content
            ? data.choices[0].message.content
            : "Xin lỗi, tôi hiện không có đủ thông tin để đưa ra câu trả lời chính xác cho yêu cầu của bạn.";

        const save = await saveAiMessage({
            prompt,
            response: message,
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
            error: "Failed to get AI response"
        }, {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }
}