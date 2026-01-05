import type websocket_payload from "~~/types/websocket_payload";

type KitchenPeer = { send: (data: string) => void };

const peers = new Set<KitchenPeer>();

export const addPeer = (client: KitchenPeer) => {
  peers.add(client);
  return console.log(peers);
};
export const remove_peer = (client: KitchenPeer) => {
  return peers.delete(client);
};
export const broadCast = (data: websocket_payload) => {
  for (const peer of peers) {
    peer.send(JSON.stringify(data));
  }
};
