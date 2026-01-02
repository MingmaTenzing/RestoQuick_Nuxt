import type { Message, Peer } from "crossws";
import { addPeer, remove_peer } from "../utils/kitchenSocket";

const room = "KITCHEN";
export default defineWebSocketHandler({
  open(peer) {
    addPeer(peer);
    peer.subscribe(room);
    peer.publish(room, "another user joined chat");
  },

  message(peer, message) {
    peer.send("im only visible to you at the moment");
    peer.publish(room, message.text());
  },

  close(peer, event) {
    remove_peer(peer);
    peer.publish(room, "a user left chat");
  },
});
