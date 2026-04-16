import { Conversation, Message } from "@/types/db"
import { Dexie, type EntityTable } from "dexie"

const db = new Dexie("chatbot-db") as Dexie & {
    conversations: EntityTable<
        Conversation,
        "id" // primary key "id" (for the typings only)
    >
    messages: EntityTable<
        Message,
        "id"
    >
}

// Schema declaration
db.version(1).stores({
    conversations: "++id, name, createdAt, updatedAt", // primary key "id" (for the runtime!)
    messages: "++id, conversationId, message, sender, createdAt"
})

export default db
