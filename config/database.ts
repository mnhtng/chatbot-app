// Config + Models: not use in this project
import mongoose from "mongoose";

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL || "", {
            dbName: process.env.MONGODB_NAME
        });

        return true
    } catch (error) {
        console.error("Error connecting to MongoDB: ", error);
        return false
    }
}

export default connection;