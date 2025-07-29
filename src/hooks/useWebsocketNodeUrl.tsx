import { useNodeUrl } from "./useNodeUrl";

export function useWebsocketNodeUrl() {
    const node = useNodeUrl();
    return node.replace("http", "ws").replace("https", "wss") + '/websocket'
}