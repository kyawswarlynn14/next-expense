import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

let isConnected: boolean = false;

export async function connectToDatabase() {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connection.readyState === 1;
  } catch (err) {
    console.log("mongo err >>", err)
  }
}
