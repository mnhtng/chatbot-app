export interface ChatResponseProps {
    prompt: string
    conversationId?: string | null
    inboxId?: string | null
    sender: string
}

const useResponse = () => {
    const sendMessage = async ({
        prompt,
        sender,
        conversationId = null,
        inboxId = null,
    }: ChatResponseProps) => {
        try {
            const response = await fetch("/api/chat/ai", {
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

    return {
        sendMessage,
    }
}

export default useResponse
