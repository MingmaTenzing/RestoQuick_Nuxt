import type { OrderDetailsWithInclude } from "~~/types/orderwithInclude";
import type websocket_payload from "~~/types/websocket_payload";

type KitchenOrderHandlers = {
  onCreated?: (order: OrderDetailsWithInclude) => void;
  onCompleted?: (order: OrderDetailsWithInclude) => void;
  onRecalled?: (order: OrderDetailsWithInclude) => void;
  onCancelled?: (order: OrderDetailsWithInclude) => void;
};

export function applyKitchenOrderEvent(
  event: websocket_payload,
  handlers: KitchenOrderHandlers,
) {
  switch (event.type) {
    case "ORDER_CREATED":
      handlers.onCreated?.(event.payload);
      break;
    case "ORDER_MARKED_COMPLETED":
      handlers.onCompleted?.(event.payload);
      break;
    case "ORDER_RECALL":
      handlers.onRecalled?.(event.payload);
      break;
    case "ORDER_CANCELLED":
      handlers.onCancelled?.(event.payload);
      break;
  }
}
