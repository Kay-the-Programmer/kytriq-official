import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kytriq';

// Connect to MongoDB
export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

// Disconnect from MongoDB (useful for testing and graceful shutdown)
export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Failed to disconnect from MongoDB:', error);
  }
};

// Get the mongoose connection
export const getConnection = (): mongoose.Connection => {
  return mongoose.connection;
};

// Export mongoose for use in models
export default mongoose;