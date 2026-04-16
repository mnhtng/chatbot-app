import { NextResponse } from "next/server";

const normalizeTitle = (title: string) => {
    const cleaned = title.replace(/^["'\s]+|["'\s]+$/g, "").replace(/\s+/g, " ").trim()
    if (!cleaned) return "New Chat"
    return cleaned.length > 60 ? `${cleaned.slice(0, 60).trim()}...` : cleaned
}

export async function POST(request: Request) {
    const body = await request.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== "string") {
        return NextResponse.json({ error: "Prompt is required." }, { status: 400 })
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "meta-llama/llama-guard-4-12b:free",
                messages: [
                    {
                        role: "user",
                        content: `Create a short chat title (max 8 words). Return only the title text.\n\nUser message: ${prompt}`,
                    },
                ],
                stream: false,
                temperature: 0.2,
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("OpenRouter title error:", errorText)
            return NextResponse.json({ error: "Failed to generate title" }, { status: response.status || 500 })
        }

        const result = await response.json()
        const rawTitle = result?.choices?.[0]?.message?.content
        const title = normalizeTitle(typeof rawTitle === "string" ? rawTitle : "")

        return NextResponse.json({ title }, { status: 200 })
    } catch (error) {
        console.error("Error generating chat title:", error)
        return NextResponse.json({ error: "Failed to generate title" }, { status: 500 })
    }
}

