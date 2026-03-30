import { MongoClient, Db } from 'mongodb';
import 'dotenv/config';

const url = process.env.MONGODB_URI!;
const dbName = process.env.DB_NAME;
const client = new MongoClient(url);
let db: Db;

export const connectDb = async (): Promise<Db> => {
  if (db) return db;
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
