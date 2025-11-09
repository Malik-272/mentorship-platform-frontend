// src/services/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:3000";

// Create one shared connection
export const socket = io(SOCKET_URL, {
  auth: {
    token: localStorage.getItem('token'),
  },
  withCredentials: true,
  autoConnect: false,
  retries: 5,
});

// Optional helpers
export function connectSocket() {
  if (!socket.connected) socket.connect();
}

export function disconnectSocket() {
  if (socket.connected) socket.disconnect();
}
