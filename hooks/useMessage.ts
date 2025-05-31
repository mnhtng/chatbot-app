export interface MessageProps {
    conversationId: string
    inboxId: string
}

const useMessage = () => {
    const getUserMessages = async ({
        conversationId,
        inboxId
    }: MessageProps) => {
        const response = await fetch("/api/user/message/get", {
            method: "POST",
            body: JSON.stringify({ conversationId, inboxId })
        });

        if (!response?.ok) {
            return {
                error: "Failed to get user messages in your inbox"
            }
        }

        const data = await response.json()

        if (data.error) {
            return {
                error: data.error
            }
        }

        return data.messages || []
    }

    return {
        getUserMessages,
    }
}

export default useMessage