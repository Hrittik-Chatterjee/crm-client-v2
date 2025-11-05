import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";

export function SocketDebug() {
  const { socket, isConnected } = useSocket();
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const addLog = (message: string) => {
      setLogs((prev) => [...prev.slice(-10), `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    if (socket) {
      addLog("Socket instance exists");

      socket.on("connect", () => {
        addLog(`✅ Connected! ID: ${socket.id}`);
      });

      socket.on("disconnect", (reason) => {
        addLog(`❌ Disconnected: ${reason}`);
      });

      socket.on("connect_error", (error) => {
        addLog(`❌ Connection Error: ${error.message}`);
      });

      socket.on("new:content", (data) => {
        addLog(`📩 Received new:content event`);
      });
    } else {
      addLog("❌ No socket instance");
    }
  }, [socket]);

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg max-w-md">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="font-bold">Socket Status: {isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>
      <div className="text-xs space-y-1 max-h-40 overflow-y-auto">
        {logs.length === 0 ? (
          <div>No logs yet...</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="font-mono">{log}</div>
          ))
        )}
      </div>
    </div>
  );
}
