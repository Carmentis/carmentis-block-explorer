import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import {BlockchainFacade} from "@cmts-dev/carmentis-sdk/client";

export default function useBlockchainQuery() {
    const network = useAtomValue(networkAtom);
    return BlockchainFacade.createFromNodeUrl(network);
}