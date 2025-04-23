// src/index.ts
import http from 'http';
import { Server as IOServer } from 'socket.io';
import { connectRedis } from './utils';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  // 1) Connect to Redis
  const redis = await connectRedis();

  // 2) HTTP + Socket.IO server
  const port = parseInt(process.env.WS_PORT || '4001', 10);
  const httpServer = http.createServer();
  const io = new IOServer(httpServer, {
    cors: { origin: '*' } // For development, restrict domain in production
  });

  // 3) Subscribe to Redis channel
  const subscriber = redis.duplicate();
  await subscriber.connect();
  await subscriber.subscribe('iot:telemetry', (message) => {
    // TODO: Parse incoming JSON message and emit it
    const data = JSON.parse(message);
    io.emit('telemetry', data);
    console.log(`Telemetry data emitted: ${JSON.stringify(data)}`);
  });

  // 4) Log when a new client connects
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
  });

  // 5) Start listening to the server
  httpServer.listen(port, () => {
    console.log(`WebSocket Service listening on port ${port}`);
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
