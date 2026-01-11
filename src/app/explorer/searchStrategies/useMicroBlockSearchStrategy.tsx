import {useBlockchain} from "@/app/layout";
import {useAsync} from "react-use";
import {Hash} from "@cmts-dev/carmentis-sdk/client";

export default function useMicroBlockSearchStrategy(search: string) {
    const blockchain = useBlockchain();
    return useAsync(async () => {
        try {
            return await blockchain.getMicroblockInformation(Hash.fromHex(search).toBytes());
        } catch (e) {
            return undefined;
        }
    }, [search]);
}