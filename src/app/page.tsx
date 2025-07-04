'use client';

import {PropsWithChildren} from 'react';
import {PageTitle} from '@/app/components/pagetitle';
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import {} from '@cmts-dev/carmentis-sdk/client';
import {useAtomValue} from "jotai";
import {networkAtom} from "@/atoms/network.atom";
import {DynamicTableComponent} from "@/components/table.component";
import {useRouter} from "next/navigation";
import { useExplorer } from './layout';


async function loadCurrentHeight() {
    const explorer = useExplorer();
    // TODO Missing load current chain implementation
    return 0;
    /*
    return explorer.getVirtualBlockchainHashes()
    const status = await sdk.blockchain.blockchainQuery.getChainStatus()
    console.log(status)
    return status

     */
}


export default function Home() {

    return (
        <>
            <PageTitle title={"Dashboard"}></PageTitle>
            <LatestBlocks/>
        </>
    );
}

const LIMIT = 10;
function LatestBlocks() {
    const router = useRouter();
    const network = useAtomValue(networkAtom);
    sdk.blockchain.blockchainQuery.setNode(network);
    sdk.blockchain.blockchainCore.setNode(network);


    const {data, isLoading, error} = useSWR(["getCurrentHeight"], loadCurrentHeight, { refreshInterval: 1000 });
    if (error) return <>An error occurred. Error: {error}</>
    if (isLoading || !data) return <Skeleton/>
    const masterBlockIds = [];
    const lastBlockHeight = data.lastBlockHeight;
    for (let i = lastBlockHeight; i > Math.max(lastBlockHeight - LIMIT, 0); i--) {
        masterBlockIds.push(i);
    }

    async function renderRow( blockHeight: number ) {
        const blockData = await sdk.blockchain.blockchainQuery.getBlockInfoObject(blockHeight);
        return [
            <td key={0}>{blockHeight}</td>,
            <td key={1}>{blockData.isAnchored() ? "Anchored" : "Running"}</td>,
            <td key={2}>{blockData.getSize()}</td>,
            <td key={3}>{blockData.getNumberOfMicroblocks()}</td>,
            <td key={4}>{blockData.getProposerNode()}</td>,
            <td key={5}>{blockData.getProposedAt().toLocaleString()}</td>,
        ]
    }

    return <LatestBlocksDisplay>
        <DynamicTableComponent
            key={lastBlockHeight}
            header={["Block", "Status", "Size", "#Sections", "Proposer", "Proposed at"]}
            data={masterBlockIds}
            renderRow={renderRow}
            onRowClicked={(h) => {router.push(`/explorer/masterblock/${h}`)}}
        />
    </LatestBlocksDisplay>
}

function LatestBlocksDisplay({children}: PropsWithChildren) {
    return <>{children}</>
}

