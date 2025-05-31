import db from "@/_lib/prisma"

export const getUser = async ({
    email
}: {
    email: string
}) => {
    const userEmail = email.trim().toLocaleLowerCase()

    return await db.user.findFirst({
        where: {
            email: userEmail
        }
    })
}

export const createUserConversation = async ({
    userId
}: {
    userId: string
}) => {
    const existingConversation = await db.conversation.findFirst({
        where: {
            userId,
        }
    })

    if (!existingConversation) {
        return await db.conversation.create({
            data: {
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
    }

    return existingConversation
}

export const createUserInbox = async (
    conversationId: string
) => {
    return await db.inbox.create({
        data: {
            name: "New Chat",
            Conversation: {
                connect: {
                    id: conversationId
                }
            }
        }
    })
}

export const getInboxes = async (
    conversationId: string
) => {
    return await db.inbox.findMany({
        where: {
            conversationId,
        },
        orderBy: [
            { updatedAt: 'desc' }
        ]
    })
}

export const renameInbox = async ({
    inboxId,
    newName
}: {
    inboxId: string,
    newName: string
}) => {
    return await db.inbox.update({
        where: {
            id: inboxId,
        },
        data: {
            name: newName,
        }
    })
}

export const deleteInbox = async (inboxId: string) => {
    return await db.inbox.delete({
        where: {
            id: inboxId,
        }
    })
}

export const getMessages = async ({
    conversationId,
    inboxId
}: {
    conversationId: string,
    inboxId: string
}) => {
    return await db.message.findMany({
        where: {
            conversationId,
            inboxId,
        },
    })
}

export const searchChats = async ({
    query,
    conversationId
}: {
    query: string,
    conversationId: string
}) => {
    return await db.inbox.findMany({
        where: {
            conversationId,
            name: {
                contains: query,
                mode: 'insensitive'
            },
        },
        orderBy: [
            { updatedAt: 'desc' }
        ]
    })

    return await db.inbox.findRaw({
        filter: {
            $text: {
                $search: query,
                $caseSensitive: false,
                $diacriticSensitive: false
            }
        },
        options: {
            projection: {
                name: 1,
                Message: 1,
                score: { $meta: "textScore" }
            },
            sort: { score: { $meta: "textScore" } },
            limit: 10
        }
    })

    return await db.inbox.aggregateRaw({
        pipeline: [
            {
                $match: {
                    $text: {
                        $search: query,
                        $caseSensitive: false,
                        $diacriticSensitive: false
                    },
                    // Lọc theo conversationId dưới dạng ObjectId
                    conversationId: { $oid: conversationId }
                }
            },
            {
                $addFields: {
                    // Giữ nguyên score để sắp xếp
                    score: { $meta: "textScore" }
                }
            },
            {
                $project: {
                    _id: 0,
                    id: { $toString: "$_id" },
                    content: 1,
                    isBot: 1,
                    createdAt: 1,
                    score: 1
                }
            },
            {
                $sort: { score: -1 } // Sắp xếp giảm dần theo độ liên quan
            },
            {
                $limit: 10
            }
        ]
    })
}
