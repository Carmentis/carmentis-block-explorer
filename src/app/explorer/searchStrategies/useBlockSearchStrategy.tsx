import {useCallback} from "react";
import {useBlockchain} from "@/app/layout";
import {useAsync, useAsyncFn} from "react-use";

export default function useBlockSearchStrategy(search: string) {
    const blockchain = useBlockchain();
    return useAsync(async () => {
        // if the search is a number, it's a block id
        const parsedHeight = Number(search);
        const isNumber = !isNaN(parsedHeight)
        if (isNumber) {
            try {
                return [await blockchain.getBlockInformation(parsedHeight)];
            } catch (e) {
                return [];
            }
        } else {
            return [];
        }
    }, [search]);
}