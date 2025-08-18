import {useWebsocketNodeUrl} from "@/hooks/useWebsocketNodeUrl";
import {useEffect, useState} from "react";
import {BlockchainFacade, NewBlockEventType, Optional} from "@cmts-dev/carmentis-sdk/client";

export default function useLatestBlockHeight(): { lastBlockHeight: Optional<number>, loading: boolean } {
    const wsUrl = useWebsocketNodeUrl();
    const [lastBlock, setLastBlock] = useState<Optional<number>>(Optional.none());

    useEffect(() => {
        const client = BlockchainFacade.createWebSocketForNode(wsUrl);
        client.addCallback({
            onNewBlock: (event: NewBlockEventType) => {
                const height = Number.parseInt(event.result.data.value.block.header.height);
                setLastBlock(Optional.some(height));
            }
        })
    }, [wsUrl]);

    if (lastBlock.isNone()) return { lastBlockHeight: lastBlock, loading: true }
    return { lastBlockHeight: lastBlock, loading: false }
}