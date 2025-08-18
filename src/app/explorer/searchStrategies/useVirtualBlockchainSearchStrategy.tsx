import {useBlockchain} from "@/app/layout";
import {useAsync} from "react-use";
import {Hash} from "@cmts-dev/carmentis-sdk/client";

export default function useVirtualBlockchainSearchStrategy(search: string) {
    const blockchain = useBlockchain();
    return useAsync(async () => {
        try {
            return await blockchain.getVirtualBlockchainInformation(Hash.from(search));
        } catch (e) {
            return undefined;
        }
    }, [search]);
}