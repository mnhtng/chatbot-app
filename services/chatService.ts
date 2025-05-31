import db from "@/_lib/prisma";

export interface ChatMessageProps {
    prompt: string;
    response: string;
    conversationId?: string;
    inboxId?: string;
    sender: string;
}

export const saveAiMessage = async ({
    prompt,
    response,
    conversationId,
    inboxId,
    sender
}: ChatMessageProps) => {
    try {
        if (conversationId === null || inboxId === null) return null

        const [messageData, articleData] = await db.$transaction([
            db.message.createMany({
                data: [
                    {
                        conversationId,
                        inboxId,
                        message: prompt,
                        sender,
                    },
                    {
                        conversationId,
                        inboxId,
                        message: response,
                        sender: "assistant",
                    }
                ]
            }),
            db.article.create({
                data: {
                    title: prompt,
                    content: response,
                }
            })
        ]);

        return {
            message: "Message saved successfully!",
            messageData,
            articleData
        }
    } catch (error) {
        console.error("Error saving message:", error);
        throw error;
    }
}

export const saveChatbotMessage = async ({
    prompt,
    response,
    conversationId,
    inboxId,
    sender
}: ChatMessageProps) => {
    try {
        if (conversationId === null || inboxId === null) return null

        return await db.message.createMany({
            data: [
                {
                    conversationId,
                    inboxId,
                    message: prompt,
                    sender,
                },
                {
                    conversationId,
                    inboxId,
                    message: response,
                    sender: "assistant",
                }
            ]
        })
    } catch (error) {
        console.error("Error saving message:", error);
        throw error;
    }
}

export const getChatbotResponse = async (prompt: string) => {
    return await db.article.findRaw({
        filter: {
            $text: {
                $search: prompt,
                $caseSensitive: false,
                $diacriticSensitive: false
            }
        },
        options: {
            projection: { content: 1, score: { $meta: "textScore" } },
            sort: { score: { $meta: "textScore" } },
            limit: 1,
        }
    })
}