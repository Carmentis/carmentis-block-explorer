import {useBlockchain} from "@/app/layout";
import {useAsync} from "react-use";
import {Hash, StringSignatureEncoder} from "@cmts-dev/carmentis-sdk/client";

export default function useAccountSearchStrategy(search: string) {
    const blockchain = useBlockchain();
    const stringSignatureEncoder  = StringSignatureEncoder.defaultStringSignatureEncoder();
    return useAsync(async () => {
        try {
            const publicKey = stringSignatureEncoder.decodePublicKey(search);
            const balance = await blockchain.getAccountBalanceFromPublicKey(publicKey);
            return { publicKey, balance }
        } catch (e) {
            return undefined;
        }
    }, [search]);
}