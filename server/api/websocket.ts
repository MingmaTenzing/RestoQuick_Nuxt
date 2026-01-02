const room = "ROOM";
import type { Message, Peer } from "crossws";

export default defineWebSocketHandler({
  open(peer) {
    peer.subscribe(room);
    peer.publish(room, "another user joined chat");
  },

  message(peer, message) {
    console.log(message.text());

    let messageTest = JSON.parse(message.text());
    console.log(messageTest);
    console.log(messageTest.aim);
    peer.publish(room, message.text());

    peer.send({
      type: "message",
      name: "ming",
      aim: "peace",
    });
  },

  close(peer, event) {},
});
