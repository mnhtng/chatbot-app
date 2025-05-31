import mongoose, { Schema, Document } from 'mongoose'

interface InboxDocument extends Document<string> {
    name: string;
}

const inboxSchema = new Schema({
    name: {
        type: String,
        required: true,
    }
})

const InboxModel: mongoose.Model<InboxDocument> = mongoose.models?.Inboxs ?? mongoose.model<InboxDocument>('Inboxs', inboxSchema)

export default InboxModel