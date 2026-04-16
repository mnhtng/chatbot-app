export interface ChatResponseProps {
    prompt: string
    conversationId?: number | null
    sender: string
    onStream?: (chunk: string) => void
}

import db from "@/db/db"

const useResponse = () => {
    const sendMessage = async ({
        prompt,
        sender,
        conversationId = null,
        onStream,
    }: ChatResponseProps) => {
        try {
            const response = await fetch("/api/chat/ai", {
                method: "POST",
                body: JSON.stringify({
                    prompt,
                    conversationId,
                    sender
                })
            });

            if (!response?.ok) {
                return {
                    error: "Server busy, please try again later.",
                }
            }

            if (!response.body) {
                return { error: "No response stream from server." }
            }

            if (conversationId === null) {
                return { error: "Conversation is not initialized." }
            }

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let assistantMessage = ""

            while (true) {
                const { value, done } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                if (!chunk) continue

                assistantMessage += chunk
                onStream?.(chunk)
            }

            await db.messages.bulkAdd([
                {
                    conversationId,
                    message: prompt,
                    sender,
                    createdAt: new Date(),
                },
                {
                    conversationId,
                    message: assistantMessage,
                    sender: "assistant",
                    createdAt: new Date(),
                },
            ])

            return { message: assistantMessage }
        } catch (error) {
            return { error }
        }
    }

    return {
        sendMessage,
    }
}

export default useResponse
