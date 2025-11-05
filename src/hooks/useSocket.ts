import { useEffect, useCallback } from "react";
import { socketClient } from "@/lib/socket";

export function useSocket(token?: string) {
  useEffect(() => {
    socketClient.connect(token);

    return () => {
      // Don't disconnect on unmount to maintain connection across components
      // Only disconnect when user logs out
    };
  }, [token]);

  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    const socket = socketClient.getSocket();
    if (socket) {
      socket.on(event, callback);
      return () => socket.off(event, callback);
    }
  }, []);

  const emit = useCallback((event: string, ...args: any[]) => {
    const socket = socketClient.getSocket();
    if (socket) {
      socket.emit(event, ...args);
    }
  }, []);

  const disconnect = useCallback(() => {
    socketClient.disconnect();
  }, []);

  return {
    socket: socketClient.getSocket(),
    isConnected: socketClient.isConnected(),
    on,
    emit,
    disconnect,
  };
}

export default useSocket;
