'use client';

import {useEffect, useState} from 'react';
import {PageTitle} from '@/app/components/pagetitle';
import {useExplorer} from './layout';
import {useWebsocketNodeUrl} from "@/hooks/useWebsocketNodeUrl";
import {BlockchainFacade, NewBlockEventType, Optional} from "@cmts-dev/carmentis-sdk/client";
import {Card, Grid2 as Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";
import Paper from "@mui/material/Paper";
import BlockSizeHistory from "@/components/block-size-history";
import useLatestBlockHeight from "@/hooks/useLatestBlockHeight";
import {useAsync} from "react-use";
import { useAtomValue } from 'jotai';
import { networkAtom } from '@/atoms/network.atom';
import { useRouter } from 'next/navigation';


async function loadCurrentHeight() {
    const explorer = useExplorer();
    // TODO Missing load current chain implementation
    return 0;
}


export default function Home() {

    return (
        <>
            <PageTitle title={"Dashboard"}></PageTitle>
            <Grid container spacing={2}>
                <Grid size={{ lg: 7, md: 12 }}>
                    <Card>
                        <LatestBlocks/>
                    </Card>
                </Grid>
                <Grid size={{ lg: 5, md: 12 }}>
                    <Card>
                        <Typography variant="h6">Block size history</Typography>
                        <BlockSizeHistory/>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}


function LatestBlocks() {
    const limit = 5;
    const { lastBlockHeight: lastBlock, loading } = useLatestBlockHeight();
    if (lastBlock.isNone()) return <>Loading...</>

    // compute the entries
    const entries = [];
    const lastBlockHeight = lastBlock.unwrap();
    const start = Math.max(lastBlockHeight - limit, 1);
    const end = lastBlockHeight;
    for (let i = end; i >= start; i--) {
        const component = <RowTable key={i} height={i}/>;
        entries.push(component);
    }
    return <Table component={Paper}>
        <TableHead>
            <TableCell>Height</TableCell>
        </TableHead>
        <TableBody>
            <TableRow>
                <TableCell>{lastBlockHeight + 1}</TableCell>
                <TableCell>Block hash</TableCell>
                <TableCell>Anchored at</TableCell>
                <TableCell>Micro-blocks</TableCell>
            </TableRow>
            {entries}
        </TableBody>
    </Table>
}


function RowTable({height}: {height: number}) {
    const navigation = useRouter();
    const network = useAtomValue(networkAtom);
    const [numberOfMicroblocks, setNumberOfMicroblocks] = useState("--");
    const [anchoredAt, setAnchoredAt] = useState("--");
    const [blockHash, setBlockHash] = useState("--");
    const {loading } = useAsync(async () => {
        const blockchain = BlockchainFacade.createFromNodeUrl(network);
        const info = await blockchain.getBlockInformation(height);
        const content = await blockchain.getBlockContent(height);
        setAnchoredAt(info.anchoredAt().toLocaleString())
        setBlockHash(info.getBlockHash().encode());
        setNumberOfMicroblocks(content.numberOfContainedMicroBlocks().toString());
    })

    function goToBlock() {
        navigation.push(`/explorer/block/${height}`);
    }

    return <TableRow key={height} onClick={goToBlock} sx={{cursor: "pointer"}}>
        <TableCell>{height}</TableCell>
        <TableCell>{blockHash}</TableCell>
        <TableCell>{anchoredAt}</TableCell>
        <TableCell>{numberOfMicroblocks}</TableCell>
    </TableRow>
}

