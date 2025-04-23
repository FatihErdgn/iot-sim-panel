const { io } = require("socket.io-client");

// Connection URL
const socket = io("http://localhost:4001");

// Connection events
socket.on("connect", () => {
  console.log("Connected to server");
  console.log("Socket ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

// Example event listener
socket.on("telemetry", (data) => {
  console.log("Telemetry received:", data);
});

// Error handling
socket.on("connect_error", (err) => {
  console.log("Connection error:", err.message);
});

console.log("Connecting to socket.io server..."); 