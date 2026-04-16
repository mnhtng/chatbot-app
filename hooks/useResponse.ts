export interface ChatResponseProps {
    prompt: string
    conversationId?: number | null
    sender: string
}

import db from "@/db/db"

const useResponse = () => {
    const sendMessage = async ({
        prompt,
        sender,
        conversationId = null,
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

            const data = await response.json();

            if (data.error) {
                return { error: data.error }
            }

            if (conversationId === null) {
                return { error: "Conversation is not initialized." }
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
                    message: data.message,
                    sender: "assistant",
                    createdAt: new Date(),
                },
            ])

            return { message: data.message }
        } catch (error) {
            return { error }
        }
    }

    return {
        sendMessage,
    }
}

export default useResponse
