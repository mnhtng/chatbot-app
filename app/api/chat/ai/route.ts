import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json()

    try {
        const { prompt } = body

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "nvidia/nemotron-3-nano-30b-a3b:free",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "reasoning": { "enabled": true }
            })
        });

        const result = await response.json();
        const responseMessage = result.choices[0].message;

        const messages = [
            {
                role: 'user',
                content: prompt,
            },
            {
                role: 'assistant',
                content: responseMessage.content,
                reasoning_details: responseMessage.reasoning_details, // Pass back unmodified
            },
            {
                role: 'user',
                content: "Are you sure? Think carefully.",
            },
        ];

        const response2 = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "model": "nvidia/nemotron-3-nano-30b-a3b:free",
                "messages": messages
            })
        });

        const result2 = await response2.json();

        const message2 = result2.choices[0]?.message?.content
            ? result2.choices[0].message.content
            : "Xin lỗi, tôi hiện không có đủ thông tin để đưa ra câu trả lời chính xác cho yêu cầu của bạn.";

        return NextResponse.json({
            message: message2,
        }, {
            status: 200,
            headers: { "Content-Type": "application/json" }
        })
    } catch (error) {
        console.error("Error fetching AI response:", error);

        return NextResponse.json({
            error: "Failed to get AI response"
        }, {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }
}