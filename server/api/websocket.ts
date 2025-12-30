const room = "ROOM";

export default defineWebSocketHandler({
  open(peer) {
    console.log("[ws] open", peer);
    peer.subscribe(room);
    peer.publish(room, "another user joined chat");
  },

  message(peer, message) {
    console.log("[ws] message", peer, message);
    peer.publish(room, message.text());
  },

  close(peer, event) {
    console.log("[ws] close", peer, event);
  },

  error(peer, error) {
    console.log("[ws] error", peer, error);
  },
});
