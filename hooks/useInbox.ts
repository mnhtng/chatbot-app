const useInbox = () => {
    const getUserInboxes = async (conversationId: string) => {
        const response = await fetch(`/api/user/inbox/get`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ conversationId }),
        })

        if (!response?.ok) {
            return {
                error: "Failed to get user inboxes"
            }
        }

        const data = await response.json()

        if (data.error) {
            return {
                error: data.error
            }
        }

        return data.inboxes || []
    }

    const createNewChat = async (conversationId: string) => {
        const response = await fetch("/api/user/inbox/create", {
            method: "POST",
            body: JSON.stringify({ conversationId })
        });

        if (!response?.ok) {
            return {
                error: "Failed to create new chat"
            }
        }

        const data = await response.json()

        if (data.error) {
            return {
                error: data.error
            }
        }

        return data.chat || {}
    }

    const renameChat = async ({
        inboxId,
        newName
    }: {
        inboxId: string;
        newName: string;
    }) => {
        const res = await fetch("/api/user/inbox/update/rename", {
            method: "POST",
            body: JSON.stringify({ inboxId, newName })
        })

        if (!res.ok) {
            return {
                error: "Failed to rename chat"
            }
        }

        const data = await res.json()

        if (data.error) {
            return {
                error: data.error
            }
        }

        return data.message
    }

    const deleteChat = async (inboxId: string) => {
        const response = await fetch("/api/user/inbox/delete", {
            method: "POST",
            body: JSON.stringify({ inboxId })
        });

        if (!response.ok) {
            return {
                error: "Failed to delete chat"
            }
        }

        const data = await response.json()

        if (data.error) {
            return {
                error: data.error
            }
        }

        return data.message
    }

    const searchChats = async ({
        query,
        conversationId
    }: {
        query: string;
        conversationId: string;
    }) => {
        const response = await fetch("/api/user/inbox/search", {
            method: "POST",
            body: JSON.stringify({ query, conversationId })
        });

        if (!response.ok) {
            return {
                error: "Failed to search chats"
            }
        }

        const data = await response.json()

        if (data.error) {
            return {
                error: data.error
            }
        }

        return data.results || []
    }

    return {
        getUserInboxes,
        createNewChat,
        renameChat,
        deleteChat,
        searchChats
    }
}

export default useInbox
