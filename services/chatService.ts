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
