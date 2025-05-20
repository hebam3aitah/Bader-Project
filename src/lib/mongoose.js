
import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log('✅ Already connected to MongoDB.');
    return;
  }

  if (mongoose.connections.length > 0) {
    const connectionState = mongoose.connections[0].readyState;
    if (connectionState === 1) {
      console.log('✅ Reusing existing MongoDB connection.');
      isConnected = true;
      return;
    }
    await mongoose.disconnect();
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB || undefined,
    });
    isConnected = true;
    console.log(`✅ Connected to MongoDB: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw new Error('MongoDB connection failed!');
  }
}
