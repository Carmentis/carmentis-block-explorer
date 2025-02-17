'use client';

import {atom} from "jotai/index";

const DEFAULT_NETWORK = "http://localhost:3500"
export const networkAtom = atom(
    process.env.NEXT_PUBLIC_NODE_URL || DEFAULT_NETWORK
)

/*
export const derivedChainStatusAtom = atom(async (get) => {
    const networkUrl = get(networkAtom);

    try {
        const status: GetChainStatusResponse = await Carmentis.getChainStatus(networkUrl);
        const lastBlockId = status.data.lastBlockId;

        const chainStatus = {
            lastBlockId,
            nMicroBlock: status.data.nMicroblock,
            nVirtualBlocks: status.data.nFlow,
            tableInput: {
                blockId: Math.max(lastBlockId - TABLE_ROWS_LENGTH + 1, 1),
                length: TABLE_ROWS_LENGTH,
            },
        };

        return chainStatus;
    } catch (error) {
        console.error(error);
        return null;
    }
});*/