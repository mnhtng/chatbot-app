import mongoose, { Schema, Document } from 'mongoose'

interface UserDocument extends Document<string> {
    name?: string;
    email?: string;
    password?: string;
    image?: string;
}

const UserSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (value: string) => /^[\w-\.]{3,}@([\w-]+\.)+[\w-]{2,4}$/.test(value),
            message: props => `${props.value} is not a valid email address`
        }
    },
    password: {
        type: String,
        min: 3
    },
    image: {
        type: String,
        default: null,
    }
})

const UserModel: mongoose.Model<UserDocument> = mongoose.models?.Users ?? mongoose.model<UserDocument>('Users', UserSchema)

export default UserModel