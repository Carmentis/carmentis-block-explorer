import {useBlockchain} from "@/app/layout";
import {useAsync} from "react-use";
import {Hash, CryptoEncoderFactory} from "@cmts-dev/carmentis-sdk/client";

export default function useAccountSearchStrategy(search: string) {
    const blockchain = useBlockchain();
    const stringSignatureEncoder  = CryptoEncoderFactory.defaultStringSignatureEncoder();
    return useAsync(async () => {
        // we search by the account hash
        return undefined;
        /* TODO
        try {
            const accountPublicKey = await blockchain.(Hash.from(search));
            const balance = await blockchain.getAccountBalanceFromPublicKey(accountPublicKey);
            return { publicKey: accountPublicKey, balance }

        } catch (e) {
            try {
                const accountPublicKey = stringSignatureEncoder.decodePublicKey(search);
                const balance = await blockchain.getAccountBalanceFromPublicKey(accountPublicKey);
                return { publicKey: accountPublicKey, balance }
            } catch (e) {
                return undefined;
            }
        }

         */


    }, [search]);
}