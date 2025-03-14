import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import {BlockchainQueryFabric} from "@cmts-dev/carmentis-sdk/client";

export default function useBlockchainQuery() {
    const network = useAtomValue(networkAtom);
    return BlockchainQueryFabric.build(network);
}