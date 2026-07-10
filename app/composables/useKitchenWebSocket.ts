import { useWebSocket } from "@vueuse/core";
import type websocket_payload from "~~/types/websocket_payload";

function parseKitchenWebSocketMessage(
  raw: string,
): websocket_payload | null {
  if (!raw || raw === "pong") return null;

  try {
    return JSON.parse(raw) as websocket_payload;
  } catch {
    return null;
  }
}

/** Always connect to the page origin so API broadcasts reach the same server. */
export function useKitchenWebSocketUrl() {
  return computed(() => {
    if (import.meta.server) return "";

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}/api/websocket`;
  });
}

export function useKitchenWebSocket(
  onEvent: (event: websocket_payload) => void,
) {
  const wsUrl = useKitchenWebSocketUrl();

  return useWebSocket(wsUrl, {
    immediate: import.meta.client,
    autoReconnect: {
      retries: 3,
      delay: 1000,
      onFailed() {
        alert("Failed to connect WebSocket after 3 retries");
      },
    },
    heartbeat: {
      message: "ping",
      interval: 30000,
      pongTimeout: 20000,
    },
    onMessage(_ws, event) {
      const parsed = parseKitchenWebSocketMessage(String(event.data));
      if (parsed) onEvent(parsed);
    },
  });
}
