import mongoose, { Schema, Document } from 'mongoose'

interface ConversationDocument extends Document<string> {
    userId: string;
    inbox: string;
}

const ConversationSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    inbox: {
        type: String,
        required: true,
    }
})

const ConversationModel: mongoose.Model<ConversationDocument> = mongoose.models?.Conversations ?? mongoose.model<ConversationDocument>('Conversations', ConversationSchema)

export default ConversationModel