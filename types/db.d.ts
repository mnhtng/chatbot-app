export interface Conversation {
    id?: number
    name: string
    createdAt: Date
    updatedAt: Date
}

export interface Message {
    id?: number
    conversationId: number
    message: string
    sender: string
    createdAt: Date
}
