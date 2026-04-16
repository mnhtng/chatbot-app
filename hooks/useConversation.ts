import db from "@/db/db"

export interface ConversationActionResult {
    id?: number
    message?: string
    error?: string
}

const createConversationName = (prompt?: string): string => {
    const fallbackName = "New Chat"
    if (!prompt) return fallbackName

    const normalizedPrompt = prompt.replace(/\s+/g, " ").trim()
    if (!normalizedPrompt) return fallbackName

    const maxLength = 60
    if (normalizedPrompt.length <= maxLength) return normalizedPrompt

    const clipped = normalizedPrompt.slice(0, maxLength).replace(/\s+\S*$/, "").trim()
    return `${clipped || normalizedPrompt.slice(0, maxLength)}...`
}

const useConversation = () => {
    const createChat = async (initialPrompt?: string): Promise<ConversationActionResult> => {
        try {
            let generatedName = createConversationName(initialPrompt)

            if (initialPrompt?.trim()) {
                const response = await fetch("/api/chat/title", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prompt: initialPrompt,
                    }),
                })

                if (response.ok) {
                    const data = await response.json()
                    if (data?.title && typeof data.title === "string") {
                        generatedName = createConversationName(data.title)
                    }
                }
            }

            const id = await db.conversations.add({
                name: generatedName,
                createdAt: new Date(),
                updatedAt: new Date(),
            })

            return { id, message: "New conversation created successfully!" }
        } catch (error) {
            return { error: error instanceof Error ? error.message : "Failed to initialize conversation" }
        }
    }

    const renameChat = async ({
        conversationId,
        newName
    }: {
        conversationId: number;
        newName: string;
    }): Promise<ConversationActionResult> => {
        try {
            await db.conversations.update(conversationId, {
                name: newName,
                updatedAt: new Date(),
            })

            return { message: "Chat renamed successfully!" }
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : "Failed to rename chat"
            }
        }
    }

    const deleteChat = async (conversationId: number): Promise<ConversationActionResult> => {
        try {
            await db.transaction("rw", db.messages, db.conversations, async () => {
                await db.messages.where("conversationId").equals(conversationId).delete()
                await db.conversations.delete(conversationId)
            })

            return { message: "Chat deleted successfully!" }
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : "Failed to delete chat"
            }
        }
    }

    return {
        createChat,
        renameChat,
        deleteChat
    }
}

export default useConversation
