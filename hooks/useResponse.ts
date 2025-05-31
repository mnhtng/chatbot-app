export interface ChatResponseProps {
    model: "ai" | "chatbot"
    prompt: string
    conversationId?: string | null
    inboxId?: string | null
    sender: string
}

const useResponse = () => {
    const sendMessage = async ({
        model,
        prompt,
        sender,
        conversationId = null,
        inboxId = null,
    }: ChatResponseProps) => {
        try {
            const response = await fetch(`/api/chat/${model}`, {
                method: "POST",
                body: JSON.stringify({
                    prompt,
                    conversationId,
                    inboxId,
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

            return { data }
        } catch (error) {
            return { error }
        }
    }

    const sendGuestMessage = async (prompt: string) => {
        try {
            const response = await fetch(`/api/chat/guest`, {
                method: "POST",
                body: JSON.stringify({ prompt })
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

            return data.response || ""
        } catch (error) {
            return { error }
        }
    }

    return {
        sendMessage,
        sendGuestMessage,
    }
}

export default useResponse
