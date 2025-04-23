// src/utils.ts
import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

let redisClient: RedisClientType;

export async function connectRedis(): Promise<RedisClientType> {
  if (!redisClient) {
    redisClient = createClient({ url: process.env.REDIS_URL! });
    redisClient.on('error', err => console.error('Redis Error', err));
    await redisClient.connect();
    console.log('Connected to Redis');
  }
  return redisClient;
}
