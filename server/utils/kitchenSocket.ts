import websocket_payload from "../../types/websocket_payload";

type KitchenPeer = { send: (data: string) => void };

const peers = new Set<KitchenPeer>();

export const addPeer = (client: KitchenPeer) => {
  return peers.add(client);
};
export const remove_peer = (client: KitchenPeer) => {
  return peers.delete(client);
};
export const broadCast = (data: websocket_payload) => {
  for (const peer of peers) {
    peer.send(JSON.stringify(data));
  }
};
