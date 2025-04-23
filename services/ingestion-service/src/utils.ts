// src/utils.ts
import { MongoClient, Db } from 'mongodb';
import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

let mongoDb: Db;
let redisClient: RedisClientType;

export async function connectMongo(): Promise<Db> {
  if (!mongoDb) {
    const client = new MongoClient(process.env.MONGO_URI!);
    await client.connect();
    mongoDb = client.db(); // pulsemesh DB’si
    console.log('Connected to MongoDB');
  }
  return mongoDb;
}

export async function connectRedis(): Promise<RedisClientType> {
  if (!redisClient) {
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', err => console.error('Redis Error', err));
    await redisClient.connect();
    console.log('Connected to Redis');
  }
  return redisClient;
}
