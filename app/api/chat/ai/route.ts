import { NextResponse } from "next/server";

const extractStreamText = (payload: unknown): string => {
    if (!payload || typeof payload !== "object") return ""

    const choice = (payload as { choices?: Array<{ delta?: { content?: unknown }; text?: unknown }> }).choices?.[0]
    if (!choice) return ""

    const deltaContent = choice.delta?.content
    if (typeof deltaContent === "string") return deltaContent

    if (Array.isArray(deltaContent)) {
        return deltaContent
            .map((part) => {
                if (typeof part === "string") return part
                if (!part || typeof part !== "object") return ""
                const text = (part as { text?: unknown }).text
                return typeof text === "string" ? text : ""
            })
            .join("")
    }

    return typeof choice.text === "string" ? choice.text : ""
}

export async function POST(request: Request) {
    const body = await request.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== "string") {
        return NextResponse.json(
            { error: "Prompt is required." },
            { status: 400 }
        )
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "nvidia/nemotron-3-nano-30b-a3b:free",
                messages: [{ role: "user", content: prompt }],
                stream: true,
                reasoning: { enabled: false },
            }),
        })

        if (!response.ok || !response.body) {
            const errorText = await response.text()
            console.error("OpenRouter error:", errorText)
            return NextResponse.json(
                { error: "Failed to get AI response" },
                { status: response.status || 500 }
            )
        }

        const encoder = new TextEncoder()
        const decoder = new TextDecoder()
        const reader = response.body.getReader()

        const stream = new ReadableStream<Uint8Array>({
            async start(controller) {
                let buffer = ""

                while (true) {
                    const { value, done } = await reader.read()
                    if (done) break

                    buffer += decoder.decode(value, { stream: true })
                    const lines = buffer.split("\n")
                    buffer = lines.pop() ?? ""

                    for (const line of lines) {
                        const trimmed = line.trim()
                        if (!trimmed.startsWith("data:")) continue

                        const data = trimmed.slice(5).trim()
                        if (!data || data === "[DONE]") continue

                        try {
                            const json = JSON.parse(data)
                            const content = extractStreamText(json)
                            if (content) {
                                controller.enqueue(encoder.encode(content))
                            }
                        } catch {
                            // ignore malformed SSE chunk
                        }
                    }
                }

                if (buffer.trim().startsWith("data:")) {
                    const data = buffer.trim().slice(5).trim()
                    if (data && data !== "[DONE]") {
                        try {
                            const json = JSON.parse(data)
                            const content = extractStreamText(json)
                            if (content) {
                                controller.enqueue(encoder.encode(content))
                            }
                        } catch {
                            // ignore malformed trailing chunk
                        }
                    }
                }

                controller.close()
            },
        })

        return new Response(stream, {
            status: 200,
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache, no-transform",
            },
        })
    } catch (error) {
        console.error("Error fetching AI response:", error)
        return NextResponse.json(
            { error: "Failed to get AI response" },
            { status: 500 }
        )
    }
}
