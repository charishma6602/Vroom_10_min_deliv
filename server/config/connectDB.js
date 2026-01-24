import mongoose from 'mongoose'

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false, // Important for serverless
            maxPoolSize: 1, // Maintain up to 1 socket connections
        });

        isConnected = conn.connections[0].readyState === 1;
        console.log('New database connection established');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

export default connectDB;
