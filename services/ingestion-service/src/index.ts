import mqtt from 'mqtt';
import { connectMongo, connectRedis } from './utils';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

interface Telemetry {
  deviceId: string;
  temperature: number;
  humidity: number;
  timestamp: string;
}

async function main() {
  // 1) Set up connections
  const db = await connectMongo();
  const redis = await connectRedis();
  const collection = db.collection<Telemetry>('telemetry');

  // 2) MQTT client
  const client = mqtt.connect(process.env.MQTT_URL!);
  client.on('connect', () => {
    console.log('Connected to MQTT, subscribing…');
    client.subscribe('devices/+/telemetry');
  });

  client.on('message', async (topic, payload) => {
    try {
      // 3) JSON parse
      const data: Telemetry = JSON.parse(payload.toString());
      // 4) Write to MongoDB
      await collection.insertOne(data);
      // 5) Redis Pub/Sub
      await redis.publish('iot:telemetry', JSON.stringify(data));
      // 6) Redis cache: latest value
      await redis.hSet(`device:${data.deviceId}:latest`, {
        temperature: data.temperature.toString(),
        humidity: data.humidity.toString(),
        timestamp: data.timestamp
      });
      console.log(`→ Processed ${data.deviceId}@${data.timestamp}`);
    } catch (err) {
      console.error('Processing error:', err);
    }
  });

  client.on('error', err => {
    console.error('MQTT Error', err);
    process.exit(1);
  });
}

main().catch(err => console.error(err));
