import {useWebsocketNodeUrl} from "@/hooks/useWebsocketNodeUrl";
import {useEffect, useState} from "react";
import {NewBlockEventType, Optional} from "@cmts-dev/carmentis-sdk/client";
import {useNodeUrl} from "@/hooks/useNodeUrl";
import {useAsync} from "react-use";

export default function useLatestBlockHeight(): { lastBlockHeight: Optional<number>, loading: boolean } {
    const wsUrl = useWebsocketNodeUrl();
    const nodeUrl = useNodeUrl();
    const [lastBlock, setLastBlock] = useState<Optional<number>>(Optional.none());
    /* TODO
    const blockchain = BlockchainFacade.createFromNodeUrl(nodeUrl);
    const {value: chainHeight, loading: loadingChainHeight} = useAsync(async () => {
        const chainInformation = await blockchain.getChainInformation();
        return chainInformation.getHeight();
    }, [nodeUrl])

    // this method is used to initially update the height of the chain
    useEffect(() => {
        const isChainHeightDefined = chainHeight !== undefined;
        const hasAlreadyLoadedChainHeight = lastBlock.isSome();
        if (!hasAlreadyLoadedChainHeight && isChainHeightDefined) {
            const optionalChainHeight: Optional<number> = Optional.of(chainHeight as number)
            setLastBlock(optionalChainHeight);
        }
    }, [chainHeight, lastBlock, loadingChainHeight]);

    // this method is used to update the height of the chain when a new block is received
    useEffect(() => {
        const client = BlockchainFacade.createWebSocketForNode(wsUrl);
        client.addCallback({
            onNewBlock: (event: NewBlockEventType) => {
                const height = Number.parseInt(event.result.data.value.block.header.height);
                setLastBlock(Optional.some(height));
            }
        })
    }, [wsUrl]);

     */

    return {
        lastBlockHeight: lastBlock,
        loading: lastBlock.isNone(),
    }
}