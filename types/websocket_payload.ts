import type { OrderDetailsWithInclude } from "./orderwithInclude";

// the event type helps frontend understand and add logic accordingly.
type SocketEventType = "ORDER_CREATED" | "ORDER_MARKED_READY" | "ORDER_RECALL";

export default interface websocket_payload {
  type: SocketEventType;
  payload: OrderDetailsWithInclude;
}
