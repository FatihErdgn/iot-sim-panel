import mqtt from "mqtt";
import { randomInt, randomFloat } from "./utils";
import dotenv from "dotenv";

dotenv.config();

// default broker URL
const MQTT_URL = process.env.MQTT_URL || "mqtt://pulsemesh-mosquitto:1883";

// default device count
const DEVICE_COUNT = 5;

// default publish interval
const PUBLISH_INTERVAL_MS = 2000;

// MQTT client create and connect
const client = mqtt.connect(MQTT_URL);

client.on("connect", () => {
  console.log(`Connected to MQTT broker at ${MQTT_URL}`);
  startPublishing();
});

client.on("error", (err) => {
  console.error("MQTT Error:", err);
  process.exit(1);
});

// data generation and publishing
function startPublishing() {
  // TODO: deviceId’leri oluştur, setInterval içinde generateTelemetry ile veri hazırla ve publish et
  const deviceIds = Array.from(
    { length: DEVICE_COUNT },
    (_, i) => `device-${i + 1}`
  );

  const publishInterval = setInterval(() => {
    deviceIds.forEach((deviceId) => {
      const payload = generateTelemetry(deviceId);
      client.publish(`devices/${deviceId}/telemetry`, JSON.stringify(payload));
    });
  }, PUBLISH_INTERVAL_MS);

}

// telemetry data type
interface Telemetry {
  deviceId: string;
  temperature: number;
  humidity: number;
  timestamp: string;
}

// random data generation function
function generateTelemetry(deviceId: string): Telemetry {
  return {
    deviceId,
    temperature: randomFloat(15, 35),
    humidity: randomFloat(30, 90),
    timestamp: new Date().toISOString(),
  };
}
