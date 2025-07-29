'use client';

import {PropsWithChildren, useEffect, useState} from 'react';
import {PageTitle} from '@/app/components/pagetitle';
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import {DynamicTableComponent} from "@/components/table.component";
import {useRouter} from "next/navigation";
import {useBlockchain, useExplorer} from './layout';
import {useNodeUrl} from "@/hooks/useNodeUrl";
import {useWebsocketNodeUrl} from "@/hooks/useWebsocketNodeUrl";
import {BlockchainFacade, NewBlockEventType, Optional} from "@cmts-dev/carmentis-sdk/client";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import Paper from "@mui/material/Paper";


async function loadCurrentHeight() {
    const explorer = useExplorer();
    // TODO Missing load current chain implementation
    return 0;
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
    const wsUrl = useWebsocketNodeUrl();
    const [lastBlock, setLastBlock] = useState<Optional<NewBlockEventType>>(Optional.none());

    useEffect(() => {
        const client = BlockchainFacade.createWebSocketForNode(wsUrl);
        client.addCallback({
            onNewBlock: (event: NewBlockEventType) => {
                setLastBlock(Optional.some(event));
            }
        })
    }, [wsUrl]);

    if (lastBlock.isNone()) return <>Loading...</>
    const block = lastBlock.unwrap();
    const lastHeight = Number.parseInt(block.result.data.value.block.header.height);
    const lastBlockProposer  = block.result.data.value.block.header.proposer_address;
    const heights = [{h: lastHeight, p:lastBlockProposer}, {h:lastHeight-1, p: ""}];
    return <Table component={Paper}>
        <TableHead>
            <TableCell>Height</TableCell>
        </TableHead>
        <TableBody>
            {
                heights.map((block, index) => (
                    <TableRow key={block.h}>
                        <TableCell>{block.h}</TableCell>
                        <TableCell>{block.p}</TableCell>
                    </TableRow>
                ))
            }
        </TableBody>
    </Table>
}

function BlockRow( blockHeight: number ) {

}


