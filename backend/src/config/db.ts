import mongoose from 'mongoose';
import { CONFIG } from './config';

export const connectDB = async (): Promise<boolean> => {
  try {
    const conn = await mongoose.connect(CONFIG.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.warn(`⚠️ MongoDB Connection Error (${error.message}). Running in mock/memory database mode.`);
    return false;
  }
};
