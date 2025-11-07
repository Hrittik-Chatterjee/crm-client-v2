import { io, Socket } from "socket.io-client";
import { getCookie } from "@/utils/cookies";

// Extract base URL without any path for socket connection
const getSocketURL = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
  try {
    const url = new URL(apiUrl);
    return `${url.protocol}//${url.host}`; // Returns just http://localhost:5000
  } catch {
    return "http://localhost:5000";
  }
};

const SOCKET_URL = getSocketURL();

class SocketClient {
  private socket: Socket | null = null;

  connect(authToken?: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    // Try to get token from parameter or cookie (non-httpOnly fallback)
    const token = authToken || getCookie("token");

    this.socket = io(SOCKET_URL, {
      // Send token in auth if available, otherwise rely on cookies
      ...(token && {
        auth: {
          token: token,
        },
      }),
      withCredentials: true, // This sends httpOnly cookies automatically
      transports: ["websocket", "polling"], // Try websocket first, fallback to polling
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketClient = new SocketClient();
