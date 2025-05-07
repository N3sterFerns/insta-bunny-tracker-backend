import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        // const conn = await mongoose.connect("mongodb://localhost:27017/instagram-tracker");        
        const conn = await mongoose.connect(`mongodb+srv://nesterferns79:${process.env.MONGO_PASS}@cluster0.jfrmswd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); 
    }
};

