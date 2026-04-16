import db from "@/db/db"

export interface ConversationActionResult {
    id?: number
    message?: string
    error?: string
}

const useConversation = () => {
    const createChat = async (): Promise<ConversationActionResult> => {
        try {
            const id = await db.conversations.add({
                name: "New Chat",
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
