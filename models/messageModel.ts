import mongoose, { Schema, Document } from 'mongoose'

interface MessageDocument extends Document<string> {
    inboxId: string;
    message: string;
}

const messageSchema = new Schema({
    inboxId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
})

const MessageModel: mongoose.Model<MessageDocument> = mongoose.models?.Messages ?? mongoose.model<MessageDocument>('Messages', messageSchema)

export default MessageModel