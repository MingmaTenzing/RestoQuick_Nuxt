import type { OrderDetailsWithInclude } from "./orderwithInclude";

export default interface websocket_payload {
  type: string;
  payload: OrderDetailsWithInclude;
}
