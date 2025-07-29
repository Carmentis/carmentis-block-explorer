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
import {BlockchainFacade, Optional} from "@cmts-dev/carmentis-sdk/client";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";


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
    const [lastBlockHeight, setLastBlockHeight] = useState<Optional<number>>(Optional.none());

    useEffect(() => {
        const client = BlockchainFacade.createWebSocketForNode(wsUrl);
        client.addCallback({
            onNewBlock: (event) => {
                const header = event.result.data.value.block.header;
                const chainId = header.chain_id;
                const height = Number.parseInt(header.height);
                setLastBlockHeight(Optional.some(height));
            }
        })
    }, [wsUrl]);

    if (lastBlockHeight.isNone()) return <>Loading...</>
    const lastHeight = lastBlockHeight.unwrap();
    const heights = [lastHeight, lastHeight-1];
    return <Table>
        <TableHead>
            <TableCell>Height</TableCell>
        </TableHead>
        <TableBody>
            {
                heights.map((height, index) => (
                    <TableRow key={height}>
                        <TableCell>{height}</TableCell>
                        <TableCell>{height}</TableCell>
                    </TableRow>
                ))
            }
        </TableBody>
    </Table>
}

function BlockRow( blockHeight: number ) {

}


