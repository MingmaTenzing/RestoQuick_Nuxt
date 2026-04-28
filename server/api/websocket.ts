import type { Message, Peer } from "crossws";
import { addPeer, remove_peer } from "../utils/kitchenSocket";

const room = "KITCHEN";

export default defineWebSocketHandler({
  open(peer) {
    addPeer(peer);
    peer.subscribe(room);
  },

  message(peer, message) {
    const text = message.text();

    // HEARTBEAT HANDLING
    if (text === "ping") {
      peer.send("pong");
      console.log("pong sent");
      return;
    }
  },

  close(peer, message) {
    remove_peer(peer);
  },
});
