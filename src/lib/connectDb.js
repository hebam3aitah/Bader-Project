// src/lib/connectDb.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

// تصدير الدالة كـ default
let cachedClient = null;

const connectToDatabase = async () => {
  if (!cachedClient) {
    cachedClient = await client.connect();
  }

  const db = client.db();
  return { db };
};



export default connectToDatabase;


